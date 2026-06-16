function About() {
  return (
    <section className="px-6 md:px-10 py-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About Fitzy
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed">
            Fitzy is an AI-powered fashion styling platform that helps
            users visualize clothing on themselves before purchasing.
            Simply upload a photo and explore outfits from popular
            fashion brands like Myntra, Amazon, Flipkart, Newme and
            Savana.
          </p>

          <p className="text-gray-400 text-lg leading-relaxed mt-6">
            Our goal is to make online fashion shopping smarter,
            easier and more confident by reducing uncertainty and
            minimizing returns.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-md">
          <h3 className="text-3xl font-bold mb-6 text-orange-400">
            Our Vision
          </h3>

          <p className="text-gray-300 leading-relaxed">
            To revolutionize online fashion shopping using AI-driven
            virtual try-on technology and personalized styling
            experiences.
          </p>
        </div>

      </div>
    </section>
  );
}

export default About;