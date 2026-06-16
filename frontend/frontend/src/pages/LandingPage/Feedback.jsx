function Feedback() {
  return (
    <section className="px-6 md:px-10 py-24">

      <h2 className="text-4xl md:text-5xl font-bold text-center mb-14">
        Your Feedback Matters
      </h2>

      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-md">

        <div className="space-y-6">

          <input
            type="text"
            placeholder="Your Name"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none"
          />

          <textarea
            rows="5"
            placeholder="Your Message"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none"
          ></textarea>

          <button className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-semibold transition">
            Send Message
          </button>

        </div>

      </div>

    </section>
  );
}

export default Feedback;