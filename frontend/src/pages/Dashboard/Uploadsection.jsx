import React, { useState, useRef } from "react";
import {
  FaCloudUploadAlt,
  FaSpinner,
  FaCheckCircle,
  FaImage,
  FaExclamationCircle,
} from "react-icons/fa";

const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

const UploadSection = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [styleLoading, setStyleLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showTryOn, setShowTryOn] = useState(false);
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const [tryOnImageUrl, setTryOnImageUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const fileInputRef = useRef(null);

  const inferCategory = (category) => {
    const normalized = (category || "").toLowerCase();
    if (normalized.includes("shirt") || normalized.includes("top") || normalized.includes("tee") || normalized.includes("blouse")) return "tops";
    if (normalized.includes("pant") || normalized.includes("jean") || normalized.includes("trouser") || normalized.includes("short")) return "bottoms";
    if (normalized.includes("shoe") || normalized.includes("sneaker") || normalized.includes("boot")) return "shoes";
    if (normalized.includes("dress") || normalized.includes("gown")) return "dresses";
    if (normalized.includes("coat") || normalized.includes("jacket") || normalized.includes("blazer")) return "outerwear";
    return "tops";
  };

  const saveTriedOnLook = (product, generatedImageUrl = "") => {
    if (!product) return;

    const savedLooks = JSON.parse(localStorage.getItem("savedLooks") || "[]");
    const newEntry = {
      id: `${product.product_id || product.title || Date.now()}-${Date.now()}`,
      image_url: generatedImageUrl || product.image_url || product.image || product.product_url,
      created_at: new Date().toISOString(),
      title: product.title || "Tried-on outfit",
      category: product.category || "Fashion pick",
    };

    const exists = savedLooks.some((look) => {
      const existingImage = look?.image_url || look?.image || look?.product_url || look?.url || "";
      const incomingImage = newEntry.image_url || "";
      return look?.id === newEntry.id || (existingImage && existingImage === incomingImage);
    });

    if (!exists) {
      const updatedLooks = [newEntry, ...savedLooks];
      localStorage.setItem("savedLooks", JSON.stringify(updatedLooks));
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    }
  };

  const handleTryOnPreview = async () => {
    if (!selectedProduct) return;

    setTryOnLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to use virtual try-on.");
      }

      const photoFile = fileInputRef.current?.files?.[0];
      const formData = new FormData();
      formData.append("garment_url", selectedProduct.image_url || selectedProduct.image || selectedProduct.product_url || "");
      formData.append("category", inferCategory(selectedProduct.category));
      if (photoFile) {
        formData.append("file", photoFile);
      }

      const response = await fetch(`${API_BASE_URL}/recommendations/tryon`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || "Try-on generation failed.");
      }

      const generatedImage = data.tryon_image_url || data.image_url || data.url || "";
      if (!generatedImage) {
        throw new Error("No try-on image was returned.");
      }

      setTryOnImageUrl(generatedImage);
      setShowTryOn(true);
      saveTriedOnLook(selectedProduct, generatedImage);
    } catch (err) {
      console.error(err);
      setError(err.message || "The try-on preview could not be generated right now.");
    } finally {
      setTryOnLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadFile = async (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, JPEG, WEBP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setIsMock(false);
    setRecommendations([]);
    setSelectedProduct(null);
    setAnalysis("");

    const objectUrl = URL.createObjectURL(file);
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(objectUrl);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to upload files.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(`${API_BASE_URL}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.detail || "Upload to Cloudinary failed");
      }

      const uploadData = await uploadResponse.json();
      const secureUrl = uploadData.secure_url;
      setIsMock(uploadData.is_mock || false);

      if (uploadData.is_mock) {
        setPreview(secureUrl);
      }

      const saveResponse = await fetch(`${API_BASE_URL}/upload/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: secureUrl }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.detail || "Saving image to database failed");
      }

      setSuccess(true);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const handleGenerateStyle = async () => {
    if (!preview) {
      setError("Upload a photo first so we can tailor the suggestions.");
      return;
    }

    if (!prompt.trim()) {
      setError("Tell us the kind of outfit you want to see.");
      return;
    }

    setStyleLoading(true);
    setError(null);
    setAnalysis("");
    setSelectedProduct(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to use styling suggestions.");
      }

      const formData = new FormData();
      formData.append("prompt", prompt.trim());
      const photoFile = fileInputRef.current?.files?.[0];
      if (photoFile) {
        formData.append("file", photoFile);
      }

      let response = await fetch(`${API_BASE_URL}/recommendations/stylist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data = null;
      if (response.ok) {
        data = await response.json();
      } else if (response.status === 404 || response.status === 405) {
        const similarResponse = await fetch(`${API_BASE_URL}/recommendations/similar`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!similarResponse.ok) {
          throw new Error("We could not fetch styling suggestions right now.");
        }

        data = await similarResponse.json();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "We could not fetch styling suggestions right now.");
      }

      const results = Array.isArray(data?.recommendations)
        ? data.recommendations.flatMap((group) => group.products || [])
        : Array.isArray(data?.results)
          ? data.results
          : [];

      setRecommendations(results);
      setAnalysis(data?.critique || data?.analysis || "Style suggestions are ready for you to preview.");
      setSelectedProduct(results[0] || null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while generating outfit ideas.");
    } finally {
      setStyleLoading(false);
    }
  };

  const chooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-[#F7F7FB] text-black border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_black]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-5xl font-black tracking-tight text-[#6D28D9]">
            Virtual Try-On
          </h2>
          <p className="text-gray-600 mt-3 text-lg">
            Upload your photo, describe the outfit you want, and preview clothing options instantly.
          </p>
        </div>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={chooseFile}
        className={`rounded-[28px] border-2 border-dashed transition-all cursor-pointer overflow-hidden bg-white border-gray-300 ${
          dragActive ? "border-[#8B5CF6] bg-[#F3EEFF]" : ""
        }`}
      >
        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={handleChange}
        />

        {preview ? (
          <div className="relative rounded-[24px] overflow-hidden border border-black">
            <img src={preview} alt="preview" className="w-full h-[420px] object-cover" />
            {loading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                <FaSpinner className="animate-spin text-5xl text-[#8B5CF6]" />
                <p className="text-black mt-5 font-bold">Uploading your look...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center px-8">
            <div className="w-24 h-24 rounded-full border-2 border-black bg-[#8B5CF6] text-white flex items-center justify-center text-5xl">
              <FaCloudUploadAlt />
            </div>
            <h3 className="text-[#6D28D9] text-3xl font-black mt-8">Drag & Drop or Choose File</h3>
            <p className="text-gray-500 mt-3 text-lg">JPG, PNG, JPEG, WEBP (Max 10MB)</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                chooseFile();
              }}
              className="mt-8 bg-[#8B5CF6] text-white px-10 py-4 rounded-2xl border-2 border-black font-black shadow-[5px_5px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Choose File
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <label className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-600">
          Describe the outfit you want
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Example: Korean streetwear with a clean white shirt, relaxed denim, and sneakers"
          className="w-full rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#8B5CF6]"
        />

        <button
          type="button"
          onClick={handleGenerateStyle}
          disabled={styleLoading || !preview}
          className="w-full rounded-2xl border-2 border-black bg-[#8B5CF6] px-5 py-3 font-black text-white shadow-[4px_4px_0px_black] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {styleLoading ? "Generating outfit ideas..." : "Generate outfit ideas"}
        </button>
      </div>

      {analysis && (
        <div className="mt-6 rounded-[24px] border border-black bg-white p-4 text-sm text-gray-700">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6D28D9]">Stylist notes</p>
          <p className="whitespace-pre-line">{analysis}</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-black bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#6D28D9]">Clothing options</h3>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Tap to preview
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {recommendations.map((item, index) => {
                const imageUrl = item.image_url || item.image || item.product_url;
                return (
                  <button
                    key={`${item.product_id || item.title || index}`}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(item);
                      setShowTryOn(false);
                      setTryOnImageUrl("");
                    }}
                    className={`rounded-[20px] border-2 p-3 text-left transition-all ${
                      selectedProduct?.product_id === item.product_id || selectedProduct?.title === item.title
                        ? "border-[#8B5CF6] bg-[#F3EEFF]"
                        : "border-black bg-white"
                    }`}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.title || "Suggested clothing"} className="h-32 w-full rounded-[16px] object-cover" />
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-[16px] border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                        Preview image
                      </div>
                    )}
                    <p className="mt-3 font-black text-black">{item.title || "Suggested piece"}</p>
                    <p className="text-sm text-gray-600">{item.category || "Fashion pick"}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[24px] border border-black bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-[#6D28D9]">Virtual try-on preview</h3>
              <button
                type="button"
                onClick={handleTryOnPreview}
                disabled={!selectedProduct || tryOnLoading}
                className="rounded-full border-2 border-black bg-[#8B5CF6] px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0px_black] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {tryOnLoading ? "Generating..." : "Show outfit on you"}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Pick an outfit and press the button to preview it over your uploaded photo.
            </p>
            <div className="relative mt-4 overflow-hidden rounded-[20px] border border-black bg-[#f8f2ff]">
              {preview && (
                <img src={preview} alt="person preview" className="h-[340px] w-full object-cover" />
              )}
              {showTryOn && (tryOnImageUrl || selectedProduct) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/20 to-transparent">
                  <img
                    src={tryOnImageUrl || selectedProduct.image_url || selectedProduct.image || selectedProduct.product_url}
                    alt={selectedProduct?.title || "Selected outfit"}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              {!showTryOn && selectedProduct && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-center text-sm font-semibold text-gray-700">
                  Press “Show outfit on you” to view the try-on preview.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-6 bg-white border border-[#8B5CF6] rounded-2xl p-4 flex items-center gap-3 text-black">
          <FaCheckCircle />
          <span>Image uploaded successfully.</span>
        </div>
      )}

      {isMock && (
        <div className="mt-6 bg-white border border-yellow-500 rounded-2xl p-4 flex items-center gap-3 text-black">
          <FaImage />
          <span>Running in demo mode.</span>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-white border border-red-500 rounded-2xl p-4 flex items-center gap-3 text-black">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadSection;