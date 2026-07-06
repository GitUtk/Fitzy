// import { Link } from "react-router-dom";

// function NavBar() {
//   return (
//     <nav className="sticky top-0 z-50 bg-[#F8F6F2]/90 backdrop-blur-md border-b border-black/10">

//       <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">

//         <Link to="/">
//           <h1 className="text-2xl md:text-3xl font-bold text-black cursor-pointer">
//             FITZY
//             <span className="text-orange-500">.</span>
//           </h1>
//         </Link>

//         <div className="hidden lg:flex gap-8 text-gray-700 font-medium">

//           <a href="#" className="hover:text-orange-500 transition-colors duration-300">
//             Home
//           </a>

//           <a href="#" className="hover:text-orange-500 transition-colors duration-300">
//             Explore
//           </a>

//           <a href="#" className="hover:text-orange-500 transition-colors duration-300">
//             Features
//           </a>

//           <a href="#" className="hover:text-orange-500 transition-colors duration-300">
//             Contact
//           </a>

//         </div>

//         <div className="flex items-center gap-3">

//           <Link to="/login">
//             <button
//               className="
//               text-black
//               font-medium
//               px-4
//               py-2
//               rounded-xl
//               hover:bg-black/5
//               transition
//               "
//             >
//               Login
//             </button>
//           </Link>

//           <Link to="/register">
//             <button
//               className="
//               bg-orange-500
//               text-white
//               px-5
//               py-2.5
//               rounded-xl
//               font-semibold
//               border-2
//               border-black
//               shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
//               hover:translate-x-[2px]
//               hover:translate-y-[2px]
//               hover:shadow-none
//               transition-all
//               duration-200
//               "
//             >
//               Sign Up
//             </button>
//           </Link>

//         </div>

//       </div>

//     </nav>
//   );
// }

// export default NavBar;
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#F8F6F2]/90 backdrop-blur-md border-b border-black/10">

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">

        <Link to="/">
          <h1 className="text-2xl md:text-3xl font-bold text-black cursor-pointer">
            FITZY
            <span className="text-[#8B5CF6]">.</span>
          </h1>
        </Link>

        <div className="hidden lg:flex gap-8 text-gray-700 font-medium">

          <a href="#" className="hover:text-[#8B5CF6] transition-colors duration-300">
            Home
          </a>

          <a href="#" className="hover:text-[#8B5CF6] transition-colors duration-300">
            Explore
          </a>

          <a href="#" className="hover:text-[#8B5CF6] transition-colors duration-300">
            Features
          </a>

          <a href="#" className="hover:text-[#8B5CF6] transition-colors duration-300">
            Contact
          </a>

        </div>

        <div className="flex items-center gap-3">

          <Link to="/login">
            <button
              className="
              text-black
              font-medium
              px-4
              py-2
              rounded-xl
              hover:bg-black/5
              transition
              "
            >
              Login
            </button>
          </Link>

          <Link to="/register">
            <button
              className="
              bg-[#8B5CF6] hover:bg-[#D946EF]
              text-white
              px-5
              py-2.5
              rounded-xl
              font-semibold
              border-2
              border-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[2px]
              hover:translate-y-[2px]
              hover:shadow-none
              transition-all
              duration-200
              "
            >
              Sign Up
            </button>
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default NavBar;