// import { FaImages, FaSpinner, FaCalendarAlt } from "react-icons/fa";

// function RecentLooks({ looks = [], loading = false }) {
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch (e) {
//       return dateString;
//     }
//   };

//   return (
//     <div
//       className="
//       bg-white
//       border-2
//       border-black
//       rounded-2xl
//       p-5
//       shadow-[5px_5px_0px_black]
//       flex
//       flex-col
//       h-[400px]
//       "
//     >
//       <div>
//         <h2 className="text-xl font-black">Recent Looks</h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Your uploaded and generated outfits will appear here.
//         </p>
//       </div>

//       <div className="mt-4 flex-1 overflow-y-auto pr-1">
//         {loading && looks.length === 0 ? (
//           <div className="h-full flex flex-col items-center justify-center py-10">
//             <FaSpinner className="animate-spin text-orange-500 text-3xl" />
//             <p className="text-sm text-gray-500 mt-2 font-medium">
//               Loading looks...
//             </p>
//           </div>
//         ) : looks.length === 0 ? (
//           <div
//             className="
//             h-[230px]
//             border-2
//             border-dashed
//             border-gray-300
//             rounded-xl
//             p-6
//             text-center
//             flex
//             flex-col
//             items-center
//             justify-center
//             bg-gray-50/50
//             "
//           >
//             <FaImages className="text-4xl text-gray-300" />
//             <h3 className="mt-3 font-bold text-gray-700">No Looks Yet</h3>
//             <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
//               Upload a fashion photo to see it in your history.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             {looks.map((look) => (
//               <div
//                 key={look.id}
//                 className="
//                 group
//                 relative
//                 bg-white
//                 border-2
//                 border-black
//                 rounded-xl
//                 overflow-hidden
//                 shadow-[2px_2px_0px_black]
//                 hover:shadow-[4px_4px_0px_black]
//                 hover:-translate-x-[1px]
//                 hover:-translate-y-[1px]
//                 transition-all
//                 duration-200
//                 "
//               >
//                 <div className="aspect-[3/4] overflow-hidden bg-gray-100">
//                   <img
//                     src={look.image_url}
//                     alt="Look"
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     loading="lazy"
//                   />
//                 </div>
                
//                 <div className="p-2 border-t-2 border-black bg-white flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold">
//                   <FaCalendarAlt className="shrink-0 text-orange-500" />
//                   <span className="truncate">{formatDate(look.created_at)}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default RecentLooks;
import React, { useEffect, useState } from "react";
import {
  FaSpinner,
  FaHeart,
  FaRegHeart,
  FaDownload,
  FaShareAlt,
} from "react-icons/fa";

function RecentLooks({
  looks = [],
  loading = false,
  limit,
  title = "Recent Try Ons",
  subtitle = "Your latest AI generated outfits",
}) {
  const [savedLooks, setSavedLooks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("savedLooks") || "[]"
    );

    setSavedLooks(saved);
  }, []);

  const toggleSave = (id) => {
    let updated = [];

    if (savedLooks.includes(id)) {
      updated = savedLooks.filter(
        (item) => item !== id
      );
    } else {
      updated = [...savedLooks, id];
    }

    setSavedLooks(updated);

    localStorage.setItem(
      "savedLooks",
      JSON.stringify(updated)
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

 const displayedLooks = limit ? looks.slice(0, limit) : looks;

  if (loading && looks.length === 0) {
    return (
      <div className="w-full">

        <div className="bg-[#F8F6FF] border-2 border-black rounded-[28px] h-[300px] flex flex-col justify-center items-center shadow-[8px_8px_0px_black]">

          <FaSpinner className="animate-spin text-4xl text-[#7C3AED]" />

          <p className="mt-5 text-gray-600 font-semibold">
            Loading your AI outfits...
          </p>

        </div>

      </div>
    );
  }

  if (!loading && displayedLooks.length === 0) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900">
  {title}
</h2>

<p className="mt-1 text-base text-gray-600">
  {subtitle}
</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {[1,2,3].map((item) => (
          <div
            key={item}
            className="bg-[#F8F6FF] rounded-[26px] border-2 border-dashed border-gray-300 h-[340px] flex flex-col items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#CCFF00] flex items-center justify-center text-3xl">
              ✨
            </div>

            <h3 className="mt-5 font-black text-xl">
              No Look Yet
            </h3>

            <p className="mt-2 text-sm text-gray-500 text-center px-6">
              Generate your first AI outfit
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}

  return (
    <section className="mt-10">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-3xl font-black text-gray-900">
  {title}
</h2>

<p className="mt-1 text-base text-gray-600">
  {subtitle}
</p>

        </div>

        

      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-7">

        {displayedLooks.map((look, index) => {
          const saved = savedLooks.includes(look.id);

          return (
            <div
              key={look.id}
              className="
              group
              bg-[#F8F6FF]
              rounded-[26px]
              border-2
              border-black
              overflow-hidden
              shadow-[8px_8px_0px_black]
              hover:translate-x-[2px]
              hover:translate-y-[2px]
              hover:shadow-none
              transition-all
              "
            >

              <div className="relative">
                              <img
                src={look.image_url}
                alt={`Look ${index + 1}`}
                className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition duration-500"
              />

              

              <button
                onClick={() => toggleSave(look.id)}
                className="
                absolute
                top-4
                right-4
                w-11
                h-11
                rounded-full
                bg-white
                border-2
                border-black
                flex
                items-center
                justify-center
                shadow-[3px_3px_0px_black]
                hover:scale-110
                transition
                "
              >
                {saved ? (
  <FaHeart className="text-[#7C3AED] text-xl" />
) : (
  <FaRegHeart className="text-black text-xl" />
)}
              </button>

            </div>

            <div className="p-5">

              <div className="flex justify-between items-center">

                <h3 className="font-black text-lg">
                  Look #{displayedLooks.length - index}
                </h3>

                <span className="text-xs text-gray-500">
                  {formatDate(look.created_at)}
                </span>

              </div>

              <p className="text-gray-500 text-sm mt-2">
                Generated using Fitzy AI Virtual Try-On
              </p>

              <div className="flex gap-3 mt-5">

                <button
                  className="
                  flex-1
                  bg-[#7C3AED]
                  text-white
                  border-2
                  border-black
                  rounded-xl
                  py-2.5
                  font-bold
                  shadow-[3px_3px_0px_black]
                  hover:translate-x-[2px]
                  hover:translate-y-[2px]
                  hover:shadow-none
                  transition-all
                  "
                >
                  Try Again
                </button>

                <button
                  className="
                  w-11
                  h-11
                  rounded-xl
                  border-2
                  border-black
                  bg-white
                  flex
                  items-center
                  justify-center
                  shadow-[3px_3px_0px_black]
                  hover:translate-x-[2px]
                  hover:translate-y-[2px]
                  hover:shadow-none
                  transition-all
                  "
                >
                 <FaDownload className="text-black text-lg" />
                </button>

                <button
                  className="
                  w-11
                  h-11
                  rounded-xl
                  border-2
                  border-black
                  bg-white
                  flex
                  items-center
                  justify-center
                  shadow-[3px_3px_0px_black]
                  hover:translate-x-[2px]
                  hover:translate-y-[2px]
                  hover:shadow-none
                  transition-all
                  "
                >
                  <FaShareAlt className="text-black text-lg" />
                </button>

              </div>

            </div>

          </div>
        );
      })}
      </div>
    </section>
  );
}

export default RecentLooks;