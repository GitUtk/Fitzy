// // // import { useState } from "react";

// // // function Profile() {
// // //   const [profile, setProfile] = useState({
// // //     fullName: "",
// // //     email: "",
// // //     phone: "",
// // //     gender: "",
// // //     age: "",
// // //     height: "",
// // //     bodyType: "",
// // //     fitPreference: "",
// // //     budget: "",
// // //     topSize: "",
// // //     bottomSize: "",
// // //     shoeSize: "",
// // //     styles: [],
// // //     colors: [],
// // //   });

// // //   const stylesList = [
// // //     "Casual",
// // //     "Streetwear",
// // //     "Minimal",
// // //     "Formal",
// // //     "Ethnic",
// // //     "Korean",
// // //     "Y2K",
// // //     "Luxury",
// // //   ];

// // //   const colorsList = [
// // //     "Black",
// // //     "White",
// // //     "Beige",
// // //     "Brown",
// // //     "Blue",
// // //     "Pink",
// // //     "Green",
// // //     "Red",
// // //   ];

// // //   const handleStyleChange = (style) => {
// // //     if (profile.styles.includes(style)) {
// // //       setProfile({
// // //         ...profile,
// // //         styles: profile.styles.filter((s) => s !== style),
// // //       });
// // //     } else {
// // //       setProfile({
// // //         ...profile,
// // //         styles: [...profile.styles, style],
// // //       });
// // //     }
// // //   };

// // //   const handleColorChange = (color) => {
// // //     if (profile.colors.includes(color)) {
// // //       setProfile({
// // //         ...profile,
// // //         colors: profile.colors.filter((c) => c !== color),
// // //       });
// // //     } else {
// // //       setProfile({
// // //         ...profile,
// // //         colors: [...profile.colors, color],
// // //       });
// // //     }
// // //   };

// // //   const handleSave = () => {
// // //     console.log(profile);
// // //     alert("Profile Saved Successfully");
// // //   };

// // //   return (
// // //     <div
// // //       className="
// // //       max-w-5xl
// // //       mx-auto
// // //       bg-white
// // //       border-2
// // //       border-black
// // //       rounded-3xl
// // //       p-6 md:p-10
// // //       shadow-[8px_8px_0px_black]
// // //       mt-5
// // //       "
// // //     >
// // //       <h1 className="text-3xl md:text-4xl font-black">
// // //         My Fashion Profile
// // //       </h1>

// // //       <p className="text-gray-500 mt-2">
// // //         Help Fitzy personalize your outfit recommendations.
// // //       </p>

// // //       <div className="mt-8">
// // //         <h2 className="text-2xl font-black mb-4">
// // //           Basic Information
// // //         </h2>

// // //         <div className="grid md:grid-cols-2 gap-4">
// // //           <input
// // //             placeholder="Full Name"
// // //             className="border-2 border-black rounded-xl p-3"
// // //             onChange={(e) =>
// // //               setProfile({
// // //                 ...profile,
// // //                 fullName: e.target.value,
// // //               })
// // //             }
// // //           />

// // //           <input
// // //             placeholder="Email"
// // //             className="border-2 border-black rounded-xl p-3"
// // //             onChange={(e) =>
// // //               setProfile({
// // //                 ...profile,
// // //                 email: e.target.value,
// // //               })
// // //             }
// // //           />

// // //           <input
// // //             placeholder="Phone Number"
// // //             className="border-2 border-black rounded-xl p-3"
// // //             onChange={(e) =>
// // //               setProfile({
// // //                 ...profile,
// // //                 phone: e.target.value,
// // //               })
// // //             }
// // //           />

// // //           <input
// // //             placeholder="Age"
// // //             className="border-2 border-black rounded-xl p-3"
// // //             onChange={(e) =>
// // //               setProfile({
// // //                 ...profile,
// // //                 age: e.target.value,
// // //               })
// // //             }
// // //           />
// // //         </div>
// // //       </div>

// // //       <div className="mt-8">
// // //         <h2 className="text-2xl font-black mb-4">
// // //           Body Profile
// // //         </h2>

// // //         <div className="grid md:grid-cols-3 gap-4">
// // //           <select
// // //             className="border-2 border-black rounded-xl p-3"
// // //             onChange={(e) =>
// // //               setProfile({
// // //                 ...profile,
// // //                 gender: e.target.value,
// // //               })
// // //             }
// // //           >
// // //             <option>Gender</option>
// // //             <option>Female</option>
// // //             <option>Male</option>
// // //             <option>Other</option>
// // //           </select>

// // //           <input
// // //             placeholder="Height (cm)"
// // //             className="border-2 border-black rounded-xl p-3"
// // //             onChange={(e) =>
// // //               setProfile({
// // //                 ...profile,
// // //                 height: e.target.value,
// // //               })
// // //             }
// // //           />

// // //           <select
// // //             className="border-2 border-black rounded-xl p-3"
// // //             onChange={(e) =>
// // //               setProfile({
// // //                 ...profile,
// // //                 bodyType: e.target.value,
// // //               })
// // //             }
// // //           >
// // //             <option>Body Type</option>
// // //             <option>Slim</option>
// // //             <option>Athletic</option>
// // //             <option>Curvy</option>
// // //             <option>Plus Size</option>
// // //           </select>
// // //         </div>
// // //       </div>

// // //       <div className="mt-8">
// // //         <h2 className="text-2xl font-black mb-4">
// // //           Favorite Styles
// // //         </h2>

// // //         <div className="flex flex-wrap gap-3">
// // //           {stylesList.map((style) => (
// // //             <button
// // //               key={style}
// // //               type="button"
// // //               onClick={() =>
// // //                 handleStyleChange(style)
// // //               }
// // //               className={`
// // //               px-4 py-2 rounded-xl border-2 border-black
// // //               ${
// // //                 profile.styles.includes(style)
// // //                   ? "bg-orange-500 text-white"
// // //                   : "bg-white"
// // //               }
// // //               `}
// // //             >
// // //               {style}
// // //             </button>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       <div className="mt-8">
// // //         <h2 className="text-2xl font-black mb-4">
// // //           Favorite Colors
// // //         </h2>

// // //         <div className="flex flex-wrap gap-3">
// // //           {colorsList.map((color) => (
// // //             <button
// // //               key={color}
// // //               type="button"
// // //               onClick={() =>
// // //                 handleColorChange(color)
// // //               }
// // //               className={`
// // //               px-4 py-2 rounded-xl border-2 border-black
// // //               ${
// // //                 profile.colors.includes(color)
// // //                   ? "bg-orange-500 text-white"
// // //                   : "bg-white"
// // //               }
// // //               `}
// // //             >
// // //               {color}
// // //             </button>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       <div className="mt-8">
// // //         <h2 className="text-2xl font-black mb-4">
// // //           Budget Range
// // //         </h2>

// // //         <select
// // //           className="border-2 border-black rounded-xl p-3 w-full"
// // //           onChange={(e) =>
// // //             setProfile({
// // //               ...profile,
// // //               budget: e.target.value,
// // //             })
// // //           }
// // //         >
// // //           <option>Select Budget</option>
// // //           <option>Under ₹1000</option>
// // //           <option>₹1000 - ₹3000</option>
// // //           <option>₹3000 - ₹5000</option>
// // //           <option>₹5000+</option>
// // //         </select>
// // //       </div>

// // //       <div className="mt-8">
// // //         <h2 className="text-2xl font-black mb-4">
// // //           Sizes
// // //         </h2>

// // //         <div className="grid md:grid-cols-3 gap-4">
// // //           <select
// // //             className="border-2 border-black rounded-xl p-3"
// // //           >
// // //             <option>Top Size</option>
// // //             <option>XS</option>
// // //             <option>S</option>
// // //             <option>M</option>
// // //             <option>L</option>
// // //             <option>XL</option>
// // //           </select>

// // //           <select
// // //             className="border-2 border-black rounded-xl p-3"
// // //           >
// // //             <option>Bottom Size</option>
// // //             <option>26</option>
// // //             <option>28</option>
// // //             <option>30</option>
// // //             <option>32</option>
// // //             <option>34</option>
// // //             <option>36</option>
// // //             <option>38</option>
// // //             <option>40</option>
// // //             <option>42</option>
// // //           </select>

// // //           <input
// // //             placeholder="Shoe Size"
// // //             className="border-2 border-black rounded-xl p-3"
// // //           />
// // //         </div>
// // //       </div>

// // //       <button
// // //         onClick={handleSave}
// // //         className="
// // //         mt-10
// // //         w-full
// // //         bg-orange-500
// // //         text-white
// // //         py-4
// // //         rounded-xl
// // //         border-2
// // //         border-black
// // //         font-bold
// // //         shadow-[4px_4px_0px_black]
// // //         hover:translate-x-[2px]
// // //         hover:translate-y-[2px]
// // //         hover:shadow-none
// // //         transition-all
// // //         "
// // //       >
// // //         Save Preferences
// // //       </button>
// // //     </div>
// // //   );
// // // }

// // // export default Profile;
// // import { useState } from "react";

// // function Profile() {
// //   const [profile, setProfile] = useState({
// //     fullName: "",
// //     email: "",
// //     phone: "",
// //     gender: "",
// //     age: "",
// //     height: "",
// //     bodyType: "",
// //     fitPreference: "",
// //     budget: "",
// //     topSize: "",
// //     bottomSize: "",
// //     shoeSize: "",
// //     styles: [],
// //     colors: [],
// //   });

// //   const stylesList = [
// //     "Casual",
// //     "Streetwear",
// //     "Minimal",
// //     "Formal",
// //     "Ethnic",
// //     "Korean",
// //     "Y2K",
// //     "Luxury",
// //   ];

// //   const colorsList = [
// //     "Black",
// //     "White",
// //     "Beige",
// //     "Brown",
// //     "Blue",
// //     "Pink",
// //     "Green",
// //     "Red",
// //   ];

// //   const handleStyleChange = (style) => {
// //     if (profile.styles.includes(style)) {
// //       setProfile({
// //         ...profile,
// //         styles: profile.styles.filter((s) => s !== style),
// //       });
// //     } else {
// //       setProfile({
// //         ...profile,
// //         styles: [...profile.styles, style],
// //       });
// //     }
// //   };

// //   const handleColorChange = (color) => {
// //     if (profile.colors.includes(color)) {
// //       setProfile({
// //         ...profile,
// //         colors: profile.colors.filter((c) => c !== color),
// //       });
// //     } else {
// //       setProfile({
// //         ...profile,
// //         colors: [...profile.colors, color],
// //       });
// //     }
// //   };

// //   const handleSave = () => {
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       alert("You must be logged in to save preferences.");
// //       return;
// //     }
// //     // TODO: Wire up to API endpoint
// //     console.log("Profile data:", profile);
// //     alert("Profile Saved Successfully");
// //   };

// //   return (
// //     <div
// //       className="
// //       max-w-5xl
// //       mx-auto
// //       bg-white
// //       border-2
// //       border-black
// //       rounded-3xl
// //       p-6 md:p-10
// //       shadow-[8px_8px_0px_black]
// //       mt-5
// //       "
// //     >
// //       <h1 className="text-3xl md:text-4xl font-black">
// //         My Fashion Profile
// //       </h1>

// //       <p className="text-gray-500 mt-2">
// //         Help Fitzy personalize your outfit recommendations.
// //       </p>

// //       <div className="mt-8">
// //         <h2 className="text-2xl font-black mb-4">
// //           Basic Information
// //         </h2>

// //         <div className="grid md:grid-cols-2 gap-4">
// //           <input
// //             placeholder="Full Name"
// //             className="border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0px_black] transition-all"
// //             value={profile.fullName}
// //             onChange={(e) =>
// //               setProfile({
// //                 ...profile,
// //                 fullName: e.target.value,
// //               })
// //             }
// //           />

// //           <input
// //             placeholder="Email"
// //             className="border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0px_black] transition-all"
// //             value={profile.email}
// //             onChange={(e) =>
// //               setProfile({
// //                 ...profile,
// //                 email: e.target.value,
// //               })
// //             }
// //           />

// //           <input
// //             placeholder="Phone Number"
// //             className="border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0px_black] transition-all"
// //             value={profile.phone}
// //             onChange={(e) =>
// //               setProfile({
// //                 ...profile,
// //                 phone: e.target.value,
// //               })
// //             }
// //           />

// //           <input
// //             placeholder="Age"
// //             className="border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0px_black] transition-all"
// //             value={profile.age}
// //             onChange={(e) =>
// //               setProfile({
// //                 ...profile,
// //                 age: e.target.value,
// //               })
// //             }
// //           />
// //         </div>
// //       </div>

// //       <div className="mt-8">
// //         <h2 className="text-2xl font-black mb-4">
// //           Body Profile
// //         </h2>

// //         <div className="grid md:grid-cols-3 gap-4">
// //           <select
// //             className="border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0px_black] transition-all"
// //             value={profile.gender}
// //             onChange={(e) =>
// //               setProfile({
// //                 ...profile,
// //                 gender: e.target.value,
// //               })
// //             }
// //           >
// //             <option value="">Gender</option>
// //             <option>Female</option>
// //             <option>Male</option>
// //             <option>Other</option>
// //           </select>

// //           <input
// //             placeholder="Height (cm)"
// //             className="border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0px_black] transition-all"
// //             value={profile.height}
// //             onChange={(e) =>
// //               setProfile({
// //                 ...profile,
// //                 height: e.target.value,
// //               })
// //             }
// //           />

// //           <select
// //             className="border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0px_black] transition-all"
// //             value={profile.bodyType}
// //             onChange={(e) =>
// //               setProfile({
// //                 ...profile,
// //                 bodyType: e.target.value,
// //               })
// //             }
// //           >
// //             <option value="">Body Type</option>
// //             <option>Slim</option>
// //             <option>Athletic</option>
// //             <option>Curvy</option>
// //             <option>Plus Size</option>
// //           </select>
// //         </div>
// //       </div>

// //       <div className="mt-8">
// //         <h2 className="text-2xl font-black mb-4">
// //           Fit Preference
// //         </h2>

// //         <div className="grid md:grid-cols-3 gap-4">
// //           {["Slim Fit", "Regular Fit", "Relaxed Fit"].map((fit) => (
// //             <button
// //               key={fit}
// //               type="button"
// //               onClick={() =>
// //                 setProfile({ ...profile, fitPreference: fit })
// //               }
// //               className={`
// //               px-4 py-3 rounded-xl border-2 border-black font-semibold transition-all
// //               ${
// //                 profile.fitPreference === fit
// //                   ? "bg-black text-white shadow-[2px_2px_0px_gray]"
// //                   : "bg-white hover:bg-zinc-50"
// //               }
// //               `}
// //             >
// //               {fit}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="mt-8">
// //         <h2 className="text-2xl font-black mb-4">
// //           Favorite Styles
// //         </h2>

// //         <div className="flex flex-wrap gap-3">
// //           {stylesList.map((style) => (
// //             <button
// //               key={style}
// //               type="button"
// //               onClick={() =>
// //                 handleStyleChange(style)
// //               }
// //               className={`
// //               px-4 py-2 rounded-xl border-2 border-black font-semibold transition-all
// //               ${
// //                 profile.styles.includes(style)
// //                   ? "bg-black text-white shadow-[2px_2px_0px_gray]"
// //                   : "bg-white hover:bg-zinc-50"
// //               }
// //               `}
// //             >
// //               {style}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="mt-8">
// //         <h2 className="text-2xl font-black mb-4">
// //           Favorite Colors
// //         </h2>

// //         <div className="flex flex-wrap gap-3">
// //           {colorsList.map((color) => (
// //             <button
// //               key={color}
// //               type="button"
// //               onClick={() =>
// //                 handleColorChange(color)
// //               }
// //               className={`
// //               px-4 py-2 rounded-xl border-2 border-black font-semibold transition-all
// //               ${
// //                 profile.colors.includes(color)
// //                   ? "bg-black text-white shadow-[2px_2px_0px_gray]"
// //                   : "bg-white hover:bg-zinc-50"
// //               }
// //               `}
// //             >
// //               {color}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="mt-8">
// //         <h2 className="text-2xl font-black mb-4">
// //           Budget Range
// //         </h2>

// //         <select
// //           className="border-2 border-black rounded-xl p-3 w-full focus:outline-none focus:shadow-[2px_2px_0px_black] transition-all"
// //           value={profile.budget}
// //           onChange={(e) =>
// //             setProfile({
// //               ...profile,
// //               budget: e.target.value,
// //             })
// //           }
// //         >
// //           <option value="">Select Budget</option>
// //           <option>Under ₹1000</option>
// //           <option>₹1000 - ₹3000</option>
// //           <option>₹3000 - ₹5000</option>
// //           <option>₹5000+</option>
// //         </select>
// //       </div>

// //       <div className="mt-8">
// //         <h2 className="text-2xl font-black mb-4">
// //           Sizes
// //         </h2>

// //         <div className="grid md:grid-cols-3 gap-4">
// //           <select
// //             className="border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0px_black] transition-all"
// //             value={profile.topSize}
// //             onChange={(e) =>
// //               setProfile({ ...profile, topSize: e.target.value })
// //             }
// //           >
// //             <option value="">Top Size</option>
// //             <option>XS</option>
// //             <option>S</option>
// //             <option>M</option>
// //             <option>L</option>
// //             <option>XL</option>
// //           </select>

// //           <select
// //             className="border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0px_black] transition-all"
// //             value={profile.bottomSize}
// //             onChange={(e) =>
// //               setProfile({ ...profile, bottomSize: e.target.value })
// //             }
// //           >
// //             <option value="">Bottom Size</option>
// //             <option>26</option>
// //             <option>28</option>
// //             <option>30</option>
// //             <option>32</option>
// //             <option>34</option>
// //             <option>36</option>
// //             <option>38</option>
// //             <option>40</option>
// //             <option>42</option>
// //           </select>

// //           <input
// //             placeholder="Shoe Size"
// //             className="border-2 border-black rounded-xl p-3 focus:outline-none focus:shadow-[2px_2px_0px_black] transition-all"
// //             value={profile.shoeSize}
// //             onChange={(e) =>
// //               setProfile({ ...profile, shoeSize: e.target.value })
// //             }
// //           />
// //         </div>
// //       </div>

// //       <button
// //         onClick={handleSave}
// //         className="
// //         mt-10
// //         w-full
// //         bg-black
// //         text-white
// //         py-4
// //         rounded-xl
// //         border-2
// //         border-black
// //         font-bold
// //         shadow-[4px_4px_0px_rgba(100,100,100,0.5)]
// //         hover:translate-x-[2px]
// //         hover:translate-y-[2px]
// //         hover:shadow-none
// //         transition-all
// //         active:scale-95
// //         "
// //       >
// //         Save Preferences
// //       </button>
// //     </div>
// //   );
// // }

// // export default Profile;
// import { useState } from "react";
// import {
//   FaUser,
//   FaCamera,
//   FaEnvelope,
//   FaPhone,
//   FaVenusMars,
//   FaRulerVertical,
//   FaTshirt,
//   FaPalette,
//   FaHeart,
//   FaCrown,
//   FaStore,
//   FaSave,
//   FaWallet,
// } from "react-icons/fa";

// function Profile() {
//   const [profile, setProfile] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     gender: "",
//     age: "",
//     height: "",
//     bodyType: "",
//     fitPreference: "",
//     budget: "",
//     topSize: "",
//     bottomSize: "",
//     shoeSize: "",
//     styles: [],
//     colors: [],
//     brands: [],
//     apps: [],
//   });

//   const stylesList = [
//     "Casual",
//     "Streetwear",
//     "Minimal",
//     "Formal",
//     "Ethnic",
//     "Korean",
//     "Luxury",
//     "Y2K",
//   ];

//   const colorsList = [
//     "Black",
//     "White",
//     "Blue",
//     "Pink",
//     "Green",
//     "Brown",
//     "Beige",
//     "Red",
//   ];

//   const brands = [
//     "Zara",
//     "H&M",
//     "Nike",
//     "Adidas",
//     "Newme",
//     "Savana",
//     "Uniqlo",
//     "Levis",
//   ];

//   const apps = [
//     "Myntra",
//     "Ajio",
//     "Amazon",
//     "Flipkart",
//     "Newme",
//     "Savana",
//   ];

//   const toggleValue = (field, value) => {
//     if (profile[field].includes(value)) {
//       setProfile({
//         ...profile,
//         [field]: profile[field].filter((v) => v !== value),
//       });
//     } else {
//       setProfile({
//         ...profile,
//         [field]: [...profile[field], value],
//       });
//     }
//   };

//   const handleSave = () => {
//     alert("Profile Saved Successfully");
//     console.log(profile);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-8">

//       {/* HEADER */}

//       <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm p-8">

//         <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

//           <div className="flex items-center gap-6">

//             <div className="relative">

//               <div className="w-32 h-32 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-5xl">

//                 <FaUser />

//               </div>

//               <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-black text-white border-2 border-white flex items-center justify-center">

//                 <FaCamera />

//               </button>

//             </div>

//             <div>

//               <h1 className="text-4xl font-black text-black">

//                 {profile.fullName || "Your Name"}

//               </h1>

//               <div className="mt-3 flex items-center gap-2 text-gray-500">

//                 <FaEnvelope />

//                 {profile.email || "example@email.com"}

//               </div>

//               <div className="mt-2 flex items-center gap-2 text-gray-500">

//                 <FaPhone />

//                 {profile.phone || "+91 XXXXX XXXXX"}

//               </div>

//             </div>

//           </div>

//           <div className="w-full lg:w-[350px]">

//             <div className="flex justify-between mb-3">

//               <span className="font-bold">

//                 Profile Completion

//               </span>

//               <span className="font-black text-[#8B5CF6]">

//                 82%

//               </span>

//             </div>

//             <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden">

//               <div className="w-[82%] h-full bg-[#8B5CF6]" />

//             </div>

//             <button className="w-full mt-6 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3 rounded-2xl font-bold transition">

//               Edit Profile

//             </button>

//           </div>

//         </div>

//       </div>

//       {/* CONTENT */}

//       <div className="grid lg:grid-cols-2 gap-6 mt-8">
//         <div className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm">
//           <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
//             <FaUser className="text-[#8B5CF6]" />
//             Basic Details
//           </h2>

//           <div className="space-y-4">
//             <input
//               placeholder="Full Name"
//               value={profile.fullName}
//               onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
//               className="w-full border rounded-xl p-3"
//             />

//             <input
//               placeholder="Email"
//               value={profile.email}
//               onChange={(e) => setProfile({ ...profile, email: e.target.value })}
//               className="w-full border rounded-xl p-3"
//             />

//             <input
//               placeholder="Phone Number"
//               value={profile.phone}
//               onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
//               className="w-full border rounded-xl p-3"
//             />

//             <div className="grid grid-cols-2 gap-3">
//               <input
//                 placeholder="Age"
//                 value={profile.age}
//                 onChange={(e) => setProfile({ ...profile, age: e.target.value })}
//                 className="border rounded-xl p-3"
//               />

//               <select
//                 value={profile.gender}
//                 onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
//                 className="border rounded-xl p-3"
//               >
//                 <option value="">Gender</option>
//                 <option>Female</option>
//                 <option>Male</option>
//                 <option>Other</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm">
//           <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
//             <FaRulerVertical className="text-[#8B5CF6]" />
//             Body Details
//           </h2>

//           <div className="space-y-4">
//             <input
//               placeholder="Height (cm)"
//               value={profile.height}
//               onChange={(e) => setProfile({ ...profile, height: e.target.value })}
//               className="w-full border rounded-xl p-3"
//             />

//             <select
//               value={profile.bodyType}
//               onChange={(e) => setProfile({ ...profile, bodyType: e.target.value })}
//               className="w-full border rounded-xl p-3"
//             >
//               <option value="">Body Type</option>
//               <option>Slim</option>
//               <option>Athletic</option>
//               <option>Curvy</option>
//               <option>Plus Size</option>
//             </select>

//             <select
//               value={profile.fitPreference}
//               onChange={(e) => setProfile({ ...profile, fitPreference: e.target.value })}
//               className="w-full border rounded-xl p-3"
//             >
//               <option value="">Fit Preference</option>
//               <option>Slim Fit</option>
//               <option>Regular Fit</option>
//               <option>Relaxed Fit</option>
//             </select>
//           </div>
//         </div>
//       </div>
//             {/* STYLE PREFERENCES */}

//       <div className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm mt-8">

//         <h2 className="text-2xl font-extrabold text-zinc-900 mb-6 flex items-center gap-3">
//           <FaPalette className="text-[#8B5CF6]" />
//           Style Preferences
//         </h2>

//         <div className="flex flex-wrap gap-3">
//           {stylesList.map((style) => (
//             <button
//               key={style}
//               type="button"
//               onClick={() => toggleValue("styles", style)}
//               className={`px-5 py-3 rounded-2xl border transition-all font-semibold
//                 ${
//                   profile.styles.includes(style)
//                     ? "bg-[#8B5CF6] text-white border-[#8B5CF6]"
//                     : "bg-white hover:bg-zinc-100 border-zinc-300"
//                 }`}
//             >
//               {style}
//             </button>
//           ))}
//         </div>

//       </div>

//       {/* FAVOURITE COLOURS */}

//       <div className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm mt-8">

//         <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
//           <FaHeart className="text-pink-500" />
//           Favourite Colours
//         </h2>

//         <div className="flex flex-wrap gap-3">
//           {colorsList.map((color) => (
//             <button
//               key={color}
//               type="button"
//               onClick={() => toggleValue("colors", color)}
//               className={`px-5 py-3 rounded-2xl border transition-all font-semibold
//                 ${
//                   profile.colors.includes(color)
//                     ? "bg-pink-500 text-white border-pink-500"
//                     : "bg-white hover:bg-zinc-100 border-zinc-300"
//                 }`}
//             >
//               {color}
//             </button>
//           ))}
//         </div>

//       </div>

//       {/* SIZES */}

//       <div className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm mt-8">

//         <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
//           <FaTshirt className="text-[#8B5CF6]" />
//           Sizes
//         </h2>

//         <div className="grid md:grid-cols-3 gap-5">

//           <select
//             value={profile.topSize}
//             onChange={(e) =>
//               setProfile({ ...profile, topSize: e.target.value })
//             }
//             className="border rounded-xl p-3"
//           >
//             <option value="">Top Size</option>
//             <option>XS</option>
//             <option>S</option>
//             <option>M</option>
//             <option>L</option>
//             <option>XL</option>
//           </select>

//           <select
//             value={profile.bottomSize}
//             onChange={(e) =>
//               setProfile({
//                 ...profile,
//                 bottomSize: e.target.value,
//               })
//             }
//             className="border rounded-xl p-3"
//           >
//             <option value="">Bottom Size</option>
//             <option>26</option>
//             <option>28</option>
//             <option>30</option>
//             <option>32</option>
//             <option>34</option>
//             <option>36</option>
//             <option>38</option>
//             <option>40</option>
//             <option>42</option>
//           </select>

//           <input
//             placeholder="Shoe Size"
//             value={profile.shoeSize}
//             onChange={(e) =>
//               setProfile({
//                 ...profile,
//                 shoeSize: e.target.value,
//               })
//             }
//             className="border rounded-xl p-3"
//           />

//         </div>

//       </div>
//             {/* BUDGET */}

//       <div className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm mt-8">

//         <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-2">
//           <FaWallet className="text-green-600" />
//           Budget
//         </h2>

//         <select
//           value={profile.budget}
//           onChange={(e) =>
//             setProfile({
//               ...profile,
//               budget: e.target.value,
//             })
//           }
//           className="w-full border rounded-xl p-3"
//         >
//           <option value="">Select Budget</option>
//           <option>Under ₹1000</option>
//           <option>₹1000 - ₹3000</option>
//           <option>₹3000 - ₹5000</option>
//           <option>₹5000+</option>
//         </select>

//       </div>

//       {/* FAVOURITE BRANDS */}

//       <div className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm mt-8">

//         <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
//           <FaCrown className="text-yellow-500" />
//           Favourite Brands
//         </h2>

//         <div className="flex flex-wrap gap-3">
//           {brands.map((brand) => (
//             <button
//               key={brand}
//               type="button"
//               onClick={() => toggleValue("brands", brand)}
//               className={`px-5 py-3 rounded-2xl border transition-all font-semibold
//                 ${
//                   profile.brands.includes(brand)
//                     ? "bg-yellow-400 text-black border-yellow-400"
//                     : "bg-white hover:bg-zinc-100 border-zinc-300"
//                 }`}
//             >
//               {brand}
//             </button>
//           ))}
//         </div>

//       </div>

//       {/* SHOPPING APPS */}

//       <div className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm mt-8">

//         <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
//           <FaStore className="text-[#8B5CF6]" />
//           Shopping Apps
//         </h2>

//         <div className="flex flex-wrap gap-3">
//           {apps.map((app) => (
//             <button
//               key={app}
//               type="button"
//               onClick={() => toggleValue("apps", app)}
//               className={`px-5 py-3 rounded-2xl border transition-all font-semibold
//                 ${
//                   profile.apps.includes(app)
//                     ? "bg-[#8B5CF6] text-white border-[#8B5CF6]"
//                     : "bg-white hover:bg-zinc-100 border-zinc-300"
//                 }`}
//             >
//               {app}
//             </button>
//           ))}
//         </div>

//       </div>
//             {/* SAVE BUTTON */}

//       <div className="mt-10 flex justify-end">
//         <button
//           onClick={handleSave}
//           className="
//             flex items-center gap-3
//             bg-[#8B5CF6]
//             hover:bg-[#7C3AED]
//             text-white
//             px-8
//             py-4
//             rounded-2xl
//             font-bold
//             text-lg
//             shadow-lg
//             transition-all
//             hover:scale-[1.02]
//           "
//         >
//           <FaSave />
//           Save Profile
//         </button>
//       </div>

//     </div>
//   );
// }

// export default Profile;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const PROFILE_FIELDS = [
  "fullName",
  "email",
  "gender",
  "age",
  "height",
  "bodyType",
  "fitPreference",
  "budget",
  "topSize",
  "bottomSize",
  "shoeSize",
  "styles",
  "colors",
];

export const calculateCompletion = (profileData) => {
  let filled = 0;
  PROFILE_FIELDS.forEach((field) => {
    const val = profileData[field];
    if (Array.isArray(val)) {
      if (val.length > 0) filled++;
    } else if (val && String(val).trim() !== "") {
      filled++;
    }
  });
  return Math.round((filled / PROFILE_FIELDS.length) * 100);
};

function Profile({ isSetupMode = false }) {
  const navigate = useNavigate();
  const [completion, setCompletion] = useState(0);
  
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    gender: "",
    age: "",
    height: "",
    bodyType: "",
    fitPreference: "",
    budget: "",
    topSize: "",
    bottomSize: "",
    shoeSize: "",
    styles: [],
    colors: [],
  });

  // useEffect(() => {
  //   const saved = localStorage.getItem("userProfile");
  //   if (saved) {
  //     try {
  //       const parsed = JSON.parse(saved);
  //       setProfile(parsed);
  //       setCompletion(calculateCompletion(parsed));
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }
  // }, []);
  useEffect(() => {
  const saved = localStorage.getItem("userProfile");

  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      setProfile((prev) => {
        const merged = {
          ...prev,
          ...parsed,
        };

        setCompletion(calculateCompletion(merged));
        return merged;
      });
    } catch (e) {
      console.error(e);
    }
  }
}, []);

  const stylesList = [
    "Casual",
    "Streetwear",
    "Minimal",
    "Formal",
    "Ethnic",
    "Korean",
    "Luxury",
    "Y2K",
  ];

  const colorsList = [
    "Black",
    "White",
    "Blue",
    "Pink",
    "Green",
    "Brown",
    "Beige",
    "Red",
  ];

  // const toggleValue = (field, value) => {
  //   let updatedField;
  //   if (profile[field].includes(value)) {
  //     updatedField = profile[field].filter((v) => v !== value);
  //   } else {
  //     updatedField = [...profile[field], value];
  //   }
    
  //   const newProfile = { ...profile, [field]: updatedField };
  //   setProfile(newProfile);
  //   setCompletion(calculateCompletion(newProfile));
  // };

  const toggleValue = (field, value) => {
  const values = profile[field] || [];

  const updatedField = values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];

  const newProfile = {
    ...profile,
    [field]: updatedField,
  };

  setProfile(newProfile);
  setCompletion(calculateCompletion(newProfile));
};
  const handleInputChange = (field, value) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
    setCompletion(calculateCompletion(newProfile));
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    if (isSetupMode) {
      navigate("/dashboard");
    } else {
      alert("Profile Saved Successfully");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #ec4899 100%)",
          backgroundSize: "100% 100%",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Profile</p>
              <CardTitle className="text-3xl font-bold tracking-tight">
                {profile.fullName || "Your Name"}
              </CardTitle>
            </div>
            <div className="grid gap-4 rounded-2xl bg-muted/40 p-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="mt-1 text-sm font-medium">
                  {profile.email || "example@email.com"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="mt-1 text-sm font-medium">{completion}%</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${completion}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-200 p-3">
                <p className="text-xs uppercase tracking-wide">Style picks</p>
                <p className="mt-1 font-medium text-foreground">
                  {profile.styles.length || 0}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-3">
                <p className="text-xs uppercase tracking-wide">Color picks</p>
                <p className="mt-1 font-medium text-foreground">
                  {profile.colors.length || 0}
                </p>
              </div>
            </div>
            <p>
              Keep the form concise and accurate so recommendations can stay relevant.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  value={profile.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Age"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={profile.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select gender</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Body Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={profile.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                placeholder="Height in cm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bodyType">Body type</Label>
              <select
                id="bodyType"
                value={profile.bodyType}
                onChange={(e) => handleInputChange("bodyType", e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select body type</option>
                <option>Slim</option>
                <option>Athletic</option>
                <option>Curvy</option>
                <option>Plus Size</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fitPreference">Fit preference</Label>
              <select
                id="fitPreference"
                value={profile.fitPreference}
                onChange={(e) => handleInputChange("fitPreference", e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select fit preference</option>
                <option>Slim Fit</option>
                <option>Regular Fit</option>
                <option>Relaxed Fit</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Style Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
          {stylesList.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => toggleValue("styles", style)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all
                ${
                  (profile.styles || []).includes(style)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-zinc-200 bg-background hover:bg-muted"
                }`}
            >
              {style}
            </button>
          ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Favourite Colours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
          {colorsList.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => toggleValue("colors", color)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all
                ${
                  (profile.colors || []).includes(color)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-zinc-200 bg-background hover:bg-muted"
                }`}
            >
              {color}
            </button>
          ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Sizes & Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="topSize">Top size</Label>
                <select
                  id="topSize"
                  value={profile.topSize}
                  onChange={(e) => handleInputChange("topSize", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select</option>
                  <option>XS</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bottomSize">Bottom size</Label>
                <select
                  id="bottomSize"
                  value={profile.bottomSize}
                  onChange={(e) => handleInputChange("bottomSize", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select</option>
                  <option>26</option>
                  <option>28</option>
                  <option>30</option>
                  <option>32</option>
                  <option>34</option>
                  <option>36</option>
                  <option>38</option>
                  <option>40</option>
                  <option>42</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shoeSize">Shoe size</Label>
                <Input
                  id="shoeSize"
                  value={profile.shoeSize}
                  onChange={(e) => handleInputChange("shoeSize", e.target.value)}
                  placeholder="Shoe size"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget</Label>
              <select
                id="budget"
                value={profile.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select budget</option>
                <option>Under ₹1000</option>
                <option>₹1000 - ₹3000</option>
                <option>₹3000 - ₹5000</option>
                <option>₹5000+</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {isSetupMode && (
          <Button variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
        )}
        <Button onClick={handleSave} className="sm:min-w-40">
          Save profile
        </Button>
      </div>
      </div>
    </div>
  );
}

export default Profile;
