import React, { useEffect, useState } from "react";
import { Heart, Download, Share2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function RecentLooks({
  looks = [],
  loading = false,
  limit,
  title = "My Looks",
  subtitle = "Outfits you have tried on appear here.",
}) {
  const [savedLooks, setSavedLooks] = useState([]);

  useEffect(() => {
    const refreshSavedLooks = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("savedLooks") || "[]");
        setSavedLooks(Array.isArray(saved) ? saved : []);
      } catch {
        setSavedLooks([]);
      }
    };

    refreshSavedLooks();
    window.addEventListener("storage", refreshSavedLooks);
    return () => window.removeEventListener("storage", refreshSavedLooks);
  }, []);

  const normalizeLook = (look, fallbackIndex = 0) => {
    const imageUrl = look?.image_url || look?.image || look?.url || look?.product_url || "";
    return {
      ...look,
      id: look?.id || look?.product_id || `${imageUrl || "look"}-${fallbackIndex}`,
      image_url: imageUrl,
      title: look?.title || look?.name || `Tried-on outfit ${fallbackIndex + 1}`,
      created_at: look?.created_at || new Date().toISOString(),
      category: look?.category || look?.type || "Fashion pick",
    };
  };

  const mergedLooks = [
    ...savedLooks.filter(Boolean).map((item, index) => normalizeLook(item, index)),
    ...looks
      .filter(Boolean)
      .map((item, index) => normalizeLook(item, index + savedLooks.length))
      .filter((item) => !savedLooks.some((savedItem) => {
        const savedImage = savedItem?.image_url || savedItem?.image || savedItem?.url || savedItem?.product_url || "";
        const itemImage = item?.image_url || item?.image || item?.url || item?.product_url || "";
        return savedItem?.id === item.id || (savedImage && savedImage === itemImage);
      })),
  ];

  const toggleSave = (look) => {
    const entry = normalizeLook(look);
    const exists = savedLooks.some((item) => {
      const savedImage = item?.image_url || item?.image || item?.url || item?.product_url || "";
      const incomingImage = entry.image_url || "";
      return item?.id === entry.id || (savedImage && savedImage === incomingImage);
    });

    const updated = exists
      ? savedLooks.filter((item) => {
          const savedImage = item?.image_url || item?.image || item?.url || item?.product_url || "";
          const incomingImage = entry.image_url || "";
          return item?.id !== entry.id && !(savedImage && savedImage === incomingImage);
        })
      : [entry, ...savedLooks];

    setSavedLooks(updated);
    localStorage.setItem("savedLooks", JSON.stringify(updated));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDownload = async (imageUrl, title) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${(title || "outfit").replace(/\s+/g, "_").toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(imageUrl, "_blank");
    }
  };

  const displayedLooks = limit ? mergedLooks.slice(0, limit) : mergedLooks;

  if (loading && mergedLooks.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="aspect-[4/5] w-full rounded-t-xl rounded-b-none" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && displayedLooks.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mt-4">No look yet</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">
                  Try on your first outfit to see it here
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedLooks.map((look, index) => {
          const imageUrl = look.image_url || look.image || look.url || look.product_url;
          const saved = savedLooks.some((item) => {
            const savedImage = item?.image_url || item?.image || item?.url || item?.product_url || "";
            const incomingImage = imageUrl || "";
            return item?.id === look.id || (savedImage && savedImage === incomingImage);
          });

          return (
            <Card key={look.id} className="overflow-hidden group">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={`Look ${index + 1}`}
                  className="w-full aspect-[4/5] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "absolute top-3 right-3 h-9 w-9 rounded-full shadow-sm",
                    saved && "text-primary"
                  )}
                  onClick={() => toggleSave(look)}
                >
                  <Heart className={cn("h-4 w-4", saved && "fill-current")} />
                </Button>
              </div>

              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base font-medium leading-snug">
                    {look.title || `Look ${displayedLooks.length - index}`}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDate(look.created_at)}
                  </span>
                </div>
                <CardDescription>Outfit tried on using Fitzy Virtual Try-On</CardDescription>
              </CardHeader>

              <CardFooter className="p-4 pt-0">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  size="sm"
                  onClick={() => handleDownload(imageUrl, look.title || `Look_${displayedLooks.length - index}`)}
                >
                  <Download className="h-4 w-4" />
                  Download Image
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default RecentLooks;
