// function Feedback() {
//   return (
//     <section className="px-4 md:px-10 py-20 bg-[#F8F6F2]">

//       <div className="text-center mb-12">

//         <div className="inline-block px-4 py-2 bg-orange-100 border-2 border-black rounded-xl font-semibold text-orange-600">
//           💬 Feedback
//         </div>

//         <h2 className="text-4xl md:text-5xl font-black text-black mt-6">
//           Your Feedback Matters
//         </h2>

//         <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
//           Help us improve Fitzy by sharing your thoughts,
//           suggestions and experience.
//         </p>

//       </div>

//       <div
//         className="
//         max-w-3xl
//         mx-auto
//         bg-white
//         border-2
//         border-black
//         rounded-[32px]
//         p-6
//         md:p-10
//         shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
//         "
//       >

//         <div className="space-y-5">

//           <input
//             type="text"
//             placeholder="Your Name"
//             className="
//             w-full
//             bg-white
//             border-2
//             border-black
//             rounded-xl
//             px-4
//             py-3
//             outline-none
//             focus:ring-2
//             focus:ring-orange-400
//             "
//           />

//           <input
//             type="email"
//             placeholder="Your Email"
//             className="
//             w-full
//             bg-white
//             border-2
//             border-black
//             rounded-xl
//             px-4
//             py-3
//             outline-none
//             focus:ring-2
//             focus:ring-orange-400
//             "
//           />

//           <textarea
//             rows="5"
//             placeholder="Your Message"
//             className="
//             w-full
//             bg-white
//             border-2
//             border-black
//             rounded-xl
//             px-4
//             py-3
//             outline-none
//             focus:ring-2
//             focus:ring-orange-400
//             "
//           ></textarea>

//           <button
//             className="
//             w-full
//             bg-orange-500
//             text-white
//             py-3
//             rounded-xl
//             font-semibold
//             border-2
//             border-black
//             shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
//             hover:translate-x-[2px]
//             hover:translate-y-[2px]
//             hover:shadow-none
//             transition-all
//             duration-200
//             "
//           >
//             Send Feedback
//           </button>

//         </div>

//       </div>

//     </section>
//   );
// }

// export default Feedback;
function Feedback() {
  return (
    <section className="px-4 md:px-10 py-20 bg-[#F8F6F2]">

      <div className="text-center mb-12">

        <div className="inline-block px-4 py-2 bg-[#EFE7FF] border-2 border-black rounded-xl font-semibold text-[#8B5CF6]">
          💬 Feedback
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-black mt-6">
          Your Feedback Matters
        </h2>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Help us improve Fitzy by sharing your thoughts,
          suggestions and experience.
        </p>

      </div>

      <div
        className="
        max-w-3xl
        mx-auto
        bg-white
        border-2
        border-black
        rounded-[32px]
        p-6
        md:p-10
        shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
        "
      >

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Your Name"
            className="
            w-full
            bg-white
            border-2
            border-black
            rounded-xl
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-orange-400
            "
          />

          <input
            type="email"
            placeholder="Your Email"
            className="
            w-full
            bg-white
            border-2
            border-black
            rounded-xl
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-orange-400
            "
          />

          <textarea
            rows="5"
            placeholder="Your Message"
            className="
            w-full
            bg-white
            border-2
            border-black
            rounded-xl
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-orange-400
            "
          ></textarea>

          <button
            className="
            w-full
            bg-[#8B5CF6] hover:bg-[#D946EF]
            text-white
            py-3
            rounded-xl
            font-semibold
            border-2
            border-black
            shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[2px]
            hover:translate-y-[2px]
            hover:shadow-none
            transition-all
            duration-200
            "
          >
            Send Feedback
          </button>

        </div>

      </div>

    </section>
  );
}

export default Feedback;