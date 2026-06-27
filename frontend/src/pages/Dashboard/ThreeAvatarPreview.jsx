import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { FaImage, FaCloudUploadAlt, FaMagic } from "react-icons/fa";

const ThreeAvatarPreview = () => {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [bodyType, setBodyType] = useState("M");
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Mannequin parts
    const material = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.6, metalness: 0.1 });

    // Body (Capsule)
    const bodyGeometry = new THREE.CapsuleGeometry(1, 3, 4, 8);
    const bodyMesh = new THREE.Mesh(bodyGeometry, material);
    bodyMesh.position.y = 1.5;

    // Head (Sphere)
    const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const headMesh = new THREE.Mesh(headGeometry, material);
    headMesh.position.y = 4.2;

    // Add to scene
    scene.add(bodyMesh);
    scene.add(headMesh);

    camera.position.z = 8;
    camera.position.y = 2;

    // Controls for rotation
    let rotationSpeed = 0.01;

    const animate = () => {
      requestAnimationFrame(animate);
      bodyMesh.rotation.y += rotationSpeed;
      headMesh.rotation.y += rotationSpeed;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      container.removeChild(renderer.domElement);
    };
  }, []);

  // Adjust mannequin scale based on bodyType
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = container.children[0]?.__threeObj?.scene;
    // Since we don't store scene in ref, we cannot directly access meshes here.
    // We will instead scale the container's canvas for a quick visual effect.
    if (container.children[0]) {
      switch (bodyType) {
        case "M":
          container.children[0].style.transform = "scale(1)";
          break;
        case "L":
          container.children[0].style.transform = "scale(1.1)";
          break;
        case "XL":
          container.children[0].style.transform = "scale(1.2)";
          break;
        default:
          container.children[0].style.transform = "scale(1)";
      }
    }
  }, [bodyType]);

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        // Upload file to fitzy API
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bodyType", bodyType);

        const response = await fetch("https://fitzy-f7uv.onrender.com/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data && data.imageUrl) {
          setPreview(data.imageUrl);
        } else {
          alert("Upload failed. Try again.");
        }
      } catch (error) {
        console.error(error);
        alert("Error uploading file.");
      }
      setUploading(false);
    }
  };

  const generateLook = () => {
    if (!preview) {
      alert("Please upload a photo first.");
      return;
    }
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert("AI Generated Look!");
    }, 2000);
  };

  return (
<div className="min-h-screen bg-white flex items-center justify-center p-6">      {/* Black workspace panel on right ~75% width */}
      <div
  className="
    relative
    bg-black
    rounded-[48px]
    w-[88vw]
    h-[82vh]
    overflow-hidden
    shadow-2xl
  "
>
        {/* Three.js container fills entire panel */}
        <div ref={containerRef} className="absolute inset-0" />

        {/* Trending card top-left */}
        <div className="absolute top-6 left-6 bg-white rounded-2xl p-4 w-40 shadow-lg z-20">
          <h2 className="text-lg font-bold text-black">Trending</h2>
        </div>

        {/* Body Type card top-right */}
        {/* <div className="absolute top-6 right-6 bg-white rounded-2xl p-4 w-44 shadow-lg z-20">
          <p className="text-xs font-black uppercase tracking-widest text-gray-700">
            BODY TYPE
          </p>
          <div className="mt-3 flex justify-center gap-3">
            {["M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => setBodyType(size)}
                className={`h-10 w-10 rounded-2xl border transition ${
                  bodyType === size
                    ? "bg-[#CCFF00] border-[#CCFF00] text-black"
                    : "bg-gray-100 border-gray-300 text-gray-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div> */}

        
      

        {/* Bottom-left buttons */}
        <div className="absolute bottom-6 left-6 flex gap-4 z-20">
          <button
            onClick={generateLook}
            disabled={uploading}
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#CCFF00] px-6 font-black text-black shadow-md transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMagic />
            {uploading ? "Generating..." : "STYLE ME AI"}
          </button>
          <button
            onClick={handleChooseFile}
            disabled={uploading}
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 font-bold text-black shadow-md transition hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCloudUploadAlt />
            SCAN ITEM
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Bottom-right LIVE RENDER FPS card */}
        <div className="absolute bottom-6 right-6 bg-gray-900 bg-opacity-90 rounded-lg px-4 py-2 text-xs font-mono text-white shadow-md z-20">
          {/* LIVE RENDER FPS */}
        </div>
      </div>
    </div>
  );
};

export default ThreeAvatarPreview;