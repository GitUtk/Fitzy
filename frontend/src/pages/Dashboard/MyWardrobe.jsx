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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    icon: "☀️",
    color: "hsl(var(--primary))",
  },
  {
    title: "Work Ready",
    description: "Pair outerwear with formal tops for a professional vibe.",
    icon: "💼",
    color: "#D946EF",
  },
  {
    title: "Weekend Brunch",
    description: "Light layers and accessories for a chic weekend feel.",
    icon: "☕",
    color: "#F59E0B",
  },
  {
    title: "Evening Glam",
    description: "Dress up your wardrobe pieces for a night out.",
    icon: "✨",
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
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(WARDROBE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem(WARDROBE_KEY, JSON.stringify(newItems));
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

  const handleConfirmPending = (taggedItems) => {
    // Strip transient fields before persisting
    const cleaned = taggedItems.map(({ file, extracting, editColor, editPattern, editMaterial, editFit, ...rest }) => rest);
    const updated = [...items, ...cleaned];
    saveItems(updated);
    setPendingItems([]);
  };


  const handleDelete = (id) => {
    const updated = items.filter((item) => item.id !== id);
    saveItems(updated);
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleCategoryChange = (id, category) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, category } : item
    );
    saveItems(updated);
    if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, category });
  };

  const handleRename = (id, name) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, name } : item
    );
    saveItems(updated);
    if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, name });
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
            variant="outline"
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            <Sparkles className="h-4 w-4" />
            Outfit Ideas
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
        <Card className="border-primary/20 bg-accent/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">
                AI Outfit Suggestions
                {items.length === 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (Upload clothes to get personalized suggestions)
                  </span>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add some clothes to your wardrobe first and we'll suggest outfits based on what you own!
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your {items.length} wardrobe item{items.length !== 1 ? "s" : ""}, here are some outfit ideas:
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {OUTFIT_SUGGESTIONS.map((suggestion, i) => (
                    <Card key={i} className="shadow-none hover:shadow-sm transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-lg"
                          style={{ backgroundColor: `${suggestion.color}15` }}
                        >
                          {suggestion.icon}
                        </div>
                        <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{suggestion.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {items.slice(0, 3).map((item) => (
                            <img
                              key={item.id}
                              src={item.src}
                              alt={item.name}
                              className="w-8 h-8 rounded-md object-cover border"
                            />
                          ))}
                          {items.length > 3 && (
                            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-xs font-medium text-primary">
                              +{items.length - 3}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

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
            <p className="text-xs text-primary/70 mt-1 font-medium">✨ AI will auto-detect category &amp; details</p>
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