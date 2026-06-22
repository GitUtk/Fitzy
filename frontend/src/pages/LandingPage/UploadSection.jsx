import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function UploadSection() {
  const navigate = useNavigate();

  return (
    <section className="px-4 md:px-10 py-20 bg-[#F8F6F2]">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">

          <div className="inline-block px-4 py-2 bg-orange-100 border-2 border-black rounded-xl font-semibold text-orange-600">
            AI Fashion Preview
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-black mt-6">
            Upload Your Photo
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-base md:text-lg">
            Upload a clear image and instantly visualize outfits from
            Myntra, Amazon, Flipkart, Newme and Savana on yourself.
          </p>

        </div>

        <div
          onClick={() => navigate("/register")}
          className="
          max-w-3xl
          mx-auto
          bg-white
          border-2
          border-black
          rounded-[32px]
          p-8
          md:p-12
          text-center
          shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
          cursor-pointer
          hover:scale-[1.01]
          transition-transform
          "
        >

          <div className="text-5xl md:text-6xl mb-5 text-orange-500">
            <FontAwesomeIcon icon={faCloudArrowUp} />
          </div>

          <h3 className="text-2xl font-bold text-black mb-3">
            Drag & Drop your image
          </h3>

          <p className="text-gray-600 mb-8">
            JPG, PNG, JPEG up to 10MB
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/register");
            }}
            className="
            bg-orange-500
            text-white
            px-8
            py-3
            rounded-xl
            font-semibold
            border-2
            border-black
            shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[2px]
            hover:translate-y-[2px]
            hover:shadow-none
            transition-all
            duration-200
            "
          >
            Choose File
          </button>

        </div>

      </div>

    </section>
  );
}

export default UploadSection;