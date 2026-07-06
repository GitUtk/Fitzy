// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // import StatsCards from "./StatsCards";
// // import Sidebar from "./Sidebar";
// // import Header from "./Header";
// // import UploadSection from "./Uploadsection";
// // import RecentLooks from "./RecentLooks";
// // import Profile from "../Profile/Profile";
// // import PremiumBanner from "./PremiumBanner";

// // const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

// // function Dashboard() {
// //   const navigate = useNavigate();
// //   const [looks, setLooks] = useState([]);
// //   const [loadingLooks, setLoadingLooks] = useState(false);
// //   const [activeTab, setActiveTab] = useState("dashboard");

// //   const fetchLooks = async () => {
// //     const token = localStorage.getItem("token");
// //     if (!token) return;
// //     setLoadingLooks(true);
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/upload/looks`, {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       if (response.ok) {
// //         const data = await response.json();
// //         setLooks(data);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching looks:", err);
// //     } finally {
// //       setLoadingLooks(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");

// //     if (!token) {
// //       navigate("/login");
// //     } else {
// //       fetchLooks();
// //     }
// //   }, [navigate]);

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     navigate("/login");
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#F8F6F2] flex">
// //       <Sidebar
// //         activeTab={activeTab}
// //         setActiveTab={setActiveTab}
// //         handleLogout={handleLogout}
// //       />

// //       <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
// //         <Header />

// //         {activeTab === "dashboard" ? (
// //           <div className="grid xl:grid-cols-2 gap-5 mt-5">
// //             <UploadSection onUploadSuccess={fetchLooks} />
// //             <RecentLooks looks={looks} loading={loadingLooks} />
// //           </div>
// //         ) : (
// //           <Profile />
          
// //         )}
// //       </main>
// //     </div>
// //   );
// // }

// // export default Dashboard;
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import StatsCards from "./Statscards";
// import Sidebar from "./Sidebar";
// import UploadSection from "./Uploadsection";
// import RecentLooks from "./RecentLooks";
// import Profile from "../Profile/Profile";

// const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

// function Dashboard() {
//   const navigate = useNavigate();
//   const [looks, setLooks] = useState([]);
//   const [loadingLooks, setLoadingLooks] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboard");

//   const fetchLooks = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     setLoadingLooks(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/upload/looks`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setLooks(data);
//       }
//     } catch (err) {
//       console.error("Error fetching looks:", err);
//     } finally {
//       setLoadingLooks(false);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/login");
//     } else {
//       fetchLooks();
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "dashboard":
//         return (
//           <div className="max-w-7xl mx-auto space-y-8">
//             <UploadSection onUploadSuccess={fetchLooks} variant="dashboard" />

//             <RecentLooks
//               looks={looks}
//               loading={loadingLooks}
//               limit={3}
//               title="Recent Try Ons"
//               subtitle="Your latest AI generated outfits"
//             />
//           </div>
//         );

//       // case "tryon":
//       //   return (
//       //     <div className="max-w-3xl mx-auto space-y-8">
//       //       <div>
//       //         <h2 className="text-3xl font-black mb-2">Virtual Try-On</h2>
//       //         <p className="text-gray-500">
//       //           Upload a photo to see how outfits look on you.
//       //         </p>
//       //       </div>
//       //       <UploadSection onUploadSuccess={fetchLooks} />
//       //     </div>
//       //   );

//       case "mylooks":
//         return (
//           <div className="max-w-5xl mx-auto space-y-8">
//             {/* <div>
//               <h2 className="text-3xl text-black font-black mb-2">My Looks</h2>
//               <p className="text-gray-500">
//                 All your generated outfits in one place.
//               </p>
//             </div> */}
//             <RecentLooks
//               looks={looks}
//               loading={loadingLooks}
//               title="My Looks"
//               subtitle="All your generated outfits in one place."
//             />
//           </div>
//         );

//       case "mywardrobe":
//         return (
//           <div className="max-w-5xl mx-auto space-y-8">
//             <div>
//               <h2 className="text-3xl font-black mb-2">My Wardrobe</h2>
//               <p className="text-gray-500">
//                 Manage your uploaded clothing items.
//               </p>
//             </div>
//             {looks.length > 0 ? (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {looks.map((look) => (
//                   <div
//                     key={look.id}
//                     className="bg-white border-2 border-black rounded-xl overflow-hidden neubrutalist-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_black] transition-all"
//                   >
//                     <div className="aspect-square overflow-hidden">
//                       <img
//                         src={look.image_url}
//                         alt="Wardrobe item"
//                         className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                         loading="lazy"
//                       />
//                     </div>
//                     <div className="p-3 border-t-2 border-black">
//                       <p className="text-xs text-gray-500 font-label-sm uppercase">
//                         Added{" "}
//                         {new Date(look.created_at).toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="bg-white border-2 border-black neubrutalist-shadow p-10 rounded-xl text-center max-w-md mx-auto">
//                 <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 border-2 border-black flex items-center justify-center mb-4">
//                   <span className="material-symbols-outlined text-3xl text-gray-400">
//                     checkroom
//                   </span>
//                 </div>
//                 <h3 className="font-bold text-lg text-gray-800">
//                   Wardrobe is empty
//                 </h3>
//                 <p className="text-sm text-gray-500 mt-2">
//                   Upload photos to build your digital wardrobe.
//                 </p>
//                 <button
//                   onClick={() => setActiveTab("tryon")}
//                   className="mt-4 bg-black text-white px-6 py-2.5 rounded-xl border-2 border-black font-semibold shadow-[3px_3px_0px_rgba(100,100,100,0.5)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:scale-95"
//                 >
//                   Upload Now
//                 </button>
//               </div>
//             )}
//           </div>
//         );

//       case "saved":
//         return (
//           <div className="max-w-5xl mx-auto space-y-8">
//             <div>
//               <h2 className="text-3xl font-black mb-2">Saved</h2>
//               <p className="text-gray-500">
//                 Your bookmarked looks and inspirations.
//               </p>
//             </div>
//             <div className="bg-white border-2 border-black neubrutalist-shadow p-10 rounded-xl text-center max-w-md mx-auto">
//               <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 border-2 border-black flex items-center justify-center mb-4">
//                 <span className="material-symbols-outlined text-3xl text-gray-400">
//                   bookmark
//                 </span>
//               </div>
//               <h3 className="font-bold text-lg text-gray-800">
//                 No saved looks yet
//               </h3>
//               <p className="text-sm text-gray-500 mt-2">
//                 Heart or bookmark looks you love to save them here.
//               </p>
//             </div>
//           </div>
//         );

//       case "profile":
//         return (
//           <div className="max-w-5xl mx-auto">
//             <Profile />
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-surface text-on-surface font-body-md overflow-x-hidden">
//       {/* Sticky Sidebar */}
//       <Sidebar
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         handleLogout={handleLogout}
//       />

//       {/* Scrollable Main Content Area */}
//       <main className="lg:ml-[280px] pt-8 pb-16 px-5 md:px-8 lg:px-10 min-h-screen bg-[#FCFCFC]">
//         {renderContent()}
//       </main>
//     </div>
//   );
// }

// export default Dashboard;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatsCards from "./Statscards";
import Sidebar from "./Sidebar";
import UploadSection from "./Uploadsection";
import RecentLooks from "./RecentLooks";
import Profile, { calculateCompletion } from "../Profile/Profile";
import MyWardrobe from "./MyWardrobe";

const API_BASE_URL = "https://fitzy-f7uv.onrender.com/api/v1";

function Dashboard() {
  const navigate = useNavigate();
  const [looks, setLooks] = useState([]);
  const [loadingLooks, setLoadingLooks] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [completionPercentage, setCompletionPercentage] = useState(100);

  const fetchLooks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingLooks(true);
    try {
      const response = await fetch(`${API_BASE_URL}/upload/looks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLooks(data);
      }
    } catch (err) {
      console.error("Error fetching looks:", err);
    } finally {
      setLoadingLooks(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      fetchLooks();
      
      // Calculate profile completion
      const savedProfileStr = localStorage.getItem("userProfile");
      if (savedProfileStr) {
        try {
          const savedProfile = JSON.parse(savedProfileStr);
          setCompletionPercentage(calculateCompletion(savedProfile));
        } catch (e) {
          setCompletionPercentage(0);
        }
      } else {
        setCompletionPercentage(0);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            <UploadSection onUploadSuccess={fetchLooks} variant="dashboard" />

            <RecentLooks
              looks={looks}
              loading={loadingLooks}
              limit={3}
              title="Recent Try Ons"
              subtitle="Your latest AI generated outfits"
            />
          </div>
        );

      // case "tryon":
      //   return (
      //     <div className="max-w-3xl mx-auto space-y-8">
      //       <div>
      //         <h2 className="text-3xl font-black mb-2">Virtual Try-On</h2>
      //         <p className="text-gray-500">
      //           Upload a photo to see how outfits look on you.
      //         </p>
      //       </div>
      //       <UploadSection onUploadSuccess={fetchLooks} />
      //     </div>
      //   );

      case "mylooks":
        return (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* <div>
              <h2 className="text-3xl text-black font-black mb-2">My Looks</h2>
              <p className="text-gray-500">
                All your generated outfits in one place.
              </p>
            </div> */}
            <RecentLooks
              looks={looks}
              loading={loadingLooks}
              title="My Looks"
              subtitle="All your generated outfits in one place."
            />
          </div>
        );

      case "mywardrobe":
        return <MyWardrobe />;

      case "saved":
        return (
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-black mb-2">Saved</h2>
              <p className="text-gray-500">
                Your bookmarked looks and inspirations.
              </p>
            </div>
            <div className="bg-white border-2 border-black neubrutalist-shadow p-10 rounded-xl text-center max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 border-2 border-black flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-gray-400">
                  bookmark
                </span>
              </div>
              <h3 className="font-bold text-lg text-gray-800">
                No saved looks yet
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Heart or bookmark looks you love to save them here.
              </p>
            </div>
          </div>
        );

      case "profile":
        return <Profile />;

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-surface text-on-surface font-body-md overflow-hidden">
      {/* Sticky Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Scrollable Main Content Area */}
      <main className="lg:ml-[280px] pt-8 pb-16 px-5 md:px-8 lg:px-10 h-full overflow-y-auto bg-[#FCFCFC]">
        {activeTab === "dashboard" && completionPercentage < 100 && (
          <div className="max-w-7xl mx-auto mb-8 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 rounded-2xl p-6 text-white shadow-[0_8px_30px_rgba(217,70,239,0.3)] flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h3 className="font-bold text-xl mb-1">Your profile is {completionPercentage}% complete!</h3>
              <p className="text-purple-100">Complete it now to get personalized fashion recommendations.</p>
            </div>
            <button 
              onClick={() => setActiveTab("profile")}
              className="mt-4 sm:mt-0 px-6 py-2 bg-white text-purple-700 font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Complete Profile
            </button>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;
