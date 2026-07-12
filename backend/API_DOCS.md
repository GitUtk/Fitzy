# Fitzy Backend API Docs
## Base URL

```
https://fitzy-f7uv.onrender.com/api/v1/
```

## Authentication

All protected routes require a Bearer token in the request header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained via the `/login` endpoint and expire after 3600 minutes by default.

---

## Endpoints

### Health Check

#### `GET /health`

Checks API and database connectivity. No auth required.

**Response — 200 OK**
```json
{
  "status": "ok",
  "database": "up"
}
```

| Field | Possible Values |
|---|---|
| `status` | `ok` |
| `database` | `up`, `down` |

---

### Register User

#### `POST /register`

Creates a new user account.

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response — 200 OK**
```json
{
  "id": "64f1c9c2a1b2c3d4e5f6g7h8",
  "email": "user@example.com"
}
```

**Errors**

| Status | Meaning |
|---|---|
| 400 | User already exists |

---

### Login

#### `POST /login`

Authenticates a user and returns a JWT access token. Uses OAuth2 password flow (`form-data`, not JSON).

**Request — form-data**
```
username: user@example.com
password: yourpassword
```

**Response — 200 OK**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors**

| Status | Meaning |
|---|---|
| 400 | Invalid credentials |

---

### Get Current User

#### `GET /me`

Returns the authenticated user's profile.

**Headers**
```
Authorization: Bearer <access_token>
```

**Response — 200 OK**
```json
{
  "id": "64f1c9c2a1b2c3d4e5f6g7h8",
  "email": "user@example.com"
}
```

**Errors**

| Status | Meaning |
|---|---|
| 401 | Invalid or missing token |
| 404 | User not found |


---

### Process Image (In-Memory Base64)

#### `POST /upload/image`

Processes an uploaded image file and returns its local Base64 Data URI (does not upload to Cloudinary). Requires token authentication.

**Headers**
```
Authorization: Bearer <access_token>
```

**Request — multipart/form-data**
```
file: <binary image data>
```

**Response — 200 OK**
```json
{
  "secure_url": "data:image/png;base64,iVBOR...",
  "public_id": "local_data_uri",
  "is_mock": true
}
```

**Errors**

| Status | Meaning |
|---|---|
| 401 | Invalid or missing token |
| 500 | Failed to upload image to Cloudinary |

---

### Save Image URL to Database

#### `POST /upload/url`

Saves an uploaded image URL to the database linked to the authenticated user.

**Headers**
```
Authorization: Bearer <access_token>
```

**Request Body**
```json
{
  "url": "https://res.cloudinary.com/your_cloud_name/image/upload/..."
}
```

**Response — 200 OK**
```json
{
  "status": "success",
  "look": {
    "id": "64f1c9c2a1b2c3d4e5f6g7h9",
    "user_id": "64f1c9c2a1b2c3d4e5f6g7h8",
    "image_url": "https://res.cloudinary.com/your_cloud_name/image/upload/...",
    "created_at": "2026-06-22T16:45:00.123456"
  }
}
```

**Errors**

| Status | Meaning |
|---|---|
| 400 | URL is required |
| 401 | Invalid or missing token |

---

### Get User Looks

#### `GET /upload/looks`

Retrieves a list of virtual try-on generated looks for the authenticated user, ordered from newest to oldest.

**Headers**
```
Authorization: Bearer <access_token>
```

**Response — 200 OK**
```json
[
  {
    "id": "64f1c9c2a1b2c3d4e5f6g7h9",
    "user_id": "64f1c9c2a1b2c3d4e5f6g7h8",
    "image_url": "https://res.cloudinary.com/your_cloud_name/image/upload/...",
    "created_at": "2026-06-22T16:45:00.123456"
  }
]
```

**Errors**

| Status | Meaning |
|---|---|
---

### Outfit Similarity Search

#### `POST /recommendations/similar`

Processes an uploaded image with a CPU-optimized ResNet-50 neural network to generate a 2048-dimensional feature embedding, then evaluates Cosine Similarity against the precomputed catalog embeddings index to return the top 6 closest matching product outfits. Requires token authentication.

**Headers**
```
Authorization: Bearer <access_token>
```

**Request — multipart/form-data**
```
file: <binary image data>
```

**Response — 200 OK**
```json
{
  "success": true,
  "results": [
    {
      "rank": 1,
      "image": "00320.webp",
      "image_url": "https://d2wbq7o4qxi60y.cloudfront.net/8944667525282/1-800.webp",
      "product_id": "8944667525282",
      "title": "Cream Baggy Stretch Chinos",
      "color": "['Cream']",
      "fit": "Baggy Fit",
      "pattern": "Plain",
      "material": "Cotton Blend",
      "price": 1799.0,
      "rating": 4.6,
      "category": "Trousers",
      "product_url": "https://www.snitch.com/men-trousers/baggy-textured-stretch-chinos-4ch005-01/8944667525282/buy",
      "similarity": 0.9416
    }
  ]
}
```

**Errors**

| Status | Meaning |
|---|---|
| 400 | Uploaded file must be an image |
| 401 | Invalid or missing token |
| 500 | Internal Server Error / embedding processing failure |

---

### AI Style Analysis & Roast

#### `POST /recommendations/analyze`

Processes an uploaded fashion/styling image and forwards it to the Gemini 2.5 Flash API to get honest, unfiltered feedback on styling, fit, colors, and a prescriptive set of improvements. Requires token authentication.

**Headers**
```
Authorization: Bearer <access_token>
```

**Request — multipart/form-data**
```
file: <binary image data>
```

**Response — 200 OK**
```json
{
  "success": true,
  "analysis": "### 1. The Brutal First Impression\n...\n### 2. What's Decent (If Anything)\n...\n### 3. The Fashion Disasters\n...\n### 4. Style Prescription\n..."
}
```

**Errors**

| Status | Meaning |
|---|---|
| 400 | Uploaded file must be an image |
| 401 | Invalid or missing token |
| 500 | Gemini API Key not configured or internal processing error |
| 502 | Failed to parse analysis results from Gemini response |

---

### Clothing Metadata Extraction

#### `POST /recommendations/extract-metadata`

Processes an uploaded image of a clothing item or user wearing clothing, and uses the Gemini 2.5 Flash model to extract detailed structured metadata about the clothing. Requires token authentication.

**Headers**
```
Authorization: Bearer <access_token>
```

**Request — multipart/form-data**
```
file: <binary image data>
```

**Response — 200 OK**
```json
{
  "success": true,
  "metadata": {
    "category": "Shirts",
    "subcategory": "Casual Shirts",
    "primaryColor": "White",
    "secondaryColor": null,
    "pattern": "Plain",
    "material": "Linen",
    "fit": "Regular",
    "style": ["Casual", "Summer"],
    "season": ["Summer", "Spring"],
    "occasion": ["Beach", "Casual Outing"],
    "confidence": 0.95
  }
}
```

**Errors**

| Status | Meaning |
|---|---|
| 400 | Uploaded file must be an image |
| 401 | Invalid or missing token |
| 500 | Gemini API Key not configured or internal processing error |
| 520 | Failed to parse metadata from Gemini response |

---

### Virtual Stylist

#### `POST /recommendations/stylist`

Analyzes user photo and style prompt using Gemini to provide a critique, advice, and matches items from the product catalog. Requires token authentication.

**Headers**
```
Authorization: Bearer <access_token>
```

**Request — multipart/form-data**
```
file: <binary image data>
prompt: "Korean streetwear"
```

**Response — 200 OK**
```json
{
  "success": true,
  "user_image_url": "data:image/png;base64,... (local Base64 Data URI)",
  "critique": "Analysis of the current outfit...",
  "advice": "General style recommendation...",
  "recommendations": [
    {
      "category": "Shirts",
      "search_query": "White Linen Shirt",
      "reason": "Matches the aesthetic...",
      "products": [
        {
          "image": "00014.webp",
          "image_url": "https://...",
          "product_id": "9224474132642",
          "title": "Cotton Linen White Mandarin Shirt",
          "color": "['White']",
          "fit": "Regular Fit",
          "pattern": "Plain",
          "material": "Linen Blend",
          "price": 1499.0,
          "rating": 4.4,
          "category": "Shirts",
          "product_url": "https://..."
        }
      ]
    }
  ]
}
```

**Errors**

| Status | Meaning |
|---|---|
| 400 | Uploaded file must be an image |
| 401 | Invalid or missing token |
| 500 | Internal Server Error |

---

### Virtual Try-On

#### `POST /recommendations/fetchGradio`

Registers or updates the newest Gradio live URL from Google Colab in the MongoDB database (replacing any previous link). This allows the try-on engine to use the active Colab workspace. No authentication required.

**Request — application/json**
```json
{
  "gradio_url": "https://28fdcf3457b7a58f34.gradio.live"
}
```

**Response — 200 OK**
```json
{
  "status": "success",
  "gradio_url": "https://28fdcf3457b7a58f34.gradio.live"
}
```

---

#### `POST /recommendations/tryon`

Generates virtual try-on visualization of a catalog product on the user's photo using the Google Colab Gradio backend (using the currently registered in-memory Gradio live link). Saves the resulting generated image url to the user's `looks` database history. Requires token authentication.

**Headers**
```
Authorization: Bearer <access_token>
```

**Request — multipart/form-data**
```
garment_url: "https://..."
category: "tops"
file: <optional binary image data>
person_url: <optional URL to user photo>
```

**Response — 200 OK**
```json
{
  "success": true,
  "tryon_image_url": "https://res.cloudinary.com/..."
}
```

**Errors**

| Status | Meaning |
|---|---|
| 400 | Invalid file upload or missing inputs |
| 401 | Invalid or missing token |
| 500 | Try-on generation failure |

---

## Authentication Flow

```
1. POST /register        → create account
2. POST /login            → exchange credentials for JWT
3. POST /upload/image     → convert uploaded image to local base64 Data URI
4. POST /upload/url       → link image url to user profile
5. POST /recommendations/similar → extract image embedding and search similar outfits
6. POST /recommendations/analyze → get raw, honest fashion and style feedback from Gemini
7. POST /recommendations/extract-metadata → extract detailed structured clothing metadata using Gemini
8. POST /recommendations/stylist → get stylist recommendations based on style prompt
9. POST /recommendations/fetchGradio → register/update the newest Colab Gradio share URL in MongoDB
10. POST /recommendations/tryon   → generate try-on visualization for recommended garment
11. GET  /upload/looks     → retrieve history of user looks
12. GET  /me  (Bearer)     → access profile details
```

## Token Details

| Property | Value |
|---|---|
| Type | JWT |
| Algorithm | HS256 |
| Expiry | 3600 minutes (default) |

## Database Schema

**Database:** MongoDB
**Driver:** Motor (async)

**Collection:** `users`

```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "hashed string",
  "uploaded_images": ["string"]
}
```

**Collection:** `looks`

```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "image_url": "string",
  "created_at": "ISODate"
}
```

## Error Format

All errors follow a consistent shape:

```json
{
  "detail": "Error message here"
}
```

---

### Notes for Integrators

- `/login` expects `application/x-www-form-urlencoded` (standard OAuth2 form), not JSON — most HTTP clients need an explicit content-type override for this endpoint.
- Store the `access_token` securely (e.g. httpOnly cookie or secure storage) and attach it as a Bearer token on all subsequent requests to protected routes.
- Tokens are not refreshed automatically; re-authenticate via `/login` once expired.
