function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center px-4 md:px-10 lg:px-20 py-16 bg-[#F8F6F2]">

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Side */}
        <div className="text-center lg:text-left">

          <div className="inline-block px-4 py-2 bg-orange-100 border-2 border-black rounded-xl font-semibold text-orange-600 mb-6">
            ✨ AI Fashion Stylist
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-black">
            Try Clothes
            <span className="block text-orange-500">
              Before You Buy
            </span>
          </h1>

          <p className="text-gray-600 text-lg mt-8 max-w-xl mx-auto lg:mx-0">
            Upload your photo and instantly preview outfits from
            Myntra, Amazon, Flipkart, Newme and Savana using
            AI-powered virtual try-on technology.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-5 mt-10">

            <button
              className="
              bg-orange-500
              text-white
              px-8
              py-4
              rounded-xl
              font-semibold
              border-2
              border-black
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[3px]
              hover:translate-y-[3px]
              hover:shadow-none
              transition-all
              duration-200
              "
            >
              Start Styling
            </button>

            <button
              className="
              bg-white
              text-black
              px-8
              py-4
              rounded-xl
              font-semibold
              border-2
              border-black
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[3px]
              hover:translate-y-[3px]
              hover:shadow-none
              transition-all
              duration-200
              "
            >
              Explore Looks
            </button>

          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-14">

            <div className="bg-white border-2 border-black rounded-2xl px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-3xl font-black text-black">50+</h3>
              <p className="text-gray-600">Brands</p>
            </div>

            <div className="bg-white border-2 border-black rounded-2xl px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-3xl font-black text-black">10K+</h3>
              <p className="text-gray-600">Outfits</p>
            </div>

            <div className="bg-white border-2 border-black rounded-2xl px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-3xl font-black text-black">95%</h3>
              <p className="text-gray-600">Accuracy</p>
            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="relative flex justify-center">

          <div
            className="
            bg-white
            border-2
            border-black
            rounded-[32px]
            p-3
            shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
            "
          >
            <img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
              alt="fashion model"
              className="
              w-full
              max-w-[500px]
              h-[350px]
              sm:h-[500px]
              lg:h-[550px]
              object-cover
              rounded-[24px]
              "
            />
          </div>

          <div
            className="
            absolute
            bottom-4
            right-0
            bg-orange-500
            text-white
            border-2
            border-black
            px-5
            py-3
            rounded-xl
            font-semibold
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
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