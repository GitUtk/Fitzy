const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

const getToken = () => localStorage.getItem("token");

const getHeaders = (isFormData = false) => {
  const headers = {};

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// ============================
// Upload Image
// POST /upload/image
// ============================

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/upload/image`,
    {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Image upload failed.");
  }

  return data;
};

// ============================
// AI Style Analysis
// POST /recommendations/analyze
// ============================

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/recommendations/analyze`,
    {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Analysis failed.");
  }

  return data;
};

// ============================
// Similar Products
// POST /recommendations/similar
// ============================

export const getSimilarProducts = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/recommendations/similar`,
    {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch similar products.");
  }

  return data;
};

// ============================
// Save Look URL
// POST /upload/url
// ============================

export const saveLook = async (imageUrl) => {
  const response = await fetch(
    `${API_BASE_URL}/upload/url`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        url: imageUrl,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to save look.");
  }

  return data;
};

// ============================
// Fetch User Looks
// GET /upload/looks
// ============================

export const getUserLooks = async () => {
  const response = await fetch(
    `${API_BASE_URL}/upload/looks`,
    {
      headers: getHeaders(true),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load looks.");
  }

  return data;
};