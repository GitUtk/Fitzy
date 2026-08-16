import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShoppingBag, CheckCircle, ArrowRight } from "lucide-react";

const TOP_SIZES = ["XS", "S", "M", "L", "XL"];
const BOTTOM_SIZES = ["XS", "S", "M", "L", "XL"];

export default function PurchaseModal({ isOpen, onClose, product, onPurchaseSaved }) {
  const [step, setStep] = useState(1); // 1: Did you buy?, 2: Select size, 3: Success
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!product) return null;

  const category = (product.category || "").toLowerCase();
  const isBottom = category.includes("trouser") || category.includes("pant") || category.includes("jean") || category.includes("bottom") || category.includes("short");
  const availableSizes = isBottom ? BOTTOM_SIZES : TOP_SIZES;

  const handleReset = () => {
    setStep(1);
    setSelectedSize("");
    setError("");
    onClose();
  };

  const handleConfirmPurchase = async () => {
    if (!selectedSize) {
      setError("Please select the size you bought.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";
      const response = await fetch(`${API_BASE_URL}/users/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          product_id: product.product_id || product.id || "",
          product_title: product.title || product.name || "Clothing item",
          category: product.category || "General",
          bought_size: selectedSize,
          product_url: product.product_url || product.image_url || "",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStep(3);
        if (onPurchaseSaved) {
          onPurchaseSaved(data.purchase || { category: product.category, bought_size: selectedSize });
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.detail || "Failed to record purchase.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleReset()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-500 mb-1">
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Purchase Assistant</span>
          </div>
          <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">
            {product.title || "Selected Item"}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            {step === 1 && "Did you make a purchase on the external store?"}
            {step === 2 && "Tell us what size you bought to get tailored recommendations in future!"}
            {step === 3 && "Purchase saved successfully!"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 text-xs rounded-md bg-red-500/10 text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="flex gap-3 items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              {product.image_url || product.image ? (
                <img
                  src={product.image_url || product.image}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-md border border-zinc-200 dark:border-zinc-800"
                />
              ) : null}
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1">{product.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{product.category || "Clothing"}</p>
                {product.price && <p className="text-xs font-bold text-red-500 mt-0.5">₹{product.price}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="w-full text-xs font-medium"
              >
                No, just browsing
              </Button>
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, I bought this <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Select the size you purchased:
              </Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                      selectedSize === sz
                        ? "bg-red-600 text-white border-red-600 shadow-sm"
                        : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2 sm:justify-between">
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="button"
                disabled={loading || !selectedSize}
                onClick={handleConfirmPurchase}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
              >
                {loading ? "Saving..." : "Save Size & Update Recommendations"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Order Saved!</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
              Fitzy will now automatically recommend size <strong>{selectedSize}</strong> for future {product.category || "similar"} items.
            </p>
            <Button type="button" onClick={handleReset} className="w-full mt-2 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white text-xs font-semibold">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
