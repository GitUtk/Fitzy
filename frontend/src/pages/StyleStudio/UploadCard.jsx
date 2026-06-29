import React, { useRef, useState } from "react";
import { uploadImage } from "./api";

function UploadCard({
  selectedFile,

  setSelectedFile,

  onUploadSuccess,

  uploadedImage,

  setUploadedImage,
}) {
  const fileInputRef = useRef(null);

//   const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image.");
      return;
    }

    setError("");
    setSuccess("");

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    selectFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];

    selectFile(file);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreview("");
    setUploadedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_black] p-8">

      <div className="mb-8">
        <h1 className="text-5xl font-black text-[#8B5CF6]">
          Style Studio
        </h1>

        <p className="text-gray-600 mt-3 text-lg">
          Upload your outfit and let AI analyze your fashion style.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`
        border-2
        border-dashed
        rounded-3xl
        p-10
        transition-all
        cursor-pointer
        ${
          dragging
            ? "border-[#8B5CF6] bg-purple-50"
            : "border-gray-300"
        }
      `}
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={handleChange}
        />

        {!preview ? (
          <div className="text-center">

            <div className="w-24 h-24 rounded-full bg-[#8B5CF6] border-2 border-black shadow-[4px_4px_0px_black] mx-auto flex items-center justify-center">

              <span className="material-symbols-outlined text-white text-5xl">
                upload
              </span>

            </div>

            <h2 className="mt-8 text-4xl font-black text-[#6D28D9]">
              Drag & Drop
            </h2>

            <p className="mt-2 text-gray-500">
              JPG, PNG, JPEG (Max 10MB)
            </p>

            <button
              onClick={() => fileInputRef.current.click()}
              className="
              mt-8
              bg-[#8B5CF6]
              text-white
              px-8
              py-3
              rounded-2xl
              border-2
              border-black
              shadow-[4px_4px_0px_black]
              hover:translate-y-[2px]
              hover:shadow-none
              transition-all
              font-bold
              "
            >
              Choose File
            </button>

          </div>
        ) : (          <div className="space-y-6">

            <div className="overflow-hidden rounded-3xl border-2 border-black shadow-[6px_6px_0px_black]">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-[550px] object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">

              <button
                onClick={removeImage}
                className="
                bg-white
                text-black
                px-8
                py-3
                rounded-2xl
                border-2
                border-black
                shadow-[4px_4px_0px_black]
                hover:translate-y-[2px]
                hover:shadow-none
                transition-all
                font-bold
                "
              >
                Remove
              </button>

            </div>

          </div>
        )}

      </div>

      {/* {success && (
        <div className="mt-6 rounded-2xl border-2 border-black bg-[#D9FF1F] p-4 shadow-[4px_4px_0px_black]">
          <p className="font-bold text-black">
            {success}
          </p>
        </div>
      )} */}

      {error && (
        <div className="mt-6 rounded-2xl border-2 border-red-600 bg-red-50 p-4">
          <p className="font-semibold text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* {uploadedImage?.secure_url && (
        <div className="mt-8 rounded-3xl border-2 border-black bg-[#F8F6FF] p-6 shadow-[6px_6px_0px_black]">

          <h2 className="text-2xl font-black text-black mb-4">
            Uploaded Successfully
          </h2>

          <img
            src={uploadedImage.secure_url}
            alt="Uploaded"
            className="rounded-2xl border-2 border-black w-full max-h-[500px] object-cover"
          />

        </div>
      )} */}

    </div>
  );
}

export default UploadCard;