function SupportedStores() {
  const stores = [
    "Myntra",
    "Amazon",
    "Flipkart",
    "Newme",
    "Savana",
  ];

  return (
    <section className="px-6 md:px-10 py-24 relative z-20">
      <h2 className="text-5xl font-bold text-center mb-14">
        Supported Stores
      </h2>

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">        {stores.map((store) => (
          <div
            key={store}
            className="
              bg-white/5
              backdrop-blur-md
              border
              border-white/10
              rounded-2xl
              py-8
              text-center
              hover:bg-white/10
              hover:border-violet-500/50
              hover:-translate-y-2
              hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]
              transition-all
              duration-300
              cursor-pointer
              font-semibold
              text-lg
            "
          >
            {store}
          </div>
        ))}
      </div>
    </section>
  );
}

export default SupportedStores;