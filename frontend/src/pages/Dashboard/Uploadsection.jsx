import React, { useState, useRef } from "react";
import {
  FaMagic,
  FaCloudUploadAlt,
  FaSpinner,
  FaCheckCircle,
  FaImage,
  FaExclamationCircle,
} from "react-icons/fa";
const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

const UploadSection = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, JPEG)");
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

    // const objectUrl = URL.createObjectURL(file);
    // setPreview(objectUrl);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const chooseFile = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-[#F7F7FB] text-black border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_black]">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-5xl font-black tracking-tight text-[#6D28D9]">
            Virtual Try-On
          </h2>
          <p className="text-gray-600 mt-3 text-lg">
            Upload a photo to generate outfit previews.
          </p>
        </div>

        {/* <button className="w-16 h-16 rounded-2xl border-2 border-black bg-[#8B5CF6] text-white flex items-center justify-center text-3xl shadow-[4px_4px_0px_black]">
          <FaMagic />
        </button> */}
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={chooseFile}
        className={`mt-8 rounded-[28px] border-2 border-dashed transition-all cursor-pointer overflow-hidden bg-white border-gray-300 ${
          dragActive
            ? "border-[#8B5CF6] bg-[#F3EEFF]"
            : ""
        }`}
      >
        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={handleChange}
        />

        {preview ? (
          <div className="relative rounded-[24px] overflow-hidden border border-black">
            <img
              src={preview}
              alt="preview"
              className="w-full h-[420px] object-cover"
            />

            {loading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                <FaSpinner className="animate-spin text-5xl text-[#8B5CF6]" />
                <p className="text-black mt-5 font-bold">
                  Generating AI Outfit...
                </p>
              </div>
            )}

          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center px-8">
            <div className="w-24 h-24 rounded-full border-2 border-black bg-[#8B5CF6] text-white flex items-center justify-center text-5xl">
              <FaCloudUploadAlt />
            </div>

            <h3 className="text-[#6D28D9] text-3xl font-black mt-8">
              Drag & Drop or Choose File
            </h3>

            <p className="text-gray-500 mt-3 text-lg">
              JPG, PNG, JPEG (Max 10MB)
            </p>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); chooseFile(); }}
              className="mt-8 bg-[#8B5CF6] text-white px-10 py-4 rounded-2xl border-2 border-black font-black shadow-[5px_5px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Choose File
            </button>
          </div>
        )}
      </div>

      {success && (
        <div className="mt-6 bg-white border border-[#8B5CF6] rounded-2xl p-4 flex items-center gap-3 text-black">
          <FaCheckCircle />
          <span>
            Image uploaded successfully.
          </span>
        </div>
      )}

      {isMock && (
        <div className="mt-6 bg-white border border-yellow-500 rounded-2xl p-4 flex items-center gap-3 text-black">
          <FaImage />
          <span>
            Running in demo mode.
          </span>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-white border border-red-500 rounded-2xl p-4 flex items-center gap-3 text-black">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}

    </div>
  );
}

export default UploadSection;