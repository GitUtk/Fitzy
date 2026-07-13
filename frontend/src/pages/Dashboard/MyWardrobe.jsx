import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Upload,
  ImagePlus,
  X,
  AlertCircle,
  FolderOpen,
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

const WARDROBE_KEY = "wardrobeItems";
const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

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

  const extractMetadata = async (file) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("You must be logged in to extract clothing metadata.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/recommendations/extract-metadata`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || "Failed to extract clothing metadata.");
    }

    return data?.metadata || null;
  };

  const inferCategoryFromMetadata = (metadata = {}) => {
    const category = (metadata.category || "").toLowerCase();
    const subcategory = (metadata.subcategory || "").toLowerCase();
    const fit = (metadata.fit || "").toLowerCase();

    const haystack = `${category} ${subcategory} ${fit}`;
    if (haystack.includes("shirt") || haystack.includes("top") || haystack.includes("blouse") || haystack.includes("tee")) return "Tops";
    if (haystack.includes("pant") || haystack.includes("jean") || haystack.includes("trouser") || haystack.includes("short")) return "Bottoms";
    if (haystack.includes("dress") || haystack.includes("gown")) return "Dresses";
    if (haystack.includes("coat") || haystack.includes("jacket") || haystack.includes("blazer") || haystack.includes("outerwear")) return "Outerwear";
    if (haystack.includes("shoe") || haystack.includes("sneaker") || haystack.includes("boot") || haystack.includes("sandal")) return "Shoes";
    if (haystack.includes("bag") || haystack.includes("belt") || haystack.includes("hat") || haystack.includes("cap") || haystack.includes("accessory")) return "Accessories";
    return "";
  };

  const processFiles = async (files) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!validFiles.length) return;

    try {
      const readers = validFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                id: `wardrobe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                src: e.target.result,
                name: file.name.replace(/\.[^/.]+$/, ""),
                category: "",
                metadata: null,
                size: file.size,
                addedAt: new Date().toISOString(),
              });
            };
            reader.readAsDataURL(file);
          })
      );

      const newPending = await Promise.all(readers);
      const metadataResults = await Promise.allSettled(validFiles.map((file) => extractMetadata(file)));

      const enrichedPending = newPending.map((item, index) => {
        const metadataResult = metadataResults[index];
        const metadata = metadataResult.status === "fulfilled" ? metadataResult.value : null;
        return {
          ...item,
          metadata,
          category: inferCategoryFromMetadata(metadata),
        };
      });

      setPendingItems(enrichedPending);
    } catch (err) {
      console.error(err);
      alert(err.message || "We couldn't extract metadata for one or more images.");
    }
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
    const updated = [...items, ...taggedItems];
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-red-600 dark:text-red-500">My Wardrobe</h2>
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
              Drag & drop images here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG, WEBP · Multiple files allowed</p>
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

function TaggingModal({ open, pendingItems, setPendingItems, onConfirm, categories }) {
  const [tagged, setTagged] = useState([]);

  useEffect(() => {
    if (open) {
      setTagged(pendingItems.map((item) => ({ ...item })));
    }
  }, [open, pendingItems]);

  const setCategory = (id, category) => {
    setTagged((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category } : item))
    );
  };

  const allTagged = tagged.every((item) => item.category !== "");

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && setPendingItems([])}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tag Your Clothes</DialogTitle>
          <DialogDescription>
            Select a category for each item before saving
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {tagged.map((item) => (
            <div key={item.id} className="flex gap-4 items-start">
              <div className="w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0">
                <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate mb-3">{item.name}</p>
                {item.metadata && (
                  <div className="mb-3 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                    <p><span className="font-medium text-foreground">Category:</span> {item.metadata.category || "Unknown"}</p>
                    <p><span className="font-medium text-foreground">Color:</span> {item.metadata.primaryColor || "Unknown"}{item.metadata.secondaryColor ? ` / ${item.metadata.secondaryColor}` : ""}</p>
                    <p><span className="font-medium text-foreground">Material:</span> {item.metadata.material || "Unknown"}</p>
                    <p><span className="font-medium text-foreground">Pattern:</span> {item.metadata.pattern || "Unknown"}</p>
                  </div>
                )}
                <Label className="text-xs text-muted-foreground">
                  Select Category <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
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
                {item.category === "" && (
                  <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Please select a category
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setPendingItems([])}>
            Cancel
          </Button>
          <Button disabled={!allTagged} onClick={() => onConfirm(tagged)}>
            Save to Wardrobe ({tagged.length} item{tagged.length !== 1 ? "s" : ""})
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
        <Badge variant="secondary" className="mt-1.5 text-xs">
          {item.category}
        </Badge>
        {item.metadata?.primaryColor && (
          <p className="mt-1 text-[11px] text-muted-foreground truncate">
            {item.metadata.primaryColor}
            {item.metadata.secondaryColor ? ` / ${item.metadata.secondaryColor}` : ""}
            {item.metadata.material ? ` · ${item.metadata.material}` : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default MyWardrobe;
