function About() {
  return (
    <section className="px-4 md:px-10 py-20 bg-[#F8F6F2]">

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <div>

          
          <h2 className="text-4xl md:text-5xl font-black text-black mb-6">
            About Fitzy
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed">
            Fitzy is an AI-powered fashion styling platform that helps
            users visualize clothing on themselves before purchasing.
            Simply upload a photo and explore outfits from Myntra,
            Amazon, Flipkart, Newme and Savana.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed mt-6">
            Our goal is to make online fashion shopping smarter,
            easier and more confident by reducing uncertainty and
            minimizing returns.
          </p>

        </div>

        <div
          className="
          bg-white
          border-2
          border-black
          rounded-[32px]
          p-8
          md:p-10
          shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
          "
        >

          <h3 className="text-3xl font-black text-orange-500 mb-6">
            Our Vision
          </h3>

          <p className="text-gray-700 text-lg leading-relaxed">
            To revolutionize online fashion shopping through AI-powered
            virtual try-ons, helping people discover confidence before
            checkout and making fashion decisions easier than ever.
          </p>

        </div>

      </div>

    </section>
  );
}

export default About;