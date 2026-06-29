function SimilarProducts({ products, loading, error }) {

  return (
    <div className="mt-8 bg-white border-2 border-black rounded-3xl p-8 shadow-[8px_8px_0px_black]">

      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-3xl font-black text-black">
            Similar Outfits
          </h2>

          <p className="text-gray-500 mt-2">
            AI found matching products for your outfit.
          </p>
        </div>

      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-400 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="border-2 border-dashed rounded-2xl p-12 text-center text-gray-500">
          Finding similar outfits...
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="border-2 border-dashed rounded-2xl p-12 text-center text-gray-400">
          Upload an outfit to automatically discover similar products.
        </div>
      )}

      {products.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {products.map((item, index) => (
            <div
              key={index}
              className="bg-[#F8F6FF] border-2 border-black rounded-2xl overflow-hidden shadow-[5px_5px_0px_black]"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-72 object-cover"
              />

              <div className="p-5">

                <h3 className="font-black text-lg text-black">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  {item.category}
                </p>

                <div className="flex justify-between mt-4 text-sm">

                  <span className="font-semibold">
                    ⭐ {item.rating}
                  </span>

                  <span className="font-bold text-[#7C3AED]">
                    ₹{item.price}
                  </span>

                </div>

                <a
                  href={item.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                  mt-5
                  block
                  text-center
                  bg-[#8B5CF6]
                  text-white
                  py-3
                  rounded-xl
                  border-2
                  border-black
                  font-bold
                  shadow-[4px_4px_0px_black]
                  hover:translate-y-[2px]
                  hover:shadow-none
                  transition-all
                  "
                >
                  View Product
                </a>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default SimilarProducts;