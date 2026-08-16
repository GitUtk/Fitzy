import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PurchaseModal from "@/components/PurchaseModal";
import { Sparkles, ExternalLink } from "lucide-react";

function SimilarProducts({ products, loading, error }) {
  const [userProfile, setUserProfile] = useState(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("https://fitzy-f7uv.onrender.com/api/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getRecommendedSize = (item) => {
    if (!userProfile) return null;
    const cat = (item.category || "").toLowerCase();
    const isBottom = cat.includes("trouser") || cat.includes("pant") || cat.includes("jean") || cat.includes("bottom") || cat.includes("short");
    
    // Check past purchases for category match
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

    // Fallback to user profile registered size
    if (isBottom && userProfile.bottomSize) {
      return { size: userProfile.bottomSize, source: "your profile" };
    }
    if (!isBottom && userProfile.topSize) {
      return { size: userProfile.topSize, source: "your profile" };
    }

    return null;
  };

  const handleViewProduct = (item) => {
    if (item.product_url) {
      window.open(item.product_url, "_blank", "noopener,noreferrer");
    }
    setSelectedProductForModal(item);
    setIsModalOpen(true);
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold">Similar products</CardTitle>
        <p className="text-sm text-muted-foreground">
          Matching products with smart size recommendations.
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            Finding matching products...
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            Upload an outfit to discover similar products.
          </div>
        )}

        {products.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((item, index) => {
              const rec = getRecommendedSize(item);
              return (
                <div key={index} className="overflow-hidden rounded-xl border border-border bg-background flex flex-col justify-between">
                  <div>
                    <div className="relative">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-64 w-full object-cover"
                      />
                      {rec && (
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-red-500/30 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                          <Sparkles className="h-3 w-3 text-red-500" />
                          <span>Recommend Size: <strong className="text-red-400 font-extrabold">{rec.size}</strong></span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 p-4">
                      <div>
                        <h3 className="text-base font-semibold text-foreground line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.category}
                        </p>
                      </div>

                      {rec && (
                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium">
                          We recommend buying size <strong>{rec.size}</strong> based on {rec.source}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm pt-1">
                        <span className="font-medium text-foreground">
                          Rating {item.rating}
                        </span>
                        <span className="font-semibold text-foreground">₹{item.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Button type="button" onClick={() => handleViewProduct(item)} className="w-full flex items-center justify-center gap-1.5 font-semibold text-xs bg-red-600 hover:bg-red-700 text-white">
                      <span>View product</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProductForModal}
          onPurchaseSaved={() => fetchProfile()}
        />
      </CardContent>
    </Card>
  );
}

export default SimilarProducts;

