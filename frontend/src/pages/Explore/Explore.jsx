import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Sparkles,
  Heart,
  ExternalLink,
  ShoppingBag,
  X,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "../Dashboard/Sidebar";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://127.0.0.1:8000/api/v1"
    : "https://fitzy-f7uv.onrender.com/api/v1");

function Explore() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedProductIds, setSavedProductIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 20;

  // Modal Detail State
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedGender !== "All") params.append("gender", selectedGender);
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (searchQuery.trim()) params.append("query", searchQuery.trim());
      const skip = (currentPage - 1) * itemsPerPage;
      params.append("skip", skip.toString());
      params.append("limit", itemsPerPage.toString());

      const response = await fetch(`${API_BASE_URL}/recommendations/catalog?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to load fashion catalog.");
      }

      const data = await response.json();
      let rawProducts = data.products || [];

      // Defensive client-side filter by selectedGender to ensure 100% strictness
      if (selectedGender === "Men") {
        rawProducts = rawProducts.filter((p) => p.store === "Snitch" || p.gender === "Men");
      } else if (selectedGender === "Women") {
        rawProducts = rawProducts.filter((p) => p.store === "Newme" || p.gender === "Women");
      }

      setProducts(rawProducts);
      setTotalProducts(data.total || rawProducts.length);
    } catch (err) {
      console.error("Catalog fetch error:", err);
      setError(err.message || "Failed to load catalog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedGender, selectedCategory, currentPage]);

  const handleGenderChange = (g) => {
    setSelectedGender(g);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCatalog();
  };

  const toggleFavorite = (productId, e) => {
    if (e) e.stopPropagation();
    setSavedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleTryOutfit = (product) => {
    const token = localStorage.getItem("token");
    if (product) {
      sessionStorage.setItem("pendingOutfit", JSON.stringify(product));
    }
    if (!token) {
      navigate("/login", {
        state: {
          selectedOutfit: product,
          fromExplore: true
        }
      });
      return;
    }
    navigate("/dashboard", {
      state: {
        selectedOutfit: product
      }
    });
  };

  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage));

  return (
    <div className="h-screen bg-background overflow-hidden flex">
      {/* Sidebar Navigation */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Catalog View */}
      <main className="lg:ml-[260px] flex-1 h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-red-600 dark:text-red-500">
                  Explore Outfit Catalog
                </h1>
                
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Browse real apparel from Snitch & Newme. Click any item to try it on directly on your photo.
              </p>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search shirts, dresses, linen, baggy fit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-20 h-11 text-sm bg-card border-border shadow-none focus-visible:ring-red-500"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Search
              </Button>
            </form>

            {/* Gender Filter Buttons */}
            <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border shrink-0 self-start md:self-auto">
              {["All", "Men", "Women"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderChange(g)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-md transition-all",
                    selectedGender === g
                      ? "bg-card text-red-600 dark:text-red-400 shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {g === "Men" ? "Men (Snitch)" : g === "Women" ? "Women (Newme)" : "All Stores"}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid State Handling */}
          {loading ? (
            /* Skeleton Loading State */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-3 space-y-3 animate-pulse">
                  <div className="h-44 w-full bg-muted rounded-lg" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                  <div className="h-8 w-full bg-muted rounded-lg" />
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div className="py-16 text-center bg-card border border-destructive/20 rounded-xl p-8 max-w-md mx-auto space-y-4">
              <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                <Info className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button size="sm" onClick={fetchCatalog} className="bg-red-600 hover:bg-red-700 text-white">
                Retry Loading Catalog
              </Button>
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center bg-card border border-border rounded-xl p-8 max-w-md mx-auto space-y-3">
              <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-semibold text-lg">No outfits found</h3>
              <p className="text-xs text-muted-foreground">
                Try adjusting your search query or switching categories/stores.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedGender("All");
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            /* Product Catalog Cards Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => {
                const isFavorite = savedProductIds.has(product.product_id);
                return (
                  <div
                    key={product.product_id || product.title}
                    onClick={() => setSelectedProductModal(product)}
                    className="group relative rounded-xl border border-border bg-card p-3 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-red-500/40 cursor-pointer overflow-hidden"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted mb-3">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            if (product.image && !product.image.startsWith("female")) {
                              e.currentTarget.src = `https://fitzy-coral.vercel.app/static/images/${product.image}`;
                            }
                          }}
                        />

                        {/* Store Badge */}
                        <div className="absolute top-2 left-2">
                          <span
                            className={cn(
                              "text-[10px] font-extrabold px-2 py-0.5 rounded-md text-white shadow-sm",
                              product.store === "Snitch" ? "bg-black/80" : "bg-purple-600/90"
                            )}
                          >
                            {product.store || "Catalog"}
                          </span>
                        </div>

                        {/* Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(product.product_id, e)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:scale-110 transition-transform shadow-sm"
                        >
                          <Heart
                            className={cn(
                              "h-3.5 w-3.5 transition-colors",
                              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                            )}
                          />
                        </button>
                      </div>

                      {/* Details */}
                      <p className="font-semibold text-sm line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {product.title}
                      </p>

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {product.category || "Apparel"}
                        </span>
                        {product.rating && (
                          <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            ★ {product.rating}
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-sm text-foreground mt-1.5">
                        ₹{product.price ? product.price.toLocaleString("en-IN") : "999"}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 mt-2 border-t border-border/50">
                      <Button
                        type="button"
                        size="sm"
                        className="w-full h-8 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTryOutfit(product);
                        }}
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Try This Outfit</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && !error && products.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-6 mt-8 gap-4">
              <p className="text-xs text-muted-foreground font-medium">
                Showing {products.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} items
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="text-xs font-semibold h-9 px-3.5"
                >
                  Previous
                </Button>
                <span className="text-xs font-semibold text-muted-foreground px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="text-xs font-semibold h-9 px-3.5"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Outfit Details Modal */}
      {selectedProductModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedProductModal(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-bold px-2.5 py-0.5 rounded text-white",
                    selectedProductModal.store === "Snitch" ? "bg-black" : "bg-purple-600"
                  )}
                >
                  {selectedProductModal.store}
                </span>
                <span className="text-xs text-muted-foreground">{selectedProductModal.gender}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProductModal(null)}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
              <div className="relative h-64 w-full rounded-xl overflow-hidden bg-muted">
                <img
                  src={selectedProductModal.image_url}
                  alt={selectedProductModal.title}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    if (selectedProductModal.image && !selectedProductModal.image.startsWith("female")) {
                      e.currentTarget.src = `https://fitzy-coral.vercel.app/static/images/${selectedProductModal.image}`;
                    }
                  }}
                />
              </div>

              <div>
                <h3 className="font-extrabold text-xl">{selectedProductModal.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-bold text-lg text-red-600 dark:text-red-400">
                    ₹{selectedProductModal.price ? selectedProductModal.price.toLocaleString("en-IN") : "999"}
                  </span>
                  {selectedProductModal.rating && (
                    <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      ★ {selectedProductModal.rating} Rating
                    </span>
                  )}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-3 rounded-lg border border-border">
                <div>
                  <span className="text-muted-foreground block">Category</span>
                  <span className="font-medium">{selectedProductModal.category || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Fit</span>
                  <span className="font-medium">{selectedProductModal.fit || "Standard"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Material</span>
                  <span className="font-medium">{selectedProductModal.material || "Quality Fabric"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Pattern</span>
                  <span className="font-medium">{selectedProductModal.pattern || "Plain/Textured"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  type="button"
                  className="w-full h-11 text-sm font-bold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 shadow-md"
                  onClick={() => handleTryOutfit(selectedProductModal)}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>✨ Try This Outfit</span>
                </Button>

                {selectedProductModal.product_url && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 text-xs font-semibold flex items-center justify-center gap-1.5"
                    onClick={() => {
                      window.open(selectedProductModal.product_url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <span>View on {selectedProductModal.store || "Store Website"}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Explore;
