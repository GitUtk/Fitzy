import os
import io
import numpy as np
import pandas as pd
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

app = FastAPI(
    title="Fashion Similarity Search API",
    description="Search for similar fashion products using ResNet-50 feature embeddings",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df_labels = None
db_embeddings_norm = None
feature_extractor = None
preprocess = None

@app.on_event("startup")
def startup_event():
    global df_labels, db_embeddings_norm, feature_extractor, preprocess
    
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(os.path.dirname(ml_dir), "frontend", "public", "static")
    csv_path = os.path.join(dataset_dir, "labels.csv")
    embeddings_path = os.path.join(dataset_dir, "embeddings.npy")
    
    if not os.path.exists(csv_path):
        raise RuntimeError(f"Metadata file {csv_path} not found.")
    df_labels = pd.read_csv(csv_path).fillna("")
    print(f"Loaded {len(df_labels)} products from metadata.")
    
    if not os.path.exists(embeddings_path):
        raise RuntimeError(f"Embeddings file {embeddings_path} not found.")
    db_embeddings = np.load(embeddings_path)
    print(f"Loaded embeddings array of shape {db_embeddings.shape}")
    
    norms = np.linalg.norm(db_embeddings, axis=1, keepdims=True)
    norms = np.where(norms == 0, 1e-10, norms)
    db_embeddings_norm = db_embeddings / norms
    
    print("Loading ResNet50 for online feature extraction...")
    resnet = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    feature_extractor = torch.nn.Sequential(*(list(resnet.children())[:-1]))
    feature_extractor.eval()
    
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        ),
    ])
    print("Startup complete. API is ready.")

@app.post("/search")
async def search_similar(file: UploadFile = File(...)):
    global df_labels, db_embeddings_norm, feature_extractor, preprocess
    
    if df_labels is None or db_embeddings_norm is None or feature_extractor is None:
        raise HTTPException(status_code=503, detail="Model and dataset are not loaded.")
        
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
        
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        tensor = preprocess(image).unsqueeze(0)
        
        with torch.no_grad():
            feat = feature_extractor(tensor)
            query_embedding = feat.squeeze().numpy()
            
        query_norm = np.linalg.norm(query_embedding)
        if query_norm == 0:
            query_norm = 1e-10
        query_embedding_norm = query_embedding / query_norm
        
        similarities = np.dot(db_embeddings_norm, query_embedding_norm)
        top6_indices = np.argsort(similarities)[::-1][:6]
        
        results = []
        for idx in top6_indices:
            row = df_labels.iloc[idx]
            similarity_score = float(similarities[idx])
            
            results.append({
                "rank": len(results) + 1,
                "image": row["image"],
                "local_url": f"/static/images/{row['image']}",
                "image_url": row["image_url"],
                "product_id": str(row["product_id"]),
                "title": row["title"],
                "color": row["color"],
                "fit": row["fit"],
                "pattern": row["pattern"],
                "material": row["material"],
                "price": float(row["price"]) if row["price"] != "" else None,
                "rating": float(row["rating"]) if row["rating"] != "" else None,
                "category": row["category"],
                "product_url": row.get("product_url", "https://www.snitch.com/"),
                "similarity": similarity_score
            })
            
        return {"success": True, "results": results}
        
    except Exception as e:
        print(f"Error processing search request: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/", response_class=HTMLResponse)
async def get_index():
    if os.path.exists("index.html"):
        with open("index.html", "r") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Index.html not found!</h1>")

ml_dir = os.path.dirname(os.path.abspath(__file__))
dataset_dir = os.path.join(os.path.dirname(ml_dir), "frontend", "public", "static")
if os.path.exists(dataset_dir):
    app.mount("/static", StaticFiles(directory=dataset_dir), name="static")
