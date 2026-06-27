function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center px-4 md:px-10 lg:px-20 py-16 bg-[#F8F6F2]">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Content */}
        <div className="text-center lg:text-left">

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

        </div>

        {/* Right Video */}
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
            <video
              autoPlay
              loop
              muted
              playsInline
              className="
              w-full
              max-w-[500px]
              h-[350px]
              sm:h-[500px]
              lg:h-[550px]
              object-cover
              rounded-[24px]
              "
            >
              <source
                src="/fitzy-fashion.mp4"
                type="video/mp4"
              />
            </video>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;