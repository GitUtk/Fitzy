import React, { useState, useRef } from "react";
import {
  CloudUpload,
  Loader2,
  CheckCircle2,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      let data = null;
      if (response.ok) {
        data = await response.json();
      } else if (response.status === 404 || response.status === 405) {
        const similarResponse = await fetch(`${API_BASE_URL}/recommendations/similar`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Virtual Try-On</CardTitle>
        <CardDescription>
          Upload your photo, describe the outfit you want, and preview clothing options instantly.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={chooseFile}
          className={cn(
            "rounded-lg border-2 border-dashed transition-colors cursor-pointer overflow-hidden",
            dragActive ? "border-primary bg-accent" : "border-border bg-muted/30 hover:border-primary/50 hover:bg-accent/50"
          )}
        >
          <input
            ref={fileInputRef}
            hidden
            type="file"
            accept="image/*"
            onChange={handleChange}
          />

          {preview ? (
            <div className="relative">
              <img src={preview} alt="preview" className="h-[380px] w-full object-contain bg-background" />
              {loading && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="mt-4 text-sm font-medium">Uploading your look...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CloudUpload className="h-8 w-8" />
              </div>
              <h3 className="font-display font-semibold text-lg mt-6">Drag & drop or choose file</h3>
              <p className="text-muted-foreground mt-2 text-sm">JPG, PNG, JPEG, WEBP (Max 10MB)</p>
              <Button
                type="button"
                className="mt-6"
                onClick={(e) => {
                  e.stopPropagation();
                  chooseFile();
                }}
              >
                Choose File
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="outfit-prompt">Describe the outfit you want</Label>
          <Textarea
            id="outfit-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Example: Korean streetwear with a clean white shirt, relaxed denim, and sneakers"
          />
          <Button
            type="button"
            onClick={handleGenerateStyle}
            disabled={styleLoading || !preview}
            className="w-full"
          >
            {styleLoading && <Loader2 className="animate-spin" />}
            {styleLoading ? "Generating outfit ideas..." : "Generate outfit ideas"}
          </Button>
        </div>

        {analysis && (
          <Card className="bg-muted/30 shadow-none">
            <CardContent className="p-4">
              <Badge variant="secondary" className="mb-2">Stylist notes</Badge>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{analysis}</p>
            </CardContent>
          </Card>
        )}

        {recommendations.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Clothing options</CardTitle>
                  <span className="text-xs text-muted-foreground">Tap to preview</span>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {recommendations.map((item, index) => {
                  const imageUrl = item.image_url || item.image || item.product_url;
                  const isSelected =
                    selectedProduct?.product_id === item.product_id ||
                    selectedProduct?.title === item.title;

                  return (
                    <button
                      key={`${item.product_id || item.title || index}`}
                      type="button"
                      onClick={() => {
                        setSelectedProduct(item);
                        setShowTryOn(false);
                        setTryOnImageUrl("");
                      }}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-all hover:shadow-sm",
                        isSelected ? "border-primary bg-accent ring-1 ring-primary/20" : "border-border bg-card"
                      )}
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.title || "Suggested clothing"} className="h-28 w-full rounded-md object-cover" />
                      ) : (
                        <div className="flex h-28 items-center justify-center rounded-md border border-dashed bg-muted text-sm text-muted-foreground">
                          Preview image
                        </div>
                      )}
                      <p className="mt-2 font-medium text-sm">{item.title || "Suggested piece"}</p>
                      <p className="text-xs text-muted-foreground">{item.category || "Fashion pick"}</p>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">Virtual try-on preview</CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleTryOnPreview}
                    disabled={!selectedProduct || tryOnLoading}
                  >
                    {tryOnLoading && <Loader2 className="animate-spin" />}
                    {tryOnLoading ? "Generating..." : "Show outfit on you"}
                  </Button>
                </div>
                <CardDescription>
                  Pick an outfit and press the button to preview it over your uploaded photo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-hidden rounded-lg border bg-muted/30">
                  {preview && (
                    <img src={preview} alt="person preview" className="h-[300px] w-full object-contain bg-background" />
                  )}
                  {showTryOn && (tryOnImageUrl || selectedProduct) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/20 to-transparent">
                      <img
                        src={tryOnImageUrl || selectedProduct.image_url || selectedProduct.image || selectedProduct.product_url}
                        alt={selectedProduct?.title || "Selected outfit"}
                        className="h-full w-full object-contain bg-background"
                      />
                    </div>
                  )}
                  {!showTryOn && selectedProduct && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-center text-sm font-medium text-muted-foreground">
                      Press "Show outfit on you" to view the try-on preview.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {success && (
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Image uploaded successfully.</AlertDescription>
          </Alert>
        )}

        {isMock && (
          <Alert variant="warning">
            <ImageIcon className="h-4 w-4" />
            <AlertDescription>Running in demo mode.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadSection;
