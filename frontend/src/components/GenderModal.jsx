import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

export default function GenderModal({ isOpen, onSuccess }) {
  const [selectedGender, setSelectedGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Error fetching profile inside GenderModal:", err);
      }
    };

    fetchProfile();
  }, [isOpen]);

  const handleSave = async () => {
    if (!selectedGender) return;

    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Merge new gender with existing profile data so we don't overwrite other fields with None
      const updatedProfile = {
        fullName: profile?.fullName || "",
        email: profile?.email || "",
        gender: selectedGender,
        age: profile?.age || "",
        height: profile?.height || "",
        bodyType: profile?.bodyType || "",
        fitPreference: profile?.fitPreference || "",
        budget: profile?.budget || "",
        topSize: profile?.topSize || "",
        bottomSize: profile?.bottomSize || "",
        shoeSize: profile?.shoeSize || "",
        styles: Array.isArray(profile?.styles) ? profile.styles : [],
        colors: Array.isArray(profile?.colors) ? profile.colors : [],
      };

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedProfile)
      });

      if (response.ok) {
        onSuccess(selectedGender);
      } else {
        alert("Failed to save gender preference. Please try again.");
      }
    } catch (err) {
      console.error("Error saving gender:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[420px] [&>button]:hidden text-foreground">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-red-600 dark:text-red-500">
            Specify Your Gender
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-normal">
            To provide you with the correct clothing recommendations and stylist options, please specify your gender.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-6">
          <button
            type="button"
            onClick={() => setSelectedGender("Male")}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3
              ${
                selectedGender === "Male"
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border bg-background hover:bg-muted text-muted-foreground"
              }`}
          >
            <span className="text-3xl">👨</span>
            <span className="font-bold text-sm">Male</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedGender("Female")}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3
              ${
                selectedGender === "Female"
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border bg-background hover:bg-muted text-muted-foreground"
              }`}
          >
            <span className="text-3xl">👩</span>
            <span className="font-bold text-sm">Female</span>
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            className="w-full font-bold h-11"
            onClick={handleSave}
            disabled={!selectedGender || loading}
          >
            {loading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
