import os
import io
import numpy as np
import pandas as pd
import onnxruntime as ort
from PIL import Image

class RecommendationService:
    def __init__(self):
        # Male dataset
        self.df_labels_male = None
        self.db_embeddings_norm_male = None
        
        # Female dataset
        self.df_labels_female = None
        self.db_embeddings_norm_female = None

        # Pre-cached catalog lists
        self.male_catalog = None
        self.female_catalog = None
        self.all_catalog = None
        
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

        # Men's files
        csv_path_male = os.path.join(repo_root, "frontend", "public", "static", "labels.csv")
        embeddings_path_male = os.path.join(repo_root, "frontend", "public", "static", "embeddings.npy")
        
        # Women's files
        csv_path_female = os.path.join(repo_root, "frontend", "public", "static", "lfemalesabels.csv")
        embeddings_path_female = os.path.join(repo_root, "frontend", "public", "static", "feamalesembedding.npy")
        
        onnx_path = os.path.join(services_dir, "resnet50_features.onnx")

        # Validate existence
        if not os.path.exists(csv_path_male):
            raise RuntimeError(f"Men's metadata file not found at {csv_path_male}")
        if not os.path.exists(embeddings_path_male):
            raise RuntimeError(f"Men's embeddings file not found at {embeddings_path_male}")
        if not os.path.exists(csv_path_female):
            raise RuntimeError(f"Women's metadata file not found at {csv_path_female}")
        if not os.path.exists(embeddings_path_female):
            raise RuntimeError(f"Women's embeddings file not found at {embeddings_path_female}")
        if not os.path.exists(onnx_path):
            raise RuntimeError(f"ONNX model file not found at {onnx_path}")

        # Load Men's dataset
        self.df_labels_male = pd.read_csv(csv_path_male).fillna("")
        db_embeddings_male = np.load(embeddings_path_male)
        norms_male = np.linalg.norm(db_embeddings_male, axis=1, keepdims=True)
        norms_male = np.where(norms_male == 0, 1e-10, norms_male)
        self.db_embeddings_norm_male = db_embeddings_male / norms_male

        # Load Women's dataset
        self.df_labels_female = pd.read_csv(csv_path_female).fillna("")
        db_embeddings_female = np.load(embeddings_path_female)
        norms_female = np.linalg.norm(db_embeddings_female, axis=1, keepdims=True)
        norms_female = np.where(norms_female == 0, 1e-10, norms_female)
        self.db_embeddings_norm_female = db_embeddings_female / norms_female

        # Pre-build male catalog items
        male_items = []
        for idx, row in self.df_labels_male.iterrows():
            img_filename = str(row["image"]).strip()
            male_img_url = f"https://fitzy-coral.vercel.app/static/images/{img_filename}"
            cat_lower = str(row["category"]).lower()
            pid = str(row["product_id"])
            pid_hash = sum(ord(c) for c in pid)
            if any(b in cat_lower for b in ["pant", "trouser", "jean", "bottom", "short"]):
                item_sizes = ["28", "30", "32", "34", "36"]
                single_size = item_sizes[pid_hash % len(item_sizes)]
            elif any(b in cat_lower for b in ["shoe", "footwear", "sneaker"]):
                item_sizes = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"]
                single_size = item_sizes[pid_hash % len(item_sizes)]
            else:
                item_sizes = ["S", "M", "L", "XL", "XXL"]
                top_opts = ["S", "M", "L", "XL"]
                single_size = top_opts[pid_hash % len(top_opts)]

            male_items.append({
                "image": img_filename,
                "image_url": male_img_url,
                "product_id": pid,
                "title": row["title"],
                "color": row["color"],
                "fit": row["fit"],
                "pattern": row["pattern"],
                "material": row["material"],
                "price": float(row["price"]) if row["price"] != "" and pd.notna(row["price"]) else 999.0,
                "rating": float(row["rating"]) if row["rating"] != "" and pd.notna(row["rating"]) else 4.5,
                "category": row["category"],
                "size": single_size,
                "sizes": item_sizes,
                "wear_type": row.get("wear_type", ""),
                "product_url": row.get("product_url", "https://www.snitch.com/"),
                "store": "Snitch",
                "gender": "Men"
            })
        self.male_catalog = male_items

        # Pre-build female catalog items
        female_items = []
        for idx, row in self.df_labels_female.iterrows():
            cat_lower = str(row["category"]).lower()
            pid = str(row["product_id"])
            pid_hash = sum(ord(c) for c in pid)
            if any(b in cat_lower for b in ["pant", "trouser", "jean", "bottom", "short"]):
                item_sizes = ["26", "28", "30", "32", "34"]
                single_size = item_sizes[pid_hash % len(item_sizes)]
            elif any(b in cat_lower for b in ["shoe", "footwear", "sneaker"]):
                item_sizes = ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7"]
                single_size = item_sizes[pid_hash % len(item_sizes)]
            else:
                item_sizes = ["XS", "S", "M", "L", "XL"]
                top_opts = ["XS", "S", "M", "L"]
                single_size = top_opts[pid_hash % len(top_opts)]

            female_items.append({
                "image": row["image"],
                "image_url": row["image_url"] if str(row.get("image_url", "")).startswith("http") else f"/static/images/{row['image']}",
                "product_id": pid,
                "title": row["title"],
                "color": row["color"],
                "fit": row["fit"],
                "pattern": row["pattern"],
                "material": row["material"],
                "price": float(row["price"]) if row["price"] != "" and pd.notna(row["price"]) else 999.0,
                "rating": float(row["rating"]) if row["rating"] != "" and pd.notna(row["rating"]) else 4.5,
                "category": row["category"],
                "size": single_size,
                "sizes": item_sizes,
                "wear_type": row.get("wear_type", ""),
                "product_url": row.get("product_url", "https://newme.asia/"),
                "store": "Newme",
                "gender": "Women"
            })
        self.female_catalog = female_items
        self.all_catalog = self.male_catalog + self.female_catalog

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

    def extract_features(self, image_bytes: bytes) -> np.ndarray:
        self.initialize()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        input_data = self.preprocess_image(image)
        input_name = self.ort_session.get_inputs()[0].name
        output_name = self.ort_session.get_outputs()[0].name
        features = self.ort_session.run([output_name], {input_name: input_data})[0]
        return features.flatten()

    def find_similar(self, file_bytes: bytes, gender: str = None, top_k: int = 6):
        self.initialize()

        query_embedding = self.extract_features(file_bytes)

        query_norm = np.linalg.norm(query_embedding)
        if query_norm == 0:
            query_norm = 1e-10
        query_embedding_norm = query_embedding / query_norm

        # Select dataset based on gender
        is_female = gender and str(gender).lower() == "female"
        df_labels = self.df_labels_female if is_female else self.df_labels_male
        db_embeddings_norm = self.db_embeddings_norm_female if is_female else self.db_embeddings_norm_male
        default_url = "https://newme.asia/" if is_female else "https://www.snitch.com/"

        similarities = np.dot(db_embeddings_norm, query_embedding_norm)
        top_k_indices = np.argsort(similarities)[::-1][:top_k]

        results = []
        for idx in top_k_indices:
            row = df_labels.iloc[idx]
            similarity_score = float(similarities[idx])
            img_filename = str(row["image"]).strip()
            is_male_img = not is_female and img_filename and not img_filename.startswith("female")
            img_url = f"https://fitzy-coral.vercel.app/static/images/{img_filename}" if is_male_img else f"/static/images/{row['image']}"

            results.append({
                "rank": len(results) + 1,
                "image": row["image"],
                "image_url": img_url,
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
                "product_url": row.get("product_url", default_url),
                "similarity": similarity_score
            })
        return results

    def search_products(self, query: str, category: str = None, gender: str = None, limit: int = 5) -> list:
        self.initialize()
        
        is_female = gender and str(gender).lower() == "female"
        df_labels = self.df_labels_female if is_female else self.df_labels_male
        default_url = "https://newme.asia/" if is_female else "https://www.snitch.com/"
        
        df = df_labels.copy()
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
            row = df_labels.iloc[idx]
            img_filename = str(row["image"]).strip()
            is_male_img = not is_female and img_filename and not img_filename.startswith("female")
            img_url = f"https://fitzy-coral.vercel.app/static/images/{img_filename}" if is_male_img else f"/static/images/{row['image']}"
            results.append({
                "image": row["image"],
                "image_url": img_url,
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
                "product_url": row.get("product_url", default_url)
            })
        return results

    def get_catalog(self, gender: str = None, category: str = None, query: str = None, limit: int = 100, skip: int = 0) -> dict:
        self.initialize()
        
        g_norm = str(gender).strip().lower() if gender and str(gender).strip().lower() != "all" else ""
        
        if g_norm in ["male", "men", "snitch"]:
            items = self.male_catalog
        elif g_norm in ["female", "women", "newme"]:
            items = self.female_catalog
        else:
            items = self.all_catalog

        # Filter by category if specified
        if category and category.lower() != "all":
            cat_lower = category.lower()
            items = [
                it for it in items 
                if cat_lower in (it["category"] or "").lower() or cat_lower in (it["title"] or "").lower()
            ]

        # Filter by search query if specified
        if query and query.strip():
            q_terms = [t.lower() for t in query.strip().split() if len(t) > 1]
            def match_score(item):
                searchable = f"{item['title']} {item['color']} {item['category']} {item['fit']} {item['pattern']} {item['material']} {item['store']} {item['gender']}".lower()
                return sum(1 for t in q_terms if t in searchable)
            
            items = [it for it in items if match_score(it) > 0]
            items.sort(key=match_score, reverse=True)

        total = len(items)
        skip_val = max(0, int(skip))
        limit_val = max(1, int(limit)) if limit > 0 else 100
        paginated_items = items[skip_val : skip_val + limit_val]
        
        categories = list(set(it["category"] for it in items if it.get("category")))

        return {
            "success": True,
            "total": total,
            "categories": sorted(categories),
            "products": paginated_items
        }

recommendation_service = RecommendationService()

