import os
import numpy as np
import pandas as pd
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

def main():
    csv_path = "dataset/labels.csv"
    images_dir = "dataset/images"
    embeddings_out = "dataset/embeddings.npy"

    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found. Please run scrape.py first.")
        return

    df = pd.read_csv(csv_path)
    total_imgs = len(df)
    print(f"Loaded metadata for {total_imgs} products.")

    device = torch.device("cpu")
    print(f"Using device: {device}")

    print("Loading pre-trained ResNet50 model...")
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
        for idx, row in df.iterrows():
            image_name = row["image"]
            image_path = os.path.join(images_dir, image_name)
            
            if (idx + 1) % 90 == 0 or idx == 0 or idx == total_imgs - 1:
                print(f"Processing image {idx + 1}/{total_imgs} ({(idx + 1)/total_imgs*100:.1f}%)")

            if not os.path.exists(image_path):
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
    np.save(embeddings_out, embeddings_arr)
    print(f"\nFeature extraction complete. Embeddings saved to {embeddings_out}")
    print(f"Saved array shape: {embeddings_arr.shape}")

if __name__ == "__main__":
    main()
