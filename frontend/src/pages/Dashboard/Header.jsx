// // import { FaBell } from "react-icons/fa";

// // function Header() {
// //   return (
// //     <div
// //       className="
// //       flex
// //       items-center
// //       justify-between
// //       mb-5
// //       "
// //     >
// //       <div>
// //         <h1 className="text-2xl md:text-3xl font-black">
// //           Dashboard
// //         </h1>

// //         <p className="text-sm text-gray-500 mt-1">
// //           Manage your virtual try-ons and saved looks.
// //         </p>
// //       </div>

// //       <button
// //         className="
// //         relative
// //         w-11
// //         h-11
// //         rounded-full
// //         border-2
// //         border-black
// //         bg-white
// //         flex
// //         items-center
// //         justify-center
// //         shadow-[4px_4px_0px_black]
// //         "
// //       >
// //         <FaBell />

// //         <span
// //           className="
// //           absolute
// //           top-1
// //           right-1
// //           w-2.5
// //           h-2.5
// //           rounded-full
// //           bg-orange-500
// //           "
// //         />
// //       </button>
// //     </div>
// //   );
// // }

// // export default Header;
// import React from "react";

// function Header() {
//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
//       <div className="pointer-events-auto bg-white/90 backdrop-blur-xl rounded-full border-2 border-outline-black flex items-center justify-between px-6 py-2 w-full max-w-5xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
//         <div className="flex items-center gap-4">
//           <span className="font-display-lg text-2xl font-black italic text-[#8B5CF6]">FITZY.</span>
//           <div className="hidden lg:block ml-6">
//             <h2 className="text-xl font-black text-black">Dashboard</h2>
//             <p className="text-sm text-gray-500">Welcome back to your AI stylist.</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="relative hidden sm:block">
//             <input
//               className="bg-white border-2 border-black rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
//               placeholder="Search outfits..."
//               type="text"
//             />
//           </div>
//           <button className="material-symbols-outlined p-2 bg-[#F3F0FF] border-2 border-black rounded-full transition-all hover:bg-surface-container-high">
//             favorite
//           </button>
//           <button className="material-symbols-outlined p-2 bg-[#F3F0FF] border-2 border-black rounded-full transition-all hover:bg-surface-container-high">
//             notifications
//           </button>
//           <div className="w-10 h-10 rounded-full border-2 border-outline-black overflow-hidden bg-primary-fixed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//             <div className="w-full h-full flex items-center justify-center bg-[#CCFF00] text-black font-black">
//               Y
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Header;
import React from "react";

function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/90 backdrop-blur-xl rounded-full border-2 border-outline-black flex items-center justify-between px-6 py-2 w-full max-w-5xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4">
          <span className="font-display-lg text-2xl font-black italic text-[#8B5CF6]">FITZY.</span>
          <div className="hidden lg:block ml-6">
            <h2 className="text-xl font-black text-black">Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome back to your AI stylist.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <input
              className="bg-white border-2 border-black rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              placeholder="Search outfits..."
              type="text"
            />
          </div>
          <button className="material-symbols-outlined p-2 bg-[#F3F0FF] border-2 border-black rounded-full transition-all hover:bg-surface-container-high">
            favorite
          </button>
          <button className="material-symbols-outlined p-2 bg-[#F3F0FF] border-2 border-black rounded-full transition-all hover:bg-surface-container-high">
            notifications
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-outline-black overflow-hidden bg-primary-fixed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-full h-full flex items-center justify-center bg-[#CCFF00] text-black font-black">
              Y
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;