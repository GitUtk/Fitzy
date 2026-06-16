function Benefits() {
  const benefits = [
    {
      title: "Try Before You Buy",
      desc: "Visualize outfits before making a purchase.",
      icon: "🛍️",
    },
    {
      title: "Instant Preview",
      desc: "See how clothes look on you in seconds.",
      icon: "⚡",
    },
    {
      title: "Save Money",
      desc: "Reduce returns and avoid wrong purchases.",
      icon: "💸",
    },
    {
      title: "AI Powered",
      desc: "Advanced AI fashion visualization technology.",
      icon: "🤖",
    },
  ];

  return (
    <section className="px-6 md:px-10 py-24">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-14">
        Why Choose Fitzy?
      </h2>

      <div className="grid md:grid-cols-4 gap-6">
        {benefits.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:border-orange-500/50 transition-all duration-300"
          >
            <div className="text-5xl mb-4">{item.icon}</div>

            <h3 className="text-xl font-semibold mb-3">
              {item.title}
            </h3>

            <p className="text-gray-400">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Benefits;