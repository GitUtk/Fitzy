function UploadSection() {
  return (
    <section className="px-10 py-24">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14">
          <p className="text-violet-400 font-medium tracking-widest uppercase">
            AI Fashion Preview
          </p>

          <h2 className="text-5xl font-bold mt-4">
            Upload Your Photo
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
            Upload a clear image and instantly visualize outfits from
            Myntra, Amazon, Flipkart, Newme and Savana on yourself.
          </p>
        </div>

        <div
          className="
            max-w-4xl
            mx-auto
            p-20
            rounded-3xl
            border
            border-violet-500/30
            bg-white/5
            backdrop-blur-lg
            text-center
            hover:border-violet-500
            transition-all
            duration-300
            hover:scale-[1.02]
          "
        >
          <div className="text-7xl mb-6">
            📸
          </div>

          <h3 className="text-2xl font-semibold mb-4">
            Drag & Drop your image
          </h3>

          <p className="text-gray-400 mb-8">
            JPG, PNG, JPEG up to 10MB
          </p>

          <button
            className="
              bg-violet-600
              hover:bg-violet-700
              px-8
              py-4
              rounded-full
              font-semibold
              transition-all
              duration-300
              hover:scale-105
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