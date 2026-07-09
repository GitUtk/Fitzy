import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadImage } from "./api";

function UploadCard({
  selectedFile,
  setSelectedFile,
  onUploadSuccess,
  uploadedImage,
  setUploadedImage,
}) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => selectFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    selectFile(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreview("");
    setUploadedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError("");

    try {
      const data = await uploadImage(selectedFile);
      onUploadSuccess?.(data);
      setUploadedImage(data);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold">Upload outfit</CardTitle>
        <p className="text-sm text-muted-foreground">
          Add a photo to analyze your look and discover similar items.
        </p>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`rounded-2xl border border-dashed p-6 sm:p-8 transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border bg-muted/20"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleChange}
          />

          {!preview ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-muted-foreground">
                Drop image here
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">Choose a photo from your device</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, JPEG up to 10MB</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Browse files
                </Button>
                <Button type="button" onClick={handleUpload} disabled={!selectedFile || loading}>
                  {loading ? "Uploading..." : "Upload image"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-border bg-background">
                <img src={preview} alt="Preview" className="h-auto max-h-[520px] w-full object-contain" />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={removeImage}>
                  Remove
                </Button>
                <Button type="button" onClick={handleUpload} disabled={loading}>
                  {loading ? "Uploading..." : "Upload image"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {uploadedImage?.secure_url && (
          <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            Upload saved successfully.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UploadCard;
