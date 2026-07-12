import urllib.request

url = "https://www.infinitimall.com/wp-content/uploads/2024/09/snitch-logo.jpeg"
output_path = "/home/utkarsh/Documents/Fitzy-1/frontend/public/snitch-logo.jpeg"

try:
    print(f"Downloading from {url}...")
    urllib.request.urlretrieve(url, output_path)
    print(f"Downloaded successfully to {output_path}")
except Exception as e:
    print(f"Error downloading: {e}")
