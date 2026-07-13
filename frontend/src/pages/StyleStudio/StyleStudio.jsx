// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   analyzeImage,
//   getSimilarProducts,
// } from "./api";

// import UploadCard from "./UploadCard";
// import AnalysisCard from "./AnalysisCard";
// import SimilarProducts from "./SimilarProducts";
// import Sidebar from "../Dashboard/Sidebar";

// function StyleStudio() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [analysis, setAnalysis] = useState("");
//   const [displayAnalysis, setDisplayAnalysis] = useState("");
// const [products, setProducts] = useState([]);

// const [loadingAnalysis, setLoadingAnalysis] = useState(false);
// const [loadingProducts, setLoadingProducts] = useState(false);

// const [analysisError, setAnalysisError] = useState("");
// const [productsError, setProductsError] = useState("");

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };
//   useEffect(() => {
//   if (!selectedFile) return;

//   const processImage = async () => {
//     setLoadingAnalysis(true);
//     setLoadingProducts(true);

//     setAnalysis("");
//     setProducts([]);

//     setAnalysisError("");
//     setProductsError("");

// //     try {
// //       const [analysisData, similarData] = await Promise.all([
// //         analyzeImage(selectedFile),
// //         getSimilarProducts(selectedFile),
// //       ]);

// //       const fullAnalysis = analysisData.analysis || "";

// // setAnalysis(fullAnalysis);
// // setDisplayAnalysis("");

// // let index = 0;

// // const timer = setInterval(() => {
// //   index++;

// //   setDisplayAnalysis(fullAnalysis.slice(0, index));

// //   if (index >= fullAnalysis.length) {
// //     clearInterval(timer);
// //   }
// // }, 12);

// // setProducts(similarData.results || []);
// //     } catch (err) {
// //       console.error(err);

// //       setAnalysisError(err.message);
// //       setProductsError(err.message);
// //     } finally {
// //       setLoadingAnalysis(false);
// //       setLoadingProducts(false);
// //     }
// try {
//   // Analysis request
//   analyzeImage(selectedFile)
//     .then((analysisData) => {
//       const fullAnalysis = analysisData.analysis || "";

//       setDisplayAnalysis("");

//       let index = 0;

//       const timer = setInterval(() => {
//         index++;
//         setDisplayAnalysis(fullAnalysis.slice(0, index));

//         if (index >= fullAnalysis.length) {
//           clearInterval(timer);
//         }
//       }, 12);
//     })
//     .catch((err) => {
//       console.error(err);
//       setAnalysisError(err.message);
//     })
//     .finally(() => {
//       setLoadingAnalysis(false);
//     });

//   // Similar products request
//   getSimilarProducts(selectedFile)
//     .then((similarData) => {
//       setProducts(similarData.results || []);
//     })
//     .catch((err) => {
//       console.error(err);
//       setProductsError(err.message);
//     })
//     .finally(() => {
//       setLoadingProducts(false);
//     });

// } catch (err) {
//   console.error(err);
// }
//   };

//   processImage();
// }, [selectedFile]);

//   return (
//     <div className="min-h-screen flex bg-[#FCFCFC]">
//       <Sidebar
//         activeTab="styleStudio"
//         setActiveTab={() => {}}
//         handleLogout={handleLogout}
//       />

//       <main className="flex-1 lg:ml-[280px] px-5 md:px-8 lg:px-10 py-8 space-y-8">
//         <UploadCard
//           selectedFile={selectedFile}
//           setSelectedFile={setSelectedFile}
//           uploadedImage={uploadedImage}
//           setUploadedImage={setUploadedImage}
//           onUploadSuccess={(data) => {
//             setUploadedImage(data);
//           }}
//         />

//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           <AnalysisCard
//   analysis={displayAnalysis}
//   loading={loadingAnalysis}
//   error={analysisError}
// />

//           <SimilarProducts
//             products={products}
//             loading={loadingProducts}
//             error={productsError}
//           />
//         </div>
//       </main>
//     </div>
//   );
// }

// export default StyleStudio;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  analyzeImage,
  getSimilarProducts,
} from "./api";

import UploadCard from "./UploadCard";
import AnalysisCard from "./AnalysisCard";
import SimilarProducts from "./SimilarProducts";
import Sidebar from "../Dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GenderModal from "../../components/GenderModal";

function StyleStudio() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [displayAnalysis, setDisplayAnalysis] = useState("");
  const [products, setProducts] = useState([]);

  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [analysisError, setAnalysisError] = useState("");
  const [productsError, setProductsError] = useState("");
  const [userGender, setUserGender] = useState("");
  const [showGenderModal, setShowGenderModal] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const checkUserGender = async () => {
      try {
        const response = await fetch("https://fitzy-f7uv.onrender.com/api/v1/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const gender = data.gender || "";
          setUserGender(gender);
          if (!gender || (gender !== "Male" && gender !== "Female")) {
            setShowGenderModal(true);
          }
        }
      } catch (err) {
        console.error("Error checking user gender:", err);
      }
    };

    checkUserGender();
  }, [navigate]);

  const handleGenderSuccess = (gender) => {
    setUserGender(gender);
    setShowGenderModal(false);
  };

  useEffect(() => {
  if (!selectedFile) return;
  if (!userGender || (userGender !== "Male" && userGender !== "Female")) {
    setShowGenderModal(true);
    return;
  }

  const processImage = async () => {
    setLoadingAnalysis(true);
    setLoadingProducts(true);

    setProducts([]);

    setAnalysisError("");
    setProductsError("");

//     try {
//       const [analysisData, similarData] = await Promise.all([
//         analyzeImage(selectedFile),
//         getSimilarProducts(selectedFile),
//       ]);

//       const fullAnalysis = analysisData.analysis || "";

// setAnalysis(fullAnalysis);
// setDisplayAnalysis("");

// let index = 0;

// const timer = setInterval(() => {
//   index++;

//   setDisplayAnalysis(fullAnalysis.slice(0, index));

//   if (index >= fullAnalysis.length) {
//     clearInterval(timer);
//   }
// }, 12);

// setProducts(similarData.results || []);
//     } catch (err) {
//       console.error(err);

//       setAnalysisError(err.message);
//       setProductsError(err.message);
//     } finally {
//       setLoadingAnalysis(false);
//       setLoadingProducts(false);
//     }
try {
  // Analysis request
  analyzeImage(selectedFile)
    .then((analysisData) => {
      const fullAnalysis = analysisData.analysis || "";

      setDisplayAnalysis("");

      let index = 0;

      const timer = setInterval(() => {
        index++;
        setDisplayAnalysis(fullAnalysis.slice(0, index));

        if (index >= fullAnalysis.length) {
          clearInterval(timer);
        }
      }, 12);
    })
    .catch((err) => {
      console.error(err);
      setAnalysisError(err.message);
    })
    .finally(() => {
      setLoadingAnalysis(false);
    });

  // Similar products request
  getSimilarProducts(selectedFile)
    .then((similarData) => {
      setProducts(similarData.results || []);
    })
    .catch((err) => {
      console.error(err);
      setProductsError(err.message);
    })
    .finally(() => {
      setLoadingProducts(false);
    });

} catch (err) {
  console.error(err);
}
  };

  processImage();
}, [selectedFile]);

  return (
    <div className="h-screen bg-background overflow-hidden">
      <Sidebar handleLogout={handleLogout} />
      <GenderModal isOpen={showGenderModal} onSuccess={handleGenderSuccess} />

      <main className="lg:ml-[260px] h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <Card className="bg-card shadow-none border-0">
            <CardContent className="flex flex-col gap-4 p-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-red-600 dark:text-red-500">
                  Style Studio
                </h3>
                <p className="text-sm text-muted-foreground">
                  Analyze your outfit and discover similar recommendations.
                </p>
              </div>

            </CardContent>
          </Card>

          <UploadCard
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            onUploadSuccess={(data) => {
              setUploadedImage(data);
            }}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnalysisCard
              analysis={displayAnalysis}
              loading={loadingAnalysis}
              error={analysisError}
            />

            <SimilarProducts
              products={products}
              loading={loadingProducts}
              error={productsError}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default StyleStudio;
