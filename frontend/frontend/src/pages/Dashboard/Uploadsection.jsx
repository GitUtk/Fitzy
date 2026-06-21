import {
  FaCloudUploadAlt,
  FaMagic,
} from "react-icons/fa";

function UploadSection() {
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
          <h2 className="text-xl font-black">
            Virtual Try-On
          </h2>

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
        className="
        mt-5
        border-2
        border-dashed
        border-gray-300
        rounded-2xl
        p-8
        text-center
        bg-[#FFF7ED]
        "
      >
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
          Upload Your Photo
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          JPG, PNG, JPEG (Max 10MB)
        </p>

        <button
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
      </div>
    </div>
  );
}

export default UploadSection;