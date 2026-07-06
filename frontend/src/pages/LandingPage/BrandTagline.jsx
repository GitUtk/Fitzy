// function BrandTagline() {
//   return (
//     <section className="py-16 px-4">

//       <div className="max-w-3xl mx-auto relative text-center py-12">

//         <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-orange-500"></div>

//         <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-orange-500"></div>

//         <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-orange-500"></div>

//         <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-orange-500"></div>

//         <h2 className="text-2xl md:text-3xl font-black leading-tight">
//           Fashion Should Feel{" "}
//           <span className="text-orange-500">
//             Confident Before Checkout.
//           </span>
//         </h2>

//         <p className="mt-4 text-gray-500 text-sm md:text-lg">
//           Fitzy helps shoppers visualize outfits on themselves before purchasing.
//         </p>

//       </div>

//     </section>
//   );
// }

// export default BrandTagline;
function BrandTagline() {
  return (
    <section className="bg-[#F8F6F2] overflow-hidden border-t-2 border-black pt-20 pb-10 flex flex-col items-center justify-center">
      <div className="w-full flex justify-center items-center">
        <h1 
          className="font-black italic tracking-tighter text-center select-none w-full"
          style={{
            fontSize: "clamp(6rem, 25vw, 25rem)",
            lineHeight: "0.8",
            color: "#EFE7FF", // Very light purple, subtle against the #F8F6F2 background
            textShadow: "0px 0px 30px rgba(139, 92, 246, 0.2)", // Subtle neon purple glow
          }}
        >
          FITZY<span className="text-[#8B5CF6]/30">.</span>
        </h1>
      </div>
      <div className="mt-10 text-gray-400 text-sm font-bold tracking-widest uppercase">
        © {new Date().getFullYear()} Fitzy AI Styling
      </div>
    </section>
  );
}

export default BrandTagline;