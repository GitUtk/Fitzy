import time
import os
import threading
import numpy as np
import pandas as pd
import requests
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

# Paths
ML_DIR = Path(__file__).parent.resolve()
DATASET_DIR = ML_DIR.parent / "frontend" / "public" / "static"
IMAGES_DIR = DATASET_DIR / "images"

csv_out_path = DATASET_DIR / "lfemalesabels.csv"
embeddings_out_path = DATASET_DIR / "feamalesembedding.npy"

# Create directories if they do not exist
DATASET_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

API_URL = "https://prodapi.newme.asia/web/products"
HEADERS = {
    "content-type": "application/json",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Categories and target counts
categories_config = {
    "dresses": 170,
    "tops": 165,
    "bottoms": 165
}

session = requests.Session()

all_products = []
seen_ids = set()

print("Starting to fetch products from newme.asia...")

for category_name, target_count in categories_config.items():
    print(f"\nFetching {target_count} products for category: {category_name}")
    category_products = []
    page = 1
    
    while len(category_products) < target_count:
        payload = {
            "sort_by": "menu_order",
            "subcategory": [],
            "category": [category_name],
            "page": page,
            "tag": [],
            "search_term": ""
        }
        
        try:
            r = session.post(API_URL, json=payload, headers=HEADERS, timeout=30)
            r.raise_for_status()
            data = r.json()
            batch = data.get("data", {}).get("products", [])
            
            if not batch:
                print(f"No more products found on page {page} for category {category_name}.")
                break
                
            new_added = 0
            for p in batch:
                prod_id = p.get("product_id")
                if prod_id and prod_id not in seen_ids:
                    seen_ids.add(prod_id)
                    p["scraped_category"] = category_name.capitalize()
                    category_products.append(p)
                    new_added += 1
                    
            print(f"Page {page} fetched: {len(batch)} products. Added {new_added} unique products. Total in {category_name}: {len(category_products)}")
            
            if new_added == 0:
                print(f"No new unique products on page {page} for category {category_name}. Stopping pagination.")
                break
                
            page += 1
            time.sleep(0.2)
            
        except Exception as e:
            print(f"Error fetching page {page} for category {category_name}: {e}")
            break
            
    # Crop to target count
    category_products = category_products[:target_count]
    print(f"Collected {len(category_products)} products for {category_name}")
    all_products.extend(category_products)

# We want exactly 500 or whatever we managed to fetch, let's keep all up to 500.
all_products = all_products[:500]
total_products = len(all_products)
print(f"\nTotal unique female outfits collected: {total_products}")

# Heuristics for fit, pattern, material
def extract_heuristics(title):
    title_lower = str(title).lower()
    
    # Fit
    fit = ""
    for f in ["bodycon", "loose", "relaxed", "oversized", "slim", "skinny", "wide leg", "straight", "regular", "cargo", "flare"]:
        if f in title_lower:
            fit = f.title()
            break
            
    # Pattern
    pattern = ""
    for p in ["ruched", "crochet", "solid", "printed", "striped", "check", "floral", "ribbed", "denim", "knitted", "mesh"]:
        if p in title_lower:
            pattern = p.title()
            break
            
    # Material
    material = ""
    for m in ["cotton", "linen", "satin", "polyester", "denim", "suede", "viscose", "knit", "rib", "rayon"]:
        if m in title_lower:
            material = m.title()
            break
            
    return fit, pattern, material

# Process products into rows
rows = []
for idx, product in enumerate(all_products):
    image_name = f"female_{idx:05d}.webp"
    image_url = product.get("image_url")
    
    product_id = product.get("product_id")
    title = product.get("name")
    
    # Extract colors
    color_variants = product.get("color_variants", [])
    colors = [c.get("color") for c in color_variants if c.get("color")]
    color_str = ", ".join(colors) if colors else ""
    
    # Extract price
    price = ""
    variations = product.get("variations", [])
    if variations:
        v = variations[0]
        price = v.get("sale_price") or v.get("regular_price") or ""
    if not price:
        track_data = product.get("track_event_data", {})
        if track_data:
            price = track_data.get("best_price") or ""
            
    rating = product.get("rating") or "4.5"
    category = product.get("scraped_category")
    
    # Wear type mapping
    if category.lower() == "bottoms":
        wear_type = "bottom wear"
    else:
        wear_type = "upper wear" # dresses and tops are upper wear / tops
        
    slug = product.get("slug")
    product_url = f"https://newme.asia/product/{slug}" if slug else "https://newme.asia/"
    
    fit, pattern, material = extract_heuristics(title)
    
    rows.append({
        "image": image_name,
        "image_url": image_url,
        "product_id": product_id,
        "title": title,
        "color": color_str,
        "fit": fit,
        "pattern": pattern,
        "material": material,
        "price": price,
        "rating": rating,
        "category": category,
        "product_url": product_url,
        "wear_type": wear_type
    })

labels_df = pd.DataFrame(rows)
labels_df.to_csv(csv_out_path, index=False)
print(f"\nMetadata written to {csv_out_path} ({len(labels_df)} entries)")

# Rate limiter for image downloading
class RateLimiter:
    def __init__(self, rate):
        self.interval = 1.0 / rate
        self.lock = threading.Lock()
        self.next_time = time.time()

    def wait(self):
        with self.lock:
            now = time.time()
            if now < self.next_time:
                time.sleep(self.next_time - now)
            self.next_time = max(now, self.next_time) + self.interval

rate_limiter = RateLimiter(10) # 10 downloads per second max

def download_image(row):
    image_url = row["image_url"]
    if not image_url:
        return False

    rate_limiter.wait()
    try:
        r = session.get(image_url, timeout=30)
        if r.status_code != 200:
            return False

        image_path = IMAGES_DIR / row["image"]
        with open(image_path, "wb") as f:
            f.write(r.content)
        return True
    except Exception:
        return False

print("\nDownloading product images...")
success = 0
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [
        executor.submit(download_image, row)
        for _, row in labels_df.iterrows()
    ]
    total = len(futures)
    for i, future in enumerate(as_completed(futures), start=1):
        if future.result():
            success += 1
        print(f"\rDownloaded {success}/{total} images", end="", flush=True)

print(f"\nFinished: {success} images saved out of {total}")

# Extract features using PyTorch ResNet50
print("\nLoading pre-trained ResNet50 model for feature extraction...")
device = torch.device("cpu")
resnet = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
feature_extractor = torch.nn.Sequential(*(list(resnet.children())[:-1]))
feature_extractor.to(device)
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

embeddings = []
print("Extracting features for all products...")

with torch.no_grad():
    for idx, row in labels_df.iterrows():
        image_name = row["image"]
        image_path = IMAGES_DIR / image_name
        
        if (idx + 1) % 50 == 0 or idx == 0 or idx == total_products - 1:
            print(f"Processing image {idx + 1}/{total_products} ({(idx + 1)/total_products*100:.1f}%)")

        if not image_path.exists():
            print(f"Warning: Image {image_path} not found. Skipping.")
            embeddings.append(np.zeros(2048, dtype=np.float32))
            continue

        try:
            img = Image.open(image_path).convert("RGB")
            tensor = preprocess(img).unsqueeze(0).to(device)
            feat = feature_extractor(tensor)
            feat_np = feat.squeeze().numpy()
            embeddings.append(feat_np)
        except Exception as e:
            print(f"Error processing image {image_name}: {e}")
            embeddings.append(np.zeros(2048, dtype=np.float32))

embeddings_arr = np.vstack(embeddings)
np.save(embeddings_out_path, embeddings_arr)
print(f"\nFeature extraction complete. Embeddings saved to {embeddings_out_path}")
print(f"Saved array shape: {embeddings_arr.shape}")
