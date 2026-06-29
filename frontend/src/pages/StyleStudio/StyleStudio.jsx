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

function StyleStudio() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysis, setAnalysis] = useState("");
const [products, setProducts] = useState([]);

const [loadingAnalysis, setLoadingAnalysis] = useState(false);
const [loadingProducts, setLoadingProducts] = useState(false);

const [analysisError, setAnalysisError] = useState("");
const [productsError, setProductsError] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
  if (!selectedFile) return;

  const processImage = async () => {
    setLoadingAnalysis(true);
    setLoadingProducts(true);

    setAnalysis("");
    setProducts([]);

    setAnalysisError("");
    setProductsError("");

    try {
      const [analysisData, similarData] = await Promise.all([
        analyzeImage(selectedFile),
        getSimilarProducts(selectedFile),
      ]);

      setAnalysis(analysisData.analysis || "");

      setProducts(similarData.results || []);
    } catch (err) {
      console.error(err);

      setAnalysisError(err.message);
      setProductsError(err.message);
    } finally {
      setLoadingAnalysis(false);
      setLoadingProducts(false);
    }
  };

  processImage();
}, [selectedFile]);

  return (
    <div className="min-h-screen flex bg-[#FCFCFC]">
      <Sidebar
        activeTab="styleStudio"
        setActiveTab={() => {}}
        handleLogout={handleLogout}
      />

      <main className="flex-1 lg:ml-[280px] px-5 md:px-8 lg:px-10 py-8 space-y-8">
        <UploadCard
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          onUploadSuccess={(data) => {
            setUploadedImage(data);
          }}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <AnalysisCard
            analysis={analysis}
            loading={loadingAnalysis}
            error={analysisError}
          />

          <SimilarProducts
            products={products}
            loading={loadingProducts}
            error={productsError}
          />
        </div>
      </main>
    </div>
  );
}

export default StyleStudio;