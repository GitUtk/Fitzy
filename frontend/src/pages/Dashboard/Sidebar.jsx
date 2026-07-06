// import React from "react";
// import { useNavigate } from "react-router-dom";


// function Sidebar({ activeTab, setActiveTab, handleLogout }) {
//   const navigate = useNavigate();
//   const handleUpgrade = () => {
//     navigate("/pricing");
//   };
//   const menuItems = [
//     {
//       key: "dashboard",
//       icon: "home",
//       label: "Dashboard",
//     },
//     {
//   key: "styleStudio",
//   icon: "auto_awesome",
//   label: "Style Studio",
// },
//     {
//       key: "mylooks",
//       icon: "favorite",
//       label: "My Looks",
//     },
//     {
//       key: "mywardrobe",
//       icon: "texture",
//       label: "My Wardrobe",
//     },
//     {
//       key: "saved",
//       icon: "favorite",
//       label: "Liked",
//     },
//     {
//       key: "profile",
//       icon: "person",
//       label: "Profile",
//     },
//   ];

//   return (
//     <aside className="hidden lg:flex flex-col w-[280px] h-full fixed left-0 top-0 bg-[#FAFAFA] border-r-2 border-outline-black border-t-4 border-t-[#8B5CF6] p-md space-y-sm z-40 pt-12">
//       {/* Brand Logo */}
//       <div className="mb-lg">
//         <h1 className="font-display-lg text-3xl font-black italic text-[#8B5CF6] tracking-tight">
//           FITZY<span className="text-zinc-500">.</span>
//         </h1>
//       </div>

//       {/* Navigation List */}
//       <nav className="flex flex-col space-y-2 flex-1">
//         {menuItems.map((item, index) => {
//           const isActive = activeTab === item.key;

//           return (
//             <button
//               key={index}
//               onClick={() => {
//   if (item.key === "styleStudio") {
//     navigate("/style-studio");
//     return;
//   }

//   if (window.location.pathname === "/style-studio") {
//     navigate("/dashboard");
//     return;
//   }

//   setActiveTab(item.key);
// }}
//               className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all w-full text-left active:scale-95 ${
//                 isActive
//                   ? "bg-[#B794F4] text-black border-2 border-black shadow-[4px_4px_0px_black] font-bold"
//                   : "text-zinc-700 hover:bg-[#EFE7FF] hover:text-black hover:translate-x-1"
//               }`}
//             >
//               <span className="material-symbols-outlined">{item.icon}</span>
//               <span className={isActive ? "font-body-bold" : "font-body-md"}>{item.label}</span>
//             </button>
//           );
//         })}
//       </nav>

//       {/* Premium Upgrade & Logout */}
//       <div className="pt-sm border-t-2 border-outline-black space-y-4">
//         {/* Monochromatic Premium Banner */}
//         <div className="bg-[#F8F6FF] border-2 border-outline-black rounded-xl p-4 shadow-[4px_4px_0px_black]">
//           <div className="w-10 h-10 rounded-full bg-[#CCFF00] text-black flex items-center justify-center text-lg shadow-[2px_2px_0px_gray]">
//             <span className="material-symbols-outlined text-sm">crown</span>
//           </div>

//           <h3 className="font-bold mt-3 text-sm text-black">MINT LOOK</h3>
//           <p className="text-xs text-gray-500 mt-1 leading-normal">
//             Unlock unlimited AI styling, wardrobe management and premium outfit recommendations.
//           </p>

//           <button
//             onClick={handleUpgrade}
//             className="mt-4 w-full bg-[#D9FF1F] text-black py-2 rounded-lg border-2 border-black text-xs font-bold uppercase tracking-wide hover:brightness-95 transition-colors shadow-[4px_4px_0px_black] active:scale-95"
//           >
//             Upgrade Now
//           </button>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-4 px-4 py-2 text-red-600 hover:bg-zinc-100 rounded-xl transition-all w-full text-left active:scale-95"
//         >
//           <span className="material-symbols-outlined">logout</span>
//           <span className="font-bold">Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;
import React from "react";
import { useNavigate } from "react-router-dom";


function Sidebar({ activeTab, setActiveTab, handleLogout }) {
  const navigate = useNavigate();
  const handleUpgrade = () => {
    navigate("/pricing");
  };
  const menuItems = [
    {
      key: "dashboard",
      icon: "home",
      label: "Dashboard",
    },
    {
  key: "styleStudio",
  icon: "auto_awesome",
  label: "Style Studio",
},
    {
      key: "mylooks",
      icon: "favorite",
      label: "My Looks",
    },
    {
      key: "mywardrobe",
      icon: "texture",
      label: "My Wardrobe",
    },
    {
      key: "saved",
      icon: "favorite",
      label: "Liked",
    },
    {
      key: "profile",
      icon: "person",
      label: "Profile",
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[280px] h-full fixed left-0 top-0 bg-[#FAFAFA] border-r-2 border-outline-black border-t-4 border-t-[#8B5CF6] p-md space-y-sm z-40 pt-12">
      {/* Brand Logo */}
      <div className="mb-lg">
        <h1 className="font-display-lg text-3xl font-black italic text-[#8B5CF6] tracking-tight">
          FITZY<span className="text-zinc-500">.</span>
        </h1>
      </div>

      {/* Navigation List */}
      <nav className="flex flex-col space-y-2 flex-1">
        {menuItems.map((item, index) => {
          const isActive = activeTab === item.key;

          return (
            <button
              key={index}
              onClick={() => {
  if (item.key === "styleStudio") {
    navigate("/style-studio");
    return;
  }

  if (window.location.pathname === "/style-studio") {
    navigate("/dashboard");
    return;
  }

  setActiveTab(item.key);
}}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all w-full text-left active:scale-95 ${
                isActive
                  ? "bg-[#B794F4] text-black border-2 border-black shadow-[4px_4px_0px_black] font-bold"
                  : "text-zinc-700 hover:bg-[#EFE7FF] hover:text-black hover:translate-x-1"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className={isActive ? "font-body-bold" : "font-body-md"}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Premium Upgrade & Logout */}
      <div className="pt-sm border-t-2 border-outline-black space-y-4">
        {/* Monochromatic Premium Banner */}
        <div className="bg-[#F8F6FF] border-2 border-outline-black rounded-xl p-4 shadow-[4px_4px_0px_black]">
          <div className="w-10 h-10 rounded-full bg-[#CCFF00] text-black flex items-center justify-center text-lg shadow-[2px_2px_0px_gray]">
            <span className="material-symbols-outlined text-sm">crown</span>
          </div>

          <h3 className="font-bold mt-3 text-sm text-black">MINT LOOK</h3>
          <p className="text-xs text-gray-500 mt-1 leading-normal">
            Unlock unlimited AI styling, wardrobe management and premium outfit recommendations.
          </p>

          <button
            onClick={handleUpgrade}
            className="mt-4 w-full bg-[#D9FF1F] text-black py-2 rounded-lg border-2 border-black text-xs font-bold uppercase tracking-wide hover:brightness-95 transition-colors shadow-[4px_4px_0px_black] active:scale-95"
          >
            Upgrade Now
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-2 text-red-600 hover:bg-zinc-100 rounded-xl transition-all w-full text-left active:scale-95"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;