import time
import threading
import shutil
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import pandas as pd
import requests

API_URL = "https://6n9utmwgyj.ap-south-1.awsapprunner.com/products/search"

HEADERS = {
    "client-id": "snitch_secret",
    "accept": "application/json",
    "origin": "https://www.snitch.com",
    "referer": "https://www.snitch.com/",
    "user-agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/137.0.0.0 Safari/537.36"
    ),
}

TARGET_PER_CATEGORY = 100
MAX_WORKERS = 15
DOWNLOAD_RATE = 10 

DATASET_DIR = Path("dataset")
IMAGES_DIR = DATASET_DIR / "images"

if DATASET_DIR.exists():
    shutil.rmtree(DATASET_DIR)
DATASET_DIR.mkdir(exist_ok=True)
IMAGES_DIR.mkdir(exist_ok=True)

session = requests.Session()

categories_config = {
    "Shirts": ["shirt"],
    "T-Shirts | POLO": ["t-shirt", "polo"],
    "Jeans": ["jeans"],
    "Trousers": ["trouser"],
    "Footwear": ["shoes"],
    "Cargo pants": ["cargo"],
    "Joggers": ["joggers"],
    "SHORTS": ["shorts"],
    "Overshirts": ["overshirt"]
}

all_products = []

for category_name, keywords in categories_config.items():
    print(f"\nFetching products for category: {category_name}")
    category_products = []
    target_per_keyword = TARGET_PER_CATEGORY // len(keywords)
    
    for kw in keywords:
        kw_products = []
        page = 1
        while len(kw_products) < target_per_keyword:
            try:
                r = session.get(
                    API_URL,
                    headers=HEADERS,
                    params={
                        "page": page,
                        "limit": 100,
                        "keyword": kw,
                        "entry_point": "search_bar",
                    },
                    timeout=30,
                )
                r.raise_for_status()
                data = r.json()
                batch = data.get("data", {}).get("products", [])
                
                if not batch:
                    break
                    
                kw_products.extend(batch)
                page += 1
                time.sleep(0.2)
            except Exception as e:
                print(f"Error fetching page {page} for keyword {kw}: {e}")
                break
                
        category_products.extend(kw_products[:target_per_keyword])
        
    category_products = category_products[:TARGET_PER_CATEGORY]
    print(f"Collected {len(category_products)} products for {category_name}")
    
    for p in category_products:
        p["search_category"] = category_name
        
    all_products.extend(category_products)

print(f"\nTotal products collected: {len(all_products)}")

def get_category_slug(category):
    cat = str(category).lower()
    if "shirts" == cat or ("shirt" in cat and "t-shirt" not in cat and "overshirt" not in cat):
        return "men-shirts"
    elif "t-shirts" in cat or "tshirt" in cat or "t-shirt" in cat or "polo" in cat:
        return "men-t-shirts"
    elif "jeans" in cat:
        return "men-jeans"
    elif "trousers" in cat or "trouser" in cat:
        return "men-trousers"
    elif "footwear" in cat or "shoes" in cat:
        return "men-shoes"
    elif "cargo" in cat:
        return "men-cargos"
    elif "joggers" in cat:
        return "men-joggers"
    elif "shorts" in cat:
        return "men-shorts"
    elif "overshirts" in cat or "overshirt" in cat:
        return "men-overshirts"
    return "men-shirts"

rows = []
for idx, product in enumerate(all_products):
    image_name = f"{idx:05d}.webp"
    image_url = product.get("cdn_preview_image") or product.get("preview_image")
    
    color = product.get("color")
    if isinstance(color, list):
        color = ", ".join(color)
        
    handle = product.get("handle")
    product_id = product.get("shopify_product_id")
    category = product.get("search_category")
    
    if handle and product_id:
        category_slug = get_category_slug(category)
        product_url = f"https://www.snitch.com/{category_slug}/{handle}/{product_id}/buy"
    else:
        product_url = "https://www.snitch.com/"
        
    rows.append({
        "image": image_name,
        "image_url": image_url,
        "product_id": product_id,
        "title": product.get("title"),
        "color": color,
        "fit": product.get("fit"),
        "pattern": product.get("pattern"),
        "material": product.get("material"),
        "price": product.get("selling_price"),
        "rating": product.get("average_rating"),
        "category": category,
        "product_url": product_url
    })

labels_df = pd.DataFrame(rows)
csv_path = DATASET_DIR / "labels.csv"
labels_df.to_csv(csv_path, index=False)
print(f"Labels written -> {csv_path}")

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

rate_limiter = RateLimiter(DOWNLOAD_RATE)

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

success = 0
with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = [
        executor.submit(download_image, row)
        for _, row in labels_df.iterrows()
    ]
    total = len(futures)
    for i, future in enumerate(as_completed(futures), start=1):
        if future.result():
            success += 1
        print(f"\rDownloaded {success}/{total} images", end="", flush=True)

print(f"\n\nFinished: {success} images saved out of {total}")
