function Hero() {
  return (
    <section className="h-[85vh] flex items-center px-10 lg:px-20">

      <div className="grid lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">

        {/* Left Side */}
        <div>

          <p className="text-orange-400 font-semibold tracking-widest uppercase mb-4">
            AI Fashion Stylist
          </p>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            Discover Your
            <span className="block text-orange-400">
              Perfect Outfit
            </span>
          </h1>

          <p className="text-gray-400 text-lg mt-8 max-w-xl">
            Upload your photo and instantly visualize outfits from
            Myntra, Amazon, Flipkart, Newme and Savana before
            making a purchase.
          </p>

          <div className="flex gap-5 mt-10">

            <button
              className="
              bg-orange-500
              hover:bg-orange-600
              text-white
              px-8
              py-4
              rounded-full
              font-semibold
              transition-all
              duration-300
              hover:scale-105
              "
            >
              Start Styling
            </button>

            <button
              className="
              border
              border-white/20
              px-8
              py-4
              rounded-full
              font-semibold
              hover:bg-white
              hover:text-black
              transition-all
              duration-300
              "
            >
              Explore Looks
            </button>

          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-14">

            <div>
              <h3 className="text-3xl font-bold">50+</h3>
              <p className="text-gray-400">Brands</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">10K+</h3>
              <p className="text-gray-400">Outfits</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">95%</h3>
              <p className="text-gray-400">Accuracy</p>
            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="relative flex justify-center">

          {/* Main Model */}
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c"
            alt="fashion model"
            className="
            w-[500px]
            h-[650px]
            object-cover
            rounded-[40px]
            shadow-2xl
            "
          />
          <div
            className="
            absolute
            bottom-1
            -right-8
            bg-orange-500
            px-6
            py-4
            rounded-2xl
            shadow-xl
            "
          >
            ✨ AI Recommended
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;