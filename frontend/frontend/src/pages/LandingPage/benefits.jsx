function Benefits() {
  const features = [
    {
      title: "Try Before You Buy",
      desc: "See how outfits look on you before placing an order.",
      icon: "👗",
    },
    {
      title: "AI Powered Styling",
      desc: "Get intelligent outfit visualization in seconds.",
      icon: "🤖",
    },
    {
      title: "Shop From Top Brands",
      desc: "Browse styles from Myntra, Amazon, Flipkart and more.",
      icon: "🛍️",
    },
    {
      title: "Reduce Returns",
      desc: "Make better fashion decisions and avoid wrong purchases.",
      icon: "📦",
    },
  ];

  return (
    <section className="px-4 md:px-10 py-20 bg-[#F8F6F2]">

      <div className="text-center mb-16">

        <div className="inline-block px-4 py-2 bg-orange-100 border-2 border-black rounded-xl font-semibold text-orange-600">
          ⭐ Why Choose Fitzy
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-black mt-6">
          Fashion Shopping Reimagined
        </h2>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Experience the future of online fashion with AI-powered
          virtual try-on technology.
        </p>

      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {features.map((feature, index) => (
          <div
            key={index}
            className="
            bg-white
            border-2
            border-black
            rounded-[28px]
            p-8
            shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[3px]
            hover:translate-y-[3px]
            hover:shadow-none
            transition-all
            duration-200
            "
          >

            <div className="text-5xl mb-6">
              {feature.icon}
            </div>

            <h3 className="text-2xl font-black text-black mb-4">
              {feature.title}
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {feature.desc}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Benefits;