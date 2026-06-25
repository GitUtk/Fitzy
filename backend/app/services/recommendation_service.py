import os
import io
import numpy as np
import pandas as pd
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

class RecommendationService:
    def __init__(self):
        self.df_labels = None
        self.db_embeddings_norm = None
        self.feature_extractor = None
        self.preprocess = None
        self.initialized = False

    def initialize(self):
        if self.initialized:
            return

        # Resolve paths relative to repository root
        current_file_path = os.path.abspath(__file__)
        repo_root = current_file_path
        # Go up 4 levels to get from backend/app/services/recommendation_service.py to Fitzy/
        # services -> app -> backend -> repo root
        for _ in range(4):
            repo_root = os.path.dirname(repo_root)

        csv_path = os.path.join(repo_root, "ml", "dataset", "labels.csv")
        embeddings_path = os.path.join(repo_root, "ml", "dataset", "embeddings.npy")

        if not os.path.exists(csv_path):
            raise RuntimeError(f"Metadata file not found at {csv_path}")
        if not os.path.exists(embeddings_path):
            raise RuntimeError(f"Embeddings file not found at {embeddings_path}")

        self.df_labels = pd.read_csv(csv_path).fillna("")
        db_embeddings = np.load(embeddings_path)

        # Normalize precomputed embeddings
        norms = np.linalg.norm(db_embeddings, axis=1, keepdims=True)
        norms = np.where(norms == 0, 1e-10, norms)
        self.db_embeddings_norm = db_embeddings / norms

        # Load ResNet50 model for feature extraction
        resnet = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        self.feature_extractor = torch.nn.Sequential(*(list(resnet.children())[:-1]))
        self.feature_extractor.eval()

        self.preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            ),
        ])
        self.initialized = True

    def find_similar(self, file_bytes: bytes, top_k: int = 6):
        self.initialize()

        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        tensor = self.preprocess(image).unsqueeze(0)

        with torch.no_grad():
            feat = self.feature_extractor(tensor)
            query_embedding = feat.squeeze().numpy()

        query_norm = np.linalg.norm(query_embedding)
        if query_norm == 0:
            query_norm = 1e-10
        query_embedding_norm = query_embedding / query_norm

        similarities = np.dot(self.db_embeddings_norm, query_embedding_norm)
        top_k_indices = np.argsort(similarities)[::-1][:top_k]

        results = []
        for idx in top_k_indices:
            row = self.df_labels.iloc[idx]
            similarity_score = float(similarities[idx])

            results.append({
                "rank": len(results) + 1,
                "image": row["image"],
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
        return results

recommendation_service = RecommendationService()
