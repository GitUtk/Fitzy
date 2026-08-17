# Fitzy — AI-Powered Virtual Try-On & Fashion Intelligence Platform

## Overview & Vision

**Fitzy** is an end-to-end AI fashion intelligence and virtual try-on application. It transforms how users shop for and styling clothes online by letting them see realistic try-ons of real commercial products on their own full-body photos, receive AI fashion critiques/roasts, extract structured clothing metadata into a digital wardrobe, and get hyper-relevant product recommendations.

The project connects a modern web user experience (**React + Vite + Tailwind CSS + Shadcn UI**) with a robust backend (**FastAPI + MongoDB + Cloudinary**) and high-performance machine learning inference engines (**ResNet-50**, **Gemini 2.5 Flash**, and **Fashn VTON**).

---

## Key Features & Functionalities

### 1. 👕 Virtual Try-On Engine (Fashn VTON)
- **Realistic Try-On Visualization**: Merges user photos with clothing products from online stores using diffusion models.
- **Colab GPU Acceleration**: Connects via a dynamic Gradio tunnel to a GPU backend (Google Colab with NVIDIA T4).
- **Inference Optimizations**: Accelerated pipeline utilizing FP16 mixed precision, `torch.compile` graph optimization, and reduced timesteps (20 steps) to achieve generation speeds under ~45-75 seconds.
- **Look History**: Automatically saves generated virtual try-on results ("My Looks") to the database for future reference.

### 2. 🔍 Visual Similarity & Product Discovery Engine
- **Image-Based Search**: Users upload an image of a garment or outfit to find visually similar commercial items.
- **Deep Feature Embeddings**: Uses a pre-trained **ResNet-50** deep neural network (exported to ONNX format) to convert clothing images into **2048-dimensional feature vectors**.
- **Cosine Similarity Matching**: Evaluates vector similarity in real time against catalog embeddings to retrieve top-matching catalog items with direct checkout/buy links.

### 3. 🤖 AI Fashion Stylist & Style Studio
- **AI Fashion Analysis & Roast**: Powered by **Gemini 2.5 Flash**, providing honest feedback on outfit fit, color coordination, overall aesthetics, and style prescriptions.
- **Prompt-Based Virtual Stylist**: Accepts user photos alongside text style prompts (e.g., "Korean Streetwear", "CEO Casual") to return customized critique, style advice, and catalog product matches.
- **Interactive Typing Effect**: Renders AI feedback seamlessly with a smooth typewriter animation in the frontend UI.

### 4. 🗄️ Smart Wardrobe & Metadata Extraction
- **Automatic Metadata Extraction**: Uses Gemini multi-modal inference to automatically parse uploaded apparel images into structured metadata (category, subcategory, primary/secondary colors, pattern, material, fit, style tags, seasonal suitability, and occasion).
- **Personal Wardrobe Management**: Enables users to add, categorize, edit, and manage items in their digital closet ("My Wardrobe").

### 5. 👤 Authentication & Profile Management
- **User Account Lifecycle**: Standard registration, OAuth2 form-based login, and JWT Bearer token authentication flow.
- **Onboarding & Gender Personalization**: Profile setup modal enforcing gender context for tailor-fit recommendation results.

---

## Technical Stack & Architecture

| Layer | Technologies / Frameworks |
|---|---|
| **Frontend UI** | React 18, Vite, Tailwind CSS, Lucide Icons, Shadcn UI / Radix UI |
| **Backend API** | Python, FastAPI, Motor (Async MongoDB Driver), PyJWT, Pydantic |
| **Databases & Storage** | MongoDB (User data, Wardrobe, Looks, Metadata), Cloudinary (Image Hosting) |
| **AI / Machine Learning** | Google Gemini 2.5 Flash (Style Analysis & Metadata), ResNet-50 & ONNX Runtime (Similarity Vector Search), Fashn VTON & PyTorch (Virtual Try-On) |
| **Hosting & Infrastructure** | Backend: Render (`fitzy-f7uv.onrender.com`), VTON Backend: Google Colab (NVIDIA T4 + Gradio Tunnel) |

---

## Repository Structure

```
Fitzy/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/v1/routes/   # Route handlers (auth, recommendations, upload, users)
│   │   ├── crud/            # Database queries & logic
│   │   ├── schemas/         # Pydantic data schemas
│   │   └── services/        # ResNet-50 embeddings, Cloudinary & Try-On services
│   ├── main.py              # Application entry point & CORS configuration
│   └── API_DOCS.md          # Complete REST API documentation
├── frontend/                 # React SPA (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI & modal components
│   │   ├── pages/           # LandingPage, Auth, Dashboard, StyleStudio, Wardrobe
│   │   └── lib/             # Utility functions
├── ml/                       # Machine Learning Scripts & Documentation
│   ├── app.py               # Independent similarity search web service
│   ├── embed.py             # ResNet-50 feature vector generator script
│   ├── scrape.py            # Product scraper & catalog dataset compiler
│   ├── SIMILARITY_SEARCH.md # Deep dive into visual search architecture
│   └── OPTIMIZATION_REPORT.md# Performance optimization report for Fashn VTON
└── README.md                 # Project Overview & Quickstart Guide
```

---

## Project Documentation & Deep Dives

- 📄 **Backend API Documentation**: [`backend/API_DOCS.md`](file:///Users/yashikakataria/Fitzy/backend/API_DOCS.md)
- 📄 **Fashion Similarity Engine Technical Guide**: [`ml/SIMILARITY_SEARCH.md`](file:///Users/yashikakataria/Fitzy/ml/SIMILARITY_SEARCH.md)
- 📄 **Virtual Try-On Optimization Report**: [`ml/OPTIMIZATION_REPORT.md`](file:///Users/yashikakataria/Fitzy/ml/OPTIMIZATION_REPORT.md)
