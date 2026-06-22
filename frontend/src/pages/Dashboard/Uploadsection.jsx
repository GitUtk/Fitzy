import { useState, useRef } from "react";
import {
  FaCloudUploadAlt,
  FaMagic,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

function UploadSection({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isMock, setIsMock] = useState(false);
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

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
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
    setError("");
    setSuccess(false);
    setIsMock(false);

    const objectUrl = URL.createObjectURL(file);
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

  return (
    <div
      className="
      bg-white
      border-2
      border-black
      rounded-2xl
      p-5
      shadow-[5px_5px_0px_black]
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">Virtual Try-On</h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload a photo to generate outfit previews.
          </p>
        </div>

        <div
          className="
          w-10
          h-10
          bg-orange-100
          border-2
          border-black
          rounded-xl
          flex
          items-center
          justify-center
          "
        >
          <FaMagic />
        </div>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`
        mt-5
        border-2
        border-dashed
        rounded-2xl
        p-8
        text-center
        cursor-pointer
        transition-all
        relative
        ${dragActive
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300 bg-[#FFF7ED]"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {preview ? (
          <div className="relative group max-w-xs mx-auto">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl border-2 border-black"
            />
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-xl">
                <FaSpinner className="animate-spin text-orange-500 text-3xl" />
                <span className="text-sm font-semibold mt-2 text-black">
                  Uploading...
                </span>
              </div>
            )}
            {!loading && success && (
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full border border-black shadow-[2px_2px_0px_black]">
                <FaCheckCircle className="text-sm" />
              </div>
            )}
          </div>
        ) : (
          <>
            <div
              className="
              w-16
              h-16
              mx-auto
              rounded-full
              bg-white
              border-2
              border-black
              flex
              items-center
              justify-center
              text-2xl
              "
            >
              <FaCloudUploadAlt />
            </div>

            <h3 className="font-bold text-lg mt-4">
              Drag & Drop or Choose File
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG, JPEG (Max 10MB)
            </p>

            <button
              type="button"
              className="
              mt-5
              bg-orange-500
              text-white
              px-6
              py-2.5
              rounded-xl
              border-2
              border-black
              font-semibold
              shadow-[3px_3px_0px_black]
              hover:translate-x-[1px]
              hover:translate-y-[1px]
              hover:shadow-none
              transition-all
              "
            >
              Choose File
            </button>
          </>
        )}
      </div>

      {isMock && (
        <div className="mt-3 flex items-center gap-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 p-2.5 rounded-xl">
          <FaExclamationCircle className="shrink-0 text-base" />
          <span>
            <strong>Demo Mode:</strong> Running with default credentials. A sample fashion image is saved instead. Add your credentials in `.env` to enable full custom upload.
          </span>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm bg-red-100 border border-red-400 text-red-700 p-3 rounded-xl">
          <FaExclamationCircle />
          <span>{error}</span>
        </div>
      )}

      {success && !isMock && (
        <div className="mt-3 flex items-center gap-2 text-sm bg-green-100 border border-green-400 text-green-700 p-3 rounded-xl">
          <FaCheckCircle />
          <span>Image uploaded and saved to profile successfully!</span>
        </div>
      )}
    </div>
  );
}

export default UploadSection;