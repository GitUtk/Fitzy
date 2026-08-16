import React, { useState, useRef, useEffect } from "react";
import {
  CloudUpload,
  CheckCircle2,
  ImageIcon,
  AlertCircle,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DotmSquare18 } from "@/components/ui/dotm-square-18";
import PurchaseModal from "@/components/PurchaseModal";

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
  const [showingOriginal, setShowingOriginal] = useState(false);
  const [tryOnProgress, setTryOnProgress] = useState(0);
  const [tryOnDisplayText, setTryOnDisplayText] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseModalProduct, setPurchaseModalProduct] = useState(null);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getRecommendedSize = (item) => {
    if (!userProfile) return null;
    const cat = (item?.category || "").toLowerCase();
    const isBottom = cat.includes("trouser") || cat.includes("pant") || cat.includes("jean") || cat.includes("bottom") || cat.includes("short");

    if (Array.isArray(userProfile.purchases) && userProfile.purchases.length > 0) {
      const match = userProfile.purchases.find((p) => {
        const pCat = (p.category || "").toLowerCase();
        return isBottom
          ? pCat.includes("trouser") || pCat.includes("pant") || pCat.includes("jean") || pCat.includes("bottom")
          : pCat.includes("top") || pCat.includes("shirt") || pCat.includes("jacket");
      });
      if (match && match.bought_size) {
        return { size: match.bought_size, source: "past orders" };
      }
    }

    if (isBottom && userProfile.bottomSize) {
      return { size: userProfile.bottomSize, source: "your profile" };
    }
    if (!isBottom && userProfile.topSize) {
      return { size: userProfile.topSize, source: "your profile" };
    }

    return null;
  };

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

  const handleTryOnPreview = async (productToTry = selectedProduct) => {
    if (!productToTry) return;

    setTryOnLoading(true);
    setTryOnProgress(0);
    setTryOnDisplayText("");
    setError(null);
    setShowingOriginal(false);

    // Use the actual Gemini critique text returned from style generation
    const criticText = analysis || "Your custom style recommendations are being integrated. Based on your input, the AI Stylist is processing matching clothing options to adapt to your style and profile.";

    // Start 40-second progress interval
    const totalDuration = 40000; // 40 seconds
    const progressIntervalTime = 100; // update every 100ms
    const totalSteps = totalDuration / progressIntervalTime; // 400 steps
    let currentStep = 0;

    // We want the text to type out gradually over the first ~35 seconds
    const typeEndStep = Math.floor(totalSteps * 0.85); // finish typing by 85% progress

    const intervalId = setInterval(() => {
      currentStep++;
      const progressPercent = (currentStep / totalSteps) * 100;
      setTryOnProgress(Math.min(progressPercent, 100));

      // Calculate how many characters to show
      if (currentStep <= typeEndStep) {
        const charIndex = Math.floor((currentStep / typeEndStep) * criticText.length);
        setTryOnDisplayText(criticText.slice(0, charIndex));
      } else {
        setTryOnDisplayText(criticText);
      }

      if (currentStep >= totalSteps) {
        clearInterval(intervalId);
      }
    }, progressIntervalTime);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to use virtual try-on.");
      }

      const photoFile = fileInputRef.current?.files?.[0];
      const formData = new FormData();
      formData.append("garment_url", productToTry.image_url || productToTry.image || productToTry.product_url || "");
      formData.append("category", inferCategory(productToTry?.category));
      if (photoFile) {
        formData.append("file", photoFile);
      }

      // Start fetching immediately in parallel with the 40-second animation
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

      // Wait until the 40-second animation completes before showing the result
      const timeElapsed = currentStep * progressIntervalTime;
      const timeRemaining = Math.max(0, totalDuration - timeElapsed);

      setTimeout(() => {
        setTryOnImageUrl(generatedImage);
        setTryOnLoading(false);
        saveTriedOnLook(productToTry, generatedImage);
      }, timeRemaining);

    } catch (err) {
      clearInterval(intervalId);
      setTryOnLoading(false);
      console.error(err);
      setError(err.message || "The try-on preview could not be generated right now.");
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
        ? data.recommendations.flatMap((group) => group?.products || [])
        : Array.isArray(data?.results)
          ? data.results
          : [];

      const normalizedResults = results.filter(Boolean);

      setRecommendations(normalizedResults);
      setAnalysis(data?.critique || data?.analysis || "Style suggestions are ready for you to preview.");
      setSelectedProduct(normalizedResults[0] || null);
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
        <CardTitle className="text-2xl font-extrabold text-red-600 dark:text-red-500">Virtual Try-On</CardTitle>
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
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img
                src={showingOriginal ? preview : (tryOnImageUrl || preview)}
                alt="preview"
                className="h-[380px] w-full object-contain bg-background"
              />
              {tryOnImageUrl && !tryOnLoading && (
                <div className="absolute top-4 right-4 flex gap-1 bg-background/90 backdrop-blur-sm p-1 rounded-full border border-border shadow-sm">
                  <Button
                    type="button"
                    size="xs"
                    variant={showingOriginal ? "default" : "ghost"}
                    className="h-6 rounded-full text-[10px] px-2.5"
                    onClick={() => setShowingOriginal(true)}
                  >
                    Original
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    variant={!showingOriginal ? "default" : "ghost"}
                    className="h-6 rounded-full text-[10px] px-2.5"
                    onClick={() => setShowingOriginal(false)}
                  >
                    Try-On Result
                  </Button>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                  <DotmSquare18 className="h-10 w-10 text-primary" />
                  <p className="mt-4 text-sm font-medium">Uploading your look...</p>
                </div>
              )}
              {tryOnLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-lg flex flex-col justify-between p-6 text-center select-none z-10 rounded-lg animate-fade-in">

                  {/* Top Bar */}
                  <div className="flex items-center justify-between w-full border-b border-border/40 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">AI Stylist Analysis</span>
                    </div>
                    <span className="text-[10px] font-mono tabular-nums text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full border border-border/30">
                      {Math.max(0, Math.ceil(40 - (tryOnProgress * 0.4)))}s remaining
                    </span>
                  </div>

                  {/* Main Critique Content */}
                  <div className="flex-1 flex flex-col justify-center px-2 py-4">
                    <div className="max-w-md mx-auto text-left space-y-2">
                      <span className="text-[10px] font-semibold text-primary uppercase tracking-widest block">Live Feedback</span>
                      <p className="text-xs md:text-sm font-medium leading-relaxed text-foreground/80 italic min-h-[90px]">
                        "{tryOnDisplayText || 'Analyzing style components...'}"
                        <span className="inline-block w-1 h-3.5 bg-primary ml-1 animate-pulse align-middle" />
                      </p>
                    </div>
                  </div>

                  {/* Bottom Progress */}
                  <div className="w-full space-y-2 pt-3 border-t border-border/40">
                    <div className="h-1 w-full bg-muted/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-100 ease-linear"
                        style={{ width: `${tryOnProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium">
                      <span>Synthesizing clothing texture...</span>
                      <span>{Math.round(tryOnProgress)}%</span>
                    </div>
                  </div>
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
            {styleLoading && <DotmSquare18 className="h-4 w-4 text-current" />}
            {styleLoading ? "Generating outfit ideas..." : "Generate outfit ideas"}
          </Button>
        </div>



        {recommendations.length > 0 && (
          <Card className="shadow-none border border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-extrabold text-red-600 dark:text-red-500">Clothing Options</CardTitle>
                <span className="text-xs text-muted-foreground">Click "Try On" to preview style directly on your photo</span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {recommendations.filter(Boolean).map((item, index) => {
                const imageUrl = item?.image_url || item?.image || item?.product_url;
                const isSelected =
                  selectedProduct?.product_id === item?.product_id ||
                  selectedProduct?.title === item?.title;
                const rec = getRecommendedSize(item);

                return (
                  <div
                    key={`${item?.product_id || item?.title || index}`}
                    onClick={() => {
                      setSelectedProduct(item);
                    }}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-all hover:shadow-sm cursor-pointer flex flex-col justify-between h-full relative group",
                      isSelected ? "border-primary bg-accent ring-1 ring-primary/20" : "border-border bg-card"
                    )}
                  >
                    <div>
                      <div className="relative h-28 w-full overflow-hidden rounded-md bg-muted">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item?.title || "Suggested clothing"}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center border border-dashed text-sm text-muted-foreground">
                            Preview image
                          </div>
                        )}
                        {rec && (
                          <div className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/40 flex items-center gap-1 shadow">
                            <Sparkles className="h-2.5 w-2.5 text-red-500" />
                            <span>Size <strong className="text-red-400">{rec.size}</strong></span>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 font-medium text-sm line-clamp-1">{item?.title || "Suggested piece"}</p>
                      <p className="text-xs text-muted-foreground mb-1">{item?.category || "Fashion pick"}</p>

                      {rec && (
                        <p className="text-[11px] text-red-500 font-semibold mb-2 line-clamp-1">
                          Recommended: <strong>{rec.size}</strong> ({rec.source})
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <Button
                        type="button"
                        size="sm"
                        className="w-full text-xs font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(item);
                          handleTryOnPreview(item);
                        }}
                        disabled={tryOnLoading}
                      >
                        Try On
                      </Button>

                      {item.product_url && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full text-xs font-semibold flex items-center justify-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.product_url) {
                              window.open(item.product_url, "_blank", "noopener,noreferrer");
                            }
                            setPurchaseModalProduct(item);
                            setIsPurchaseModalOpen(true);
                          }}
                        >
                          <span>Buy Item</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <PurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          product={purchaseModalProduct}
          onPurchaseSaved={() => fetchProfile()}
        />

        {success && (
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Image uploaded successfully.</AlertDescription>
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
