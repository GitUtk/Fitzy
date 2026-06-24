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

for kw in ["trouser", "tshirt", "shirt"]:
    r = requests.get(
        API_URL,
        headers=HEADERS,
        params={
            "page": 1,
            "limit": 3,
            "keyword": kw,
            "entry_point": "search_bar",
        },
        timeout=10,
    )
    print(f"Keyword: {kw}, Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        prods = data.get("data", {}).get("products", [])
        print(f"Found {len(prods)} products")
        if prods:
            print("First product sample:")
            p = prods[0]
            print(f"  Title: {p.get('title')}")
            print(f"  Image URL: {p.get('cdn_preview_image') or p.get('preview_image')}")
            print(f"  Shopify Product ID: {p.get('shopify_product_id')}")
            print(f"  Color: {p.get('color')}, Fit: {p.get('fit')}, Pattern: {p.get('pattern')}")
