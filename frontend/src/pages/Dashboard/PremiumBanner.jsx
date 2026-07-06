// //  import { FaCrown } from "react-icons/fa";

// // function PremiumBanner() {
// //   return (
// //     <div
// //       className="
// //       mt-5
// //       bg-[#FFF7ED]
// //       border-2
// //       border-black
// //       rounded-2xl
// //       p-5
// //       shadow-[5px_5px_0px_black]
// //       flex
// //       flex-col
// //       md:flex-row
// //       md:items-center
// //       md:justify-between
// //       gap-4
// //       "
// //     >
// //       <div className="flex items-center gap-4">

// //         <div
// //           className="
// //           w-12
// //           h-12
// //           rounded-xl
// //           bg-white
// //           border-2
// //           border-black
// //           flex
// //           items-center
// //           justify-center
// //           text-orange-500
// //           "
// //         >
// //           <FaCrown />
// //         </div>

// //         <div>
// //           <h2 className="text-lg md:text-xl font-black">
// //             Unlock Premium Features
// //           </h2>

// //           <p className="text-sm text-gray-600 mt-1">
// //             Unlimited try-ons, advanced AI styling and early access to new features.
// //           </p>
// //         </div>

// //       </div>

// //       <button
// //         className="
// //         bg-orange-500
// //         text-white
// //         px-5
// //         py-2.5
// //         rounded-xl
// //         border-2
// //         border-black
// //         font-semibold
// //         shadow-[3px_3px_0px_black]
// //         hover:translate-x-[1px]
// //         hover:translate-y-[1px]
// //         hover:shadow-none
// //         transition-all
// //         "
// //       >
// //         Upgrade Now
// //       </button>

// //     </div>
// //   );
// // }

// // export default PremiumBanner;
// import { FaCrown } from "react-icons/fa";

// function PremiumBanner() {
//   return (
//     <div
//       className="
//       mt-5
//       bg-zinc-50
//       border-2
//       border-black
//       rounded-2xl
//       p-5
//       shadow-[5px_5px_0px_black]
//       flex
//       flex-col
//       md:flex-row
//       md:items-center
//       md:justify-between
//       gap-4
//       "
//     >
//       <div className="flex items-center gap-4">

//         <div
//           className="
//           w-12
//           h-12
//           rounded-xl
//           bg-white
//           border-2
//           border-black
//           flex
//           items-center
//           justify-center
//           text-black
//           "
//         >
//           <FaCrown />
//         </div>

//         <div>
//           <h2 className="text-lg md:text-xl font-black">
//             Unlock Premium Features
//           </h2>

//           <p className="text-sm text-gray-600 mt-1">
//             Unlimited try-ons, advanced AI styling and early access to new features.
//           </p>
//         </div>

//       </div>

//       <button
//         className="
//         bg-black
//         text-white
//         px-5
//         py-2.5
//         rounded-xl
//         border-2
//         border-black
//         font-semibold
//         shadow-[3px_3px_0px_rgba(100,100,100,0.5)]
//         hover:translate-x-[1px]
//         hover:translate-y-[1px]
//         hover:shadow-none
//         transition-all
//         active:scale-95
//         "
//       >
//         Upgrade Now
//       </button>

//     </div>
//   );
// }

// export default PremiumBanner;
import { FaCrown } from "react-icons/fa";

function PremiumBanner() {
  return (
    <div
      className="
      mt-5
      bg-zinc-50
      border-2
      border-black
      rounded-2xl
      p-5
      shadow-[5px_5px_0px_black]
      flex
      flex-col
      md:flex-row
      md:items-center
      md:justify-between
      gap-4
      "
    >
      <div className="flex items-center gap-4">

        <div
          className="
          w-12
          h-12
          rounded-xl
          bg-white
          border-2
          border-black
          flex
          items-center
          justify-center
          text-black
          "
        >
          <FaCrown />
        </div>

        <div>
          <h2 className="text-lg md:text-xl font-black">
            Unlock Premium Features
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            Unlimited try-ons, advanced AI styling and early access to new features.
          </p>
        </div>

      </div>

      <button
        className="
        bg-black
        text-white
        px-5
        py-2.5
        rounded-xl
        border-2
        border-black
        font-semibold
        shadow-[3px_3px_0px_rgba(100,100,100,0.5)]
        hover:translate-x-[1px]
        hover:translate-y-[1px]
        hover:shadow-none
        transition-all
        active:scale-95
        "
      >
        Upgrade Now
      </button>

    </div>
  );
}

export default PremiumBanner;