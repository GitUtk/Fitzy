function Contact() {
  return (
    <section className="px-6 md:px-10 py-24 border-t border-white/10">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">

        {/* Left Side */}
        <div>
          <h2 className="text-4xl font-bold mb-6">
            Contact Us
          </h2>

          <p className="text-xl mb-4">
            📧 info@fitzy.in
          </p>

          <p className="text-gray-400 text-lg">
            We'd love to hear from you!
          </p>

          <p className="text-gray-400 text-lg">
            Reach out with your queries or feedback.
          </p>
        </div>

        {/* Right Side */}
        <div>
          <h3 className="text-3xl font-semibold mb-6">
            Get in touch...
          </h3>

          <div className="flex gap-6 text-5xl">

            <a href="#">
              📷
            </a>

            <a href="#">
              👍
            </a>

            <a href="#">
              💼
            </a>

            <a href="#">
              ✖️
            </a>

          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center mt-20">

        <p className="text-gray-400 text-lg">
          Copyright © 2026 Fitzy - All Rights Reserved.
        </p>

        <p className="text-gray-500 mt-4">
          Admin
        </p>

      </div>

    </section>
  );
}

export default Contact;