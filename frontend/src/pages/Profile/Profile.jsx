import { useState } from "react";

function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
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

  const stylesList = [
    "Casual",
    "Streetwear",
    "Minimal",
    "Formal",
    "Ethnic",
    "Korean",
    "Y2K",
    "Luxury",
  ];

  const colorsList = [
    "Black",
    "White",
    "Beige",
    "Brown",
    "Blue",
    "Pink",
    "Green",
    "Red",
  ];

  const handleStyleChange = (style) => {
    if (profile.styles.includes(style)) {
      setProfile({
        ...profile,
        styles: profile.styles.filter((s) => s !== style),
      });
    } else {
      setProfile({
        ...profile,
        styles: [...profile.styles, style],
      });
    }
  };

  const handleColorChange = (color) => {
    if (profile.colors.includes(color)) {
      setProfile({
        ...profile,
        colors: profile.colors.filter((c) => c !== color),
      });
    } else {
      setProfile({
        ...profile,
        colors: [...profile.colors, color],
      });
    }
  };

  const handleSave = () => {
    console.log(profile);
    alert("Profile Saved Successfully");
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] p-4 md:p-8">

      <div
        className="
        max-w-5xl
        mx-auto
        bg-white
        border-2
        border-black
        rounded-3xl
        p-6 md:p-10
        shadow-[8px_8px_0px_black]
        "
      >
        <h1 className="text-3xl md:text-4xl font-black">
          My Fashion Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Help Fitzy personalize your outfit recommendations.
        </p>

        {/* BASIC INFO */}

        <div className="mt-8">
          <h2 className="text-2xl font-black mb-4">
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Full Name"
              className="border-2 border-black rounded-xl p-3"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  fullName: e.target.value,
                })
              }
            />

            <input
              placeholder="Email"
              className="border-2 border-black rounded-xl p-3"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone Number"
              className="border-2 border-black rounded-xl p-3"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  phone: e.target.value,
                })
              }
            />

            <input
              placeholder="Age"
              className="border-2 border-black rounded-xl p-3"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  age: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* BODY */}

        <div className="mt-8">
          <h2 className="text-2xl font-black mb-4">
            Body Profile
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <select
              className="border-2 border-black rounded-xl p-3"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  gender: e.target.value,
                })
              }
            >
              <option>Gender</option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>

            <input
              placeholder="Height (cm)"
              className="border-2 border-black rounded-xl p-3"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  height: e.target.value,
                })
              }
            />

            <select
              className="border-2 border-black rounded-xl p-3"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  bodyType: e.target.value,
                })
              }
            >
              <option>Body Type</option>
              <option>Slim</option>
              <option>Athletic</option>
              <option>Curvy</option>
              <option>Plus Size</option>
            </select>

          </div>
        </div>

        {/* STYLE */}

        <div className="mt-8">
          <h2 className="text-2xl font-black mb-4">
            Favorite Styles
          </h2>

          <div className="flex flex-wrap gap-3">
            {stylesList.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() =>
                  handleStyleChange(style)
                }
                className={`
                px-4 py-2 rounded-xl border-2 border-black
                ${
                  profile.styles.includes(style)
                    ? "bg-orange-500 text-white"
                    : "bg-white"
                }
                `}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* COLORS */}

        <div className="mt-8">
          <h2 className="text-2xl font-black mb-4">
            Favorite Colors
          </h2>

          <div className="flex flex-wrap gap-3">
            {colorsList.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  handleColorChange(color)
                }
                className={`
                px-4 py-2 rounded-xl border-2 border-black
                ${
                  profile.colors.includes(color)
                    ? "bg-orange-500 text-white"
                    : "bg-white"
                }
                `}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* BUDGET */}

        <div className="mt-8">
          <h2 className="text-2xl font-black mb-4">
            Budget Range
          </h2>

          <select
            className="border-2 border-black rounded-xl p-3 w-full"
            onChange={(e) =>
              setProfile({
                ...profile,
                budget: e.target.value,
              })
            }
          >
            <option>Select Budget</option>
            <option>Under ₹1000</option>
            <option>₹1000 - ₹3000</option>
            <option>₹3000 - ₹5000</option>
            <option>₹5000+</option>
          </select>
        </div>

        {/* SIZES */}

        <div className="mt-8">
          <h2 className="text-2xl font-black mb-4">
            Sizes
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <select
              className="border-2 border-black rounded-xl p-3"
            >
              <option>Top Size</option>
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>

            <select
              className="border-2 border-black rounded-xl p-3"
            >
              <option>Bottom Size</option>
              <option>28</option>
              <option>30</option>
              <option>32</option>
              <option>34</option>
              <option>36</option>
            </select>

            <input
              placeholder="Shoe Size"
              className="border-2 border-black rounded-xl p-3"
            />

          </div>
        </div>

        {/* SAVE BUTTON */}

        <button
          onClick={handleSave}
          className="
          mt-10
          w-full
          bg-orange-500
          text-white
          py-4
          rounded-xl
          border-2
          border-black
          font-bold
          shadow-[4px_4px_0px_black]
          hover:translate-x-[2px]
          hover:translate-y-[2px]
          hover:shadow-none
          transition-all
          "
        >
          Save Preferences
        </button>

      </div>
    </div>
  );
}

export default Profile;