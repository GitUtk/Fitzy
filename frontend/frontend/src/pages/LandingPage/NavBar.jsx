function NavBar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        <h1 className="text-3xl font-bold">
          FITZY<span className="text-orange-500"></span>
        </h1>

        <div className="hidden md:flex gap-8 text-gray-300">
          <a href="#" className="hover:text-white">Home</a>
          <a href="#" className="hover:text-white">Explore</a>
          <a href="#" className="hover:text-white">Features</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>

        <div className="flex gap-4 items-center">
          <button className="text-gray-300 hover:text-white">
            Login
          </button>

          <button className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-full font-semibold">
            Sign Up
          </button>
        </div>

      </div>
    </nav>
  );
}

export default NavBar;