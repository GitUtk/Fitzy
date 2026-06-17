function BrandTagline() {
  return (
    <section className="py-16 px-4">

      <div className="max-w-3xl mx-auto relative text-center py-12">

        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-orange-500"></div>

        <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-orange-500"></div>

        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-orange-500"></div>

        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-orange-500"></div>

        <h2 className="text-2xl md:text-3xl font-black leading-tight">
          Fashion Should Feel{" "}
          <span className="text-orange-500">
            Confident Before Checkout.
          </span>
        </h2>

        <p className="mt-4 text-gray-500 text-sm md:text-lg">
          Fitzy helps shoppers visualize outfits on themselves before purchasing.
        </p>

      </div>

    </section>
  );
}

export default BrandTagline;