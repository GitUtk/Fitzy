import os
import io
import numpy as np
import pandas as pd
import onnxruntime as ort
from PIL import Image

class RecommendationService:
    def __init__(self):
        self.df_labels = None
        self.db_embeddings_norm = None
        self.ort_session = None
        self.initialized = False

    def initialize(self):
        if self.initialized:
            return

        # Resolve paths relative to repository root
        current_file_path = os.path.abspath(__file__)
        services_dir = os.path.dirname(current_file_path)
        app_dir = os.path.dirname(services_dir)
        backend_dir = os.path.dirname(app_dir)
        repo_root = os.path.dirname(backend_dir)

        csv_path = os.path.join(repo_root, "frontend", "public", "static", "labels.csv")
        embeddings_path = os.path.join(repo_root, "frontend", "public", "static", "embeddings.npy")
        onnx_path = os.path.join(services_dir, "resnet50_features.onnx")

        if not os.path.exists(csv_path):
            raise RuntimeError(f"Metadata file not found at {csv_path}")
        if not os.path.exists(embeddings_path):
            raise RuntimeError(f"Embeddings file not found at {embeddings_path}")
        if not os.path.exists(onnx_path):
            raise RuntimeError(f"ONNX model file not found at {onnx_path}")

        self.df_labels = pd.read_csv(csv_path).fillna("")
        db_embeddings = np.load(embeddings_path)

        # Normalize precomputed embeddings
        norms = np.linalg.norm(db_embeddings, axis=1, keepdims=True)
        norms = np.where(norms == 0, 1e-10, norms)
        self.db_embeddings_norm = db_embeddings / norms

        # Initialize CPU-optimized ONNX runtime session with single thread to minimize RAM usage
        sess_options = ort.SessionOptions()
        sess_options.intra_op_num_threads = 1
        sess_options.inter_op_num_threads = 1
        sess_options.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
        sess_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

        self.ort_session = ort.InferenceSession(onnx_path, sess_options, providers=['CPUExecutionProvider'])
        self.initialized = True

    def preprocess_image(self, image: Image.Image) -> np.ndarray:
        # Resize shorter side to 256
        w, h = image.size
        if w < h:
            new_w = 256
            new_h = int(h * (256 / w))
        else:
            new_h = 256
            new_w = int(w * (256 / h))
        image = image.resize((new_w, new_h), Image.BILINEAR)

        # Center crop to 224x224
        left = (new_w - 224) / 2
        top = (new_h - 224) / 2
        right = (new_w + 224) / 2
        bottom = (new_h + 224) / 2
        image = image.crop((left, top, right, bottom))

        # Convert to numpy array and scale to [0, 1]
        img_data = np.array(image).astype(np.float32) / 255.0

        # Normalize with ImageNet mean and standard deviation
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        img_data = (img_data - mean) / std

        # Transpose from (H, W, C) to (C, H, W) and add batch dimension: (1, C, H, W)
        img_data = np.transpose(img_data, (2, 0, 1))
        img_data = np.expand_dims(img_data, axis=0)
        return img_data

    def find_similar(self, file_bytes: bytes, top_k: int = 6):
        self.initialize()

        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        img_data = self.preprocess_image(image)

        # Run ONNX inference
        inputs = {self.ort_session.get_inputs()[0].name: img_data}
        outputs = self.ort_session.run(None, inputs)
        
        # ResNet50 feature extractor output shape is [1, 2048, 1, 1], squeeze it to 2048
        query_embedding = np.squeeze(outputs[0])

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
                "image_url": f"/static/images/{row['image']}",
                "product_id": str(row["product_id"]),
                "title": row["title"],
                "color": row["color"],
                "fit": row["fit"],
                "pattern": row["pattern"],
                "material": row["material"],
                "price": float(row["price"]) if row["price"] != "" else None,
                "rating": float(row["rating"]) if row["rating"] != "" else None,
                "category": row["category"],
                "wear_type": row.get("wear_type", ""),
                "product_url": row.get("product_url", "https://www.snitch.com/"),
                "similarity": similarity_score
            })
        return results

    def search_products(self, query: str, category: str = None, limit: int = 5) -> list:
        self.initialize()
        df = self.df_labels.copy()
        if category:
            category_lower = category.lower()
            if "t-shirt" in category_lower or "polo" in category_lower:
                df = df[df["category"].str.lower().str.contains("t-shirt|polo", na=False)]
            else:
                df = df[df["category"].str.lower().str.contains(category_lower, na=False)]
        keywords = [kw.lower() for kw in query.split() if len(kw) > 1]
        scores = []
        for idx, row in df.iterrows():
            score = 0
            text_to_search = f"{row['title']} {row['color']} {row['fit']} {row['pattern']} {row['material']} {row['category']}".lower()
            for kw in keywords:
                if kw in text_to_search:
                    score += 1
            scores.append((score, idx))
        scores.sort(key=lambda x: x[0], reverse=True)
        top_indices = [idx for score, idx in scores[:limit]]
        results = []
        for idx in top_indices:
            row = self.df_labels.iloc[idx]
            results.append({
                "image": row["image"],
                "image_url": f"/static/images/{row['image']}",
                "product_id": str(row["product_id"]),
                "title": row["title"],
                "color": row["color"],
                "fit": row["fit"],
                "pattern": row["pattern"],
                "material": row["material"],
                "price": float(row["price"]) if row["price"] != "" else None,
                "rating": float(row["rating"]) if row["rating"] != "" else None,
                "category": row["category"],
                "wear_type": row.get("wear_type", ""),
                "product_url": row.get("product_url", "https://www.snitch.com/")
            })
        return results

recommendation_service = RecommendationService()
