function SupportedStores() {
  const stores = [
    "Myntra",
    "Amazon",
    "Flipkart",
    "Newme",
    "Savana",
  ];

  return (
    <section className="px-4 md:px-10 py-20 bg-[#F8F6F2]">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">

          <div className="inline-block px-4 py-2 bg-orange-100 border-2 border-black rounded-xl font-semibold text-orange-600">
            Our Partners
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-black mt-6">
            Supported Stores
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore outfits from India's most popular fashion and
            lifestyle platforms in one place.
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

          {stores.map((store) => (
            <div
              key={store}
              className="
              bg-white
              border-2
              border-black
              rounded-2xl
              py-8
              text-center
              font-bold
              text-lg
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[2px]
              hover:translate-y-[2px]
              hover:shadow-none
              transition-all
              duration-200
              cursor-pointer
              "
            >
              {store}
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default SupportedStores;