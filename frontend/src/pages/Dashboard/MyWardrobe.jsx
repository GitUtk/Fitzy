import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Upload,
  ImagePlus,
  X,
  AlertCircle,
  FolderOpen,
  Loader2,
  Tag,
  ExternalLink,
  Shirt,
  ShoppingBag,
  Layers,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PurchaseModal from "@/components/PurchaseModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";
const WARDROBE_KEY = "wardrobeItems";

// Map Gemini category names to our wardrobe categories
const CATEGORY_MAP = {
  Shirts: "Tops",
  "T-Shirts": "Tops",
  "Casual Shirts": "Tops",
  "Formal Shirts": "Tops",
  Blouses: "Tops",
  Jeans: "Bottoms",
  Trousers: "Bottoms",
  Shorts: "Bottoms",
  Skirts: "Bottoms",
  Dresses: "Dresses",
  Outerwear: "Outerwear",
  Jackets: "Outerwear",
  Coats: "Outerwear",
  Blazers: "Outerwear",
  Shoes: "Shoes",
  Sneakers: "Shoes",
  Footwear: "Shoes",
  Boots: "Shoes",
  Accessories: "Accessories",
  Bags: "Accessories",
  Hats: "Accessories",
  Belts: "Accessories",
  Activewear: "Tops",
  "Ethnic Wear": "Tops",
  Lingerie: "Tops",
  Swimwear: "Tops",
};

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"];
const UPLOAD_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

const OUTFIT_SUGGESTIONS = [
  {
    title: "Casual Day Out",
    description: "Mix your tops with bottoms for a relaxed everyday look.",
    icon: "",
    color: "hsl(var(--primary))",
  },
  {
    title: "Work Ready",
    description: "Pair outerwear with formal tops for a professional vibe.",
    icon: "",
    color: "#D946EF",
  },
  {
    title: "Weekend Brunch",
    description: "Light layers and accessories for a chic weekend feel.",
    icon: "",
    color: "#F59E0B",
  },
  {
    title: "Evening Glam",
    description: "Dress up your wardrobe pieces for a night out.",
    icon: "",
    color: "#EC4899",
  },
];

/** Call the extract-metadata API for a single File object */
async function extractClothingMetadata(file) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/extract-metadata`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.metadata ?? null;
  } catch {
    return null;
  }
}

/** Fetch wardrobe items from MongoDB */
async function fetchWardrobeItems() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/wardrobe`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data ?? [];
  } catch {
    return [];
  }
}

/** Save a single verified wardrobe item to Cloudinary/MongoDB */
async function saveWardrobeItem(item) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const formData = new FormData();
  formData.append("file", item.file);
  formData.append("name", item.name);
  formData.append("category", item.category);
  formData.append("metadata", JSON.stringify(item.metadata ?? {}));

  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/wardrobe`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}

/** Update wardrobe item in MongoDB */
async function updateWardrobeItem(id, payload) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/wardrobe/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/** Delete wardrobe item from MongoDB */
async function deleteWardrobeItem(id) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/wardrobe/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.ok;
  } catch {
    return false;
  }
}

/** Map a Gemini category string to one of our wardrobe categories */
function mapCategory(geminiCategory) {
  if (!geminiCategory) return "";
  if (UPLOAD_CATEGORIES.includes(geminiCategory)) return geminiCategory;
  return CATEGORY_MAP[geminiCategory] ?? "";
}

function MyWardrobe() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [dragOver, setDragOver] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pendingItems, setPendingItems] = useState([]);
  const [activeModel, setActiveModel] = useState("model1"); // 'model1': Uploaded Wardrobe, 'model2': Fitzy Catalog
  const [outfitsLoading, setOutfitsLoading] = useState(false);
  const [model1Pairs, setModel1Pairs] = useState([]);
  const [model2Pairs, setModel2Pairs] = useState([]);
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
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWardrobeItems().then((fetchedItems) => {
      setItems(fetchedItems);
    });
    fetchProfile();
  }, []);

  const handleGenerateOutfits = async () => {
    setShowSuggestions(true);
    setOutfitsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations/wardrobe-outfits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ items }),
      });
      if (response.ok) {
        const data = await response.json();
        setModel1Pairs(data.model_1_pairs || []);
        setModel2Pairs(data.model_2_pairs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOutfitsLoading(false);
    }
  };

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

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!validFiles.length) return;

    // Create pending items with loading state immediately
    const initialPending = validFiles.map((file) => ({
      id: `wardrobe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      src: null,
      name: file.name.replace(/\.[^/.]+$/, ""),
      category: "",
      metadata: null,
      extracting: true,
      size: file.size,
      addedAt: new Date().toISOString(),
    }));

    // Read all files as data URLs
    const readers = initialPending.map(
      (pending) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({ ...pending, src: e.target.result });
          };
          reader.readAsDataURL(pending.file);
        })
    );

    Promise.all(readers).then((withSrcs) => {
      // Show modal immediately with loading spinners
      setPendingItems(withSrcs);

      // Extract metadata for each item in parallel
      withSrcs.forEach((item) => {
        extractClothingMetadata(item.file).then((metadata) => {
          const mappedCategory = mapCategory(metadata?.category);
          setPendingItems((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? { ...p, metadata, category: mappedCategory, extracting: false }
                : p
            )
          );
        });
      });
    });
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleConfirmPending = async (taggedItems) => {
    try {
      // Save all items to MongoDB/Cloudinary in parallel
      const saved = await Promise.all(taggedItems.map(saveWardrobeItem));
      const successful = saved.filter(Boolean);
      setItems((prev) => [...successful, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setPendingItems([]);
    }
  };


  const handleDelete = async (id) => {
    const success = await deleteWardrobeItem(id);
    if (success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    }
  };

  const handleCategoryChange = async (id, category) => {
    const success = await updateWardrobeItem(id, { category });
    if (success) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, category } : item))
      );
      if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, category });
    }
  };

  const handleRename = async (id, name) => {
    const success = await updateWardrobeItem(id, { name });
    if (success) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, name } : item))
      );
      if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, name });
    }
  };

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">My Wardrobe</h2>
          <p className="text-muted-foreground mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} saved · Upload clothes to get AI outfit suggestions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showSuggestions ? "default" : "outline"}
            onClick={() => {
              if (!showSuggestions) {
                handleGenerateOutfits();
              } else {
                setShowSuggestions(false);
              }
            }}
            className="font-semibold text-xs gap-1.5"
          >
            <Sparkles className="h-4 w-4 text-red-500" />
            <span>Generate Outfit Ideas</span>
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Upload Clothes
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {showSuggestions && (
        <Card className="border-red-500/20 bg-card shadow-md">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-red-500" />
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">AI Outfit Ideas</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Discover style combinations powered by your saved wardrobe & catalog.
                  </CardDescription>
                </div>
              </div>

              {/* Dual Model Switcher */}
              <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setActiveModel("model1")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5",
                    activeModel === "model1"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Shirt className="h-3.5 w-3.5 text-red-500" />
                  <span>From Your Wardrobe</span>
                  {model1Pairs.length > 0 && (
                    <span className="bg-red-500/10 text-red-500 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {model1Pairs.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModel("model2")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5",
                    activeModel === "model2"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-red-500" />
                  <span>From Fitzy Catalog</span>
                  {model2Pairs.length > 0 && (
                    <span className="bg-red-500/10 text-red-500 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {model2Pairs.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {outfitsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-3" />
                <p className="text-sm font-semibold">Generating outfit recommendations...</p>
                <p className="text-xs text-muted-foreground mt-1">Analyzing color compatibility, fit, and catalog matches</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-10">
                <FolderOpen className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Your wardrobe is currently empty.</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Upload tops & bottoms above to generate personalized outfits!</p>
                <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                  Upload Clothes
                </Button>
              </div>
            ) : activeModel === "model1" ? (
              /* MODEL 1: Outfits using uploaded wardrobe items */
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium">
                  <strong>Model 1: From Your Uploaded Wardrobe</strong> — Pairings created exclusively from items you own and uploaded.
                </div>

                {model1Pairs.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-xl">
                    <p className="text-sm font-medium">Add more items to unlock wardrobe pairings.</p>
                    <p className="text-xs text-muted-foreground mt-1">Upload both Tops and Bottoms to generate complete outfit pairs from your closet!</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {model1Pairs.map((pair) => (
                      <div key={pair.id} className="p-4 rounded-xl border border-border bg-background flex flex-col justify-between space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-foreground line-clamp-1">{pair.title}</h4>
                          <Badge variant="outline" className="text-[10px] text-red-500 border-red-500/30">
                            Saved Wardrobe
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 items-center bg-muted/30 p-2 rounded-lg">
                          {pair.top ? (
                            <div className="text-center">
                              <img src={pair.top.src || pair.top.image_url || pair.top.url || pair.top.image} alt={pair.top.name} className="h-28 w-full object-cover rounded-md border border-border" />
                              <p className="text-[11px] font-semibold mt-1 line-clamp-1">{pair.top.name}</p>
                              <p className="text-[10px] text-muted-foreground">{pair.top.category}</p>
                            </div>
                          ) : pair.item ? (
                            <div className="text-center col-span-2">
                              <img src={pair.item.src || pair.item.image_url || pair.item.url || pair.item.image} alt={pair.item.name} className="h-32 w-48 mx-auto object-cover rounded-md border border-border" />
                              <p className="text-[11px] font-semibold mt-1">{pair.item.name}</p>
                              <p className="text-[10px] text-muted-foreground">{pair.item.category}</p>
                            </div>
                          ) : null}

                          {pair.bottom && (
                            <div className="text-center">
                              <img src={pair.bottom.src || pair.bottom.image_url || pair.bottom.url || pair.bottom.image} alt={pair.bottom.name} className="h-28 w-full object-cover rounded-md border border-border" />
                              <p className="text-[11px] font-semibold mt-1 line-clamp-1">{pair.bottom.name}</p>
                              <p className="text-[10px] text-muted-foreground">{pair.bottom.category}</p>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground italic">"{pair.style_note}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* MODEL 2: Outfits combining uploaded items with Fitzy Catalog */
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium">
                  <strong>Model 2: From Fitzy Catalog</strong> — Complementary topware & bottomwear suggested from the product catalog to pair with your uploaded items.
                </div>

                {model2Pairs.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-xl">
                    <p className="text-sm font-medium">Finding catalog matches...</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {model2Pairs.map((pair) => {
                      const rec = getRecommendedSize(pair.catalog_item);
                      const userImg = pair.user_item?.src || pair.user_item?.image_url || pair.user_item?.url || pair.user_item?.image;
                      const catalogImg = pair.catalog_item?.image_url || pair.catalog_item?.image || pair.catalog_item?.url;
                      return (
                        <div key={pair.id} className="p-4 rounded-xl border border-border bg-background flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-foreground line-clamp-1">{pair.title}</h4>
                            <Badge variant="secondary" className="text-[10px]">
                              Catalog Match
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 items-center bg-muted/30 p-2 rounded-lg">
                            <div className="text-center">
                              <div className="relative">
                                <img src={userImg} alt={pair.user_item?.name || "Your item"} className="h-28 w-full object-cover rounded-md border border-border" />
                                <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  Your Item
                                </span>
                              </div>
                              <p className="text-[11px] font-semibold mt-1 line-clamp-1">{pair.user_item?.name || "Your Item"}</p>
                            </div>

                            <div className="text-center">
                              <div className="relative">
                                <img src={catalogImg} alt={pair.catalog_item?.title || "Catalog item"} className="h-28 w-full object-cover rounded-md border border-border" />
                                <span className="absolute bottom-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  Catalog
                                </span>
                              </div>
                              <p className="text-[11px] font-semibold mt-1 line-clamp-1">{pair.catalog_item?.title || "Catalog Item"}</p>
                              {pair.catalog_item?.price && (
                                <p className="text-[10px] font-bold text-red-500">₹{pair.catalog_item.price}</p>
                              )}
                            </div>
                          </div>

                          {rec && (
                            <div className="p-2 rounded-md bg-red-500/10 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center justify-between">
                              <span>Recommended Catalog Size:</span>
                              <strong className="bg-red-600 text-white px-2 py-0.5 rounded text-[11px] font-bold">{rec.size}</strong>
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground italic">"{pair.style_note}"</p>

                          <div className="flex gap-2 pt-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full text-xs font-semibold flex items-center justify-center gap-1"
                              onClick={() => {
                                if (pair.catalog_item.product_url) {
                                  window.open(pair.catalog_item.product_url, "_blank", "noopener,noreferrer");
                                }
                                setPurchaseModalProduct(pair.catalog_item);
                                setIsPurchaseModalOpen(true);
                              }}
                            >
                              <span>Buy Catalog Item</span>
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        product={purchaseModalProduct}
        onPurchaseSaved={() => fetchProfile()}
      />

      {items.length === 0 ? (
        <Card
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed cursor-pointer transition-colors",
            dragOver ? "border-primary bg-accent" : "hover:border-primary/50 hover:bg-accent/50"
          )}
        >
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent mb-4">
              <ImagePlus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg">Upload Your Clothes</h3>
            <p className="text-muted-foreground text-sm mt-2">
              Drag &amp; drop images here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG, WEBP · Multiple files allowed</p>
            <p className="text-xs text-primary/70 mt-1 font-medium">AI will auto-detect category &amp; details</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed cursor-pointer transition-colors",
              dragOver ? "border-primary bg-accent" : "hover:border-primary/50 hover:bg-accent/50"
            )}
          >
            <CardContent className="flex items-center justify-center gap-2 py-4 text-muted-foreground hover:text-primary transition-colors">
              <ImagePlus className="h-4 w-4" />
              <span className="text-sm font-medium">Drop more clothes here or click to upload</span>
            </CardContent>
          </Card>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const count = cat === "All" ? items.length : items.filter((i) => i.category === cat).length;
              return (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat} {count > 0 && <span className="opacity-60">({count})</span>}
                </Button>
              );
            })}
          </div>

          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <FolderOpen className="h-10 w-10 mb-3" />
                <p className="font-medium">No items in "{activeCategory}" yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
                <WardrobeCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <TaggingModal
        open={pendingItems.length > 0}
        pendingItems={pendingItems}
        setPendingItems={setPendingItems}
        onConfirm={handleConfirmPending}
        categories={UPLOAD_CATEGORIES}
      />

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {selectedItem && (
            <>
              <div className="aspect-square overflow-hidden">
                <img src={selectedItem.src} alt={selectedItem.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-4">
                <DialogHeader className="space-y-3">
                  <Input
                    value={selectedItem.name}
                    onChange={(e) => handleRename(selectedItem.id, e.target.value)}
                    className="text-lg font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0"
                    placeholder="Item name"
                  />
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">Category</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {UPLOAD_CATEGORIES.map((cat) => (
                        <Button
                          key={cat}
                          variant={selectedItem.category === cat ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCategoryChange(selectedItem.id, cat)}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedItem.metadata && (
                    <MetadataSummary metadata={selectedItem.metadata} />
                  )}

                  <DialogDescription>
                    Added {new Date(selectedItem.addedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => { handleDelete(selectedItem.id); setSelectedItem(null); }}
                  >
                    Remove
                  </Button>
                  <Button className="flex-1" onClick={() => setSelectedItem(null)}>
                    Done
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Compact read-only display of AI-extracted metadata */
function MetadataSummary({ metadata }) {
  const tags = [
    metadata.primaryColor,
    metadata.pattern,
    metadata.material,
    metadata.fit,
    ...(metadata.style || []),
  ].filter(Boolean);

  const occasions = (metadata.occasion || []).filter(Boolean);
  const seasons = (metadata.season || []).filter(Boolean);

  if (!tags.length && !occasions.length && !seasons.length) return null;

  return (
    <div className="space-y-2 pt-1 border-t">
      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-primary" />
        AI Detected Details
        {metadata.confidence != null && (
          <span className="ml-auto text-xs opacity-60">{Math.round(metadata.confidence * 100)}% confidence</span>
        )}
      </p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((t, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>
          ))}
        </div>
      )}
      {seasons.length > 0 && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Season:</span> {seasons.join(", ")}
        </p>
      )}
      {occasions.length > 0 && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Occasion:</span> {occasions.join(", ")}
        </p>
      )}
    </div>
  );
}

/** Shimmer skeleton for loading state */
function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}

function TaggingModal({ open, pendingItems, setPendingItems, onConfirm, categories }) {
  const [tagged, setTagged] = useState([]);

  // Initialise tagged state when modal opens
  useEffect(() => {
    if (open) {
      setTagged(pendingItems.map((item) => ({ ...item })));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync extracting/metadata as pendingItems update, but never overwrite user edits
  useEffect(() => {
    if (!open) return;
    setTagged((prev) =>
      prev.map((t) => {
        const updated = pendingItems.find((p) => p.id === t.id);
        if (!updated) return t;
        // Only apply metadata if we just finished extracting (transition: true -> false)
        const justFinished = t.extracting && !updated.extracting;
        return {
          ...t,
          extracting: updated.extracting,
          // Pull in metadata only when extraction just completed
          metadata: justFinished
            ? updated.metadata
            : t.metadata,
          // Auto-fill editable fields only on first arrival, user edits take priority
          name: justFinished && updated.metadata?.subcategory && t.name === (t._originalName ?? t.name)
            ? t.name  // keep file name, subcategory is just a label
            : t.name,
          category:
            t.category === "" && updated.category ? updated.category : t.category,
          // Editable metadata fields — prefill from AI if user hasn't touched them
          editColor:   justFinished && !t.editColor   ? (updated.metadata?.primaryColor ?? "")   : (t.editColor ?? ""),
          editPattern: justFinished && !t.editPattern ? (updated.metadata?.pattern ?? "")        : (t.editPattern ?? ""),
          editMaterial:justFinished && !t.editMaterial? (updated.metadata?.material ?? "")       : (t.editMaterial ?? ""),
          editFit:     justFinished && !t.editFit     ? (updated.metadata?.fit ?? "")            : (t.editFit ?? ""),
        };
      })
    );
  }, [pendingItems, open]);

  const updateField = (id, field, value) => {
    setTagged((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const setCategory = (id, category) => updateField(id, "category", category);

  const allTagged = tagged.every((item) => item.category !== "");
  const anyExtracting = tagged.some((item) => item.extracting);

  const handleSave = () => {
    // Merge edited fields back into metadata before confirming
    const final = tagged.map((item) => ({
      ...item,
      metadata: item.metadata
        ? {
            ...item.metadata,
            primaryColor: item.editColor   || item.metadata.primaryColor,
            pattern:      item.editPattern  || item.metadata.pattern,
            material:     item.editMaterial || item.metadata.material,
            fit:          item.editFit      || item.metadata.fit,
          }
        : null,
    }));
    onConfirm(final);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && setPendingItems([])}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tag Your Clothes
          </DialogTitle>
          <DialogDescription>
            {anyExtracting
              ? "AI is analysing your items — details will appear shortly."
              : "Review and edit the details, then save to your wardrobe."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {tagged.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border p-4 transition-all duration-300",
                item.extracting
                  ? "bg-muted/40 border-border"
                  : "bg-card border-border shadow-sm"
              )}
            >
              <div className="flex gap-4 items-start">
                {/* Thumbnail */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border flex-shrink-0">
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.name}
                      className={cn(
                        "w-full h-full object-cover transition-opacity duration-300",
                        item.extracting ? "opacity-60" : "opacity-100"
                      )}
                    />
                  ) : (
                    <Skeleton className="w-full h-full" />
                  )}
                  {item.extracting && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/30">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                      <span className="text-white text-[10px] font-medium">Analysing…</span>
                    </div>
                  )}
                </div>

                {/* Right-hand content */}
                <div className="flex-1 min-w-0 space-y-3">

                  {/* Item name (always editable) */}
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Item name</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateField(item.id, "name", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="e.g. White Linen Shirt"
                    />
                  </div>

                  {/* Metadata fields — skeleton while loading, editable after */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Color */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Colour</Label>
                      {item.extracting ? (
                        <Skeleton className="h-8 w-full" />
                      ) : (
                        <Input
                          value={item.editColor ?? ""}
                          onChange={(e) => updateField(item.id, "editColor", e.target.value)}
                          className="h-8 text-sm"
                          placeholder="e.g. White"
                        />
                      )}
                    </div>
                    {/* Pattern */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Pattern</Label>
                      {item.extracting ? (
                        <Skeleton className="h-8 w-full" />
                      ) : (
                        <Input
                          value={item.editPattern ?? ""}
                          onChange={(e) => updateField(item.id, "editPattern", e.target.value)}
                          className="h-8 text-sm"
                          placeholder="e.g. Plain"
                        />
                      )}
                    </div>
                    {/* Material */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Material</Label>
                      {item.extracting ? (
                        <Skeleton className="h-8 w-full" />
                      ) : (
                        <Input
                          value={item.editMaterial ?? ""}
                          onChange={(e) => updateField(item.id, "editMaterial", e.target.value)}
                          className="h-8 text-sm"
                          placeholder="e.g. Cotton"
                        />
                      )}
                    </div>
                    {/* Fit */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Fit</Label>
                      {item.extracting ? (
                        <Skeleton className="h-8 w-full" />
                      ) : (
                        <Input
                          value={item.editFit ?? ""}
                          onChange={(e) => updateField(item.id, "editFit", e.target.value)}
                          className="h-8 text-sm"
                          placeholder="e.g. Regular"
                        />
                      )}
                    </div>
                  </div>

                  {/* Confidence badge */}
                  {!item.extracting && item.metadata?.confidence != null && (
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-xs text-muted-foreground">
                        AI confidence: {Math.round(item.metadata.confidence * 100)}%
                      </span>
                    </div>
                  )}

                  {/* Category picker */}
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Category <span className="text-destructive">*</span>
                      {!item.extracting && item.category && item.metadata && (
                        <span className="ml-1 text-primary font-medium">(auto-detected)</span>
                      )}
                    </Label>
                    {item.extracting ? (
                      <div className="flex gap-2 flex-wrap mt-1">
                        {["…", "…", "…", "…"].map((_, i) => (
                          <Skeleton key={i} className="h-8 w-20 rounded-md" />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {categories.map((cat) => (
                          <Button
                            key={cat}
                            variant={item.category === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCategory(item.id, cat)}
                          >
                            {cat}
                          </Button>
                        ))}
                      </div>
                    )}
                    {item.category === "" && !item.extracting && (
                      <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Please select a category
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setPendingItems([])}>
            Cancel
          </Button>
          <Button disabled={!allTagged || anyExtracting} onClick={handleSave}>
            {anyExtracting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analysing…
              </>
            ) : (
              <>Save to Wardrobe ({tagged.length} item{tagged.length !== 1 ? "s" : ""})</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WardrobeCard({ item, onDelete, onClick }) {
  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden" onClick={onClick}>
        <img
          src={item.src}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">View</span>
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <CardContent className="p-3">
        <p className="text-xs font-medium truncate">{item.name}</p>
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {item.category}
          </Badge>
          {item.metadata?.primaryColor && (
            <span className="text-xs text-muted-foreground truncate">{item.metadata.primaryColor}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default MyWardrobe;