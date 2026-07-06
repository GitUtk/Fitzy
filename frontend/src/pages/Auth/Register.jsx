// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     let newErrors = {};

//     if (!formData.fullName.trim()) {
//       newErrors.fullName = "Full Name is required";
//     } else if (formData.fullName.length < 3) {
//       newErrors.fullName =
//         "Name must be at least 3 characters";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (
//       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
//         formData.email
//       )
//     ) {
//       newErrors.email = "Enter a valid email";
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = "Phone Number is required";
//     } else if (!/^[0-9]{10}$/.test(formData.phone)) {
//       newErrors.phone =
//         "Phone number must be exactly 10 digits";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password =
//         "Password must be at least 6 characters";
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword =
//         "Confirm Password is required";
//     } else if (
//       formData.password !== formData.confirmPassword
//     ) {
//       newErrors.confirmPassword =
//         "Passwords do not match";
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   const validationErrors = validate();

//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   setErrors({});

//   try {
//     const response = await fetch(
//       "https://fitzy-f7uv.onrender.com/api/v1/register",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       }
//     );

//     const data = await response.json();

//     if (response.ok) {

//   const loginResponse = await fetch(
//     "https://fitzy-f7uv.onrender.com/api/v1/login",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type":
//           "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         username: formData.email,
//         password: formData.password,
//       }),
//     }
//   );

//   const loginData = await loginResponse.json();

//   if (loginResponse.ok) {
//     localStorage.setItem(
//       "token",
//       loginData.access_token
//     );

//     navigate("/dashboard");
//   }
// } else {
//       alert(data.detail || "Registration failed");
//     }
//   } catch (error) {
//     console.error(error);
//     alert("Server error. Please try again.");
//   }
// };

//   return (
//     <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center px-4 py-10">

//       <form
//         onSubmit={handleSubmit}
//         className="
//         w-full
//         max-w-md
//         bg-white
//         border-2
//         border-black
//         rounded-[30px]
//         p-8
//         shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
//         "
//       >
//         <h1 className="text-4xl font-black text-center mb-2">
//           Create Account
//         </h1>

//         <p className="text-center text-gray-500 mb-8">
//           Start your AI styling journey
//         </p>

//         <div className="space-y-4">

//           {/* Full Name */}
//           <div>
//             <label className="font-semibold block mb-2">
//               Full Name *
//             </label>

//             <input
//               type="text"
//               placeholder="Enter your name"
//               value={formData.fullName}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   fullName: e.target.value,
//                 })
//               }
//               className="
//               w-full
//               px-4
//               py-3
//               border-2
//               border-black
//               rounded-xl
//               outline-none
//               "
//             />

//             {errors.fullName && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.fullName}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="font-semibold block mb-2">
//               Email *
//             </label>

//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   email: e.target.value,
//                 })
//               }
//               className="
//               w-full
//               px-4
//               py-3
//               border-2
//               border-black
//               rounded-xl
//               outline-none
//               "
//             />

//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.email}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="font-semibold block mb-2">
//               Phone Number *
//             </label>

//             <input
//               type="tel"
//               placeholder="9876543210"
//               value={formData.phone}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   phone: e.target.value,
//                 })
//               }
//               className="
//               w-full
//               px-4
//               py-3
//               border-2
//               border-black
//               rounded-xl
//               outline-none
//               "
//             />

//             {errors.phone && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.phone}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="font-semibold block mb-2">
//               Password *
//             </label>

//             <input
//               type="password"
//               placeholder="Minimum 6 characters"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   password: e.target.value,
//                 })
//               }
//               className="
//               w-full
//               px-4
//               py-3
//               border-2
//               border-black
//               rounded-xl
//               outline-none
//               "
//             />

//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.password}
//               </p>
//             )}
//           </div>

//           <div>
//             <label className="font-semibold block mb-2">
//               Confirm Password *
//             </label>

//             <input
//               type="password"
//               placeholder="Re-enter password"
//               value={formData.confirmPassword}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   confirmPassword: e.target.value,
//                 })
//               }
//               className="
//               w-full
//               px-4
//               py-3
//               border-2
//               border-black
//               rounded-xl
//               outline-none
//               "
//             />

//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="
//             w-full
//             mt-2
//             bg-orange-500
//             text-white
//             py-3
//             rounded-xl
//             border-2
//             border-black
//             font-bold
//             shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
//             hover:translate-x-[2px]
//             hover:translate-y-[2px]
//             hover:shadow-none
//             transition-all
//             "
//           >
//             Sign Up
//           </button>
//         </div>

//         <p className="text-center mt-6">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="text-orange-500 font-bold"
//           >
//             Login
//           </Link>
//         </p>
//       </form>

//     </div>
//   );
// }

// export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName =
        "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.email
      )
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone number must be exactly 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Confirm Password is required";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setErrors({});

  try {
    const response = await fetch(
      "https://fitzy-f7uv.onrender.com/api/v1/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {

  const loginResponse = await fetch(
    "https://fitzy-f7uv.onrender.com/api/v1/login",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: formData.email,
        password: formData.password,
      }),
    }
  );

  const loginData = await loginResponse.json();

  if (loginResponse.ok) {
    localStorage.setItem(
      "token",
      loginData.access_token
    );

    navigate("/dashboard");
  }
} else {
      alert(data.detail || "Registration failed");
    }
  } catch (error) {
    console.error(error);
    alert("Server error. Please try again.");
  }
};

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center px-4 py-10">

      <form
        onSubmit={handleSubmit}
        className="
        w-full
        max-w-md
        bg-white
        border-2
        border-black
        rounded-[30px]
        p-8
        shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
        "
      >
        <h1 className="text-4xl font-black text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Start your AI styling journey
        </p>

        <div className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="font-semibold block mb-2">
              Full Name *
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fullName: e.target.value,
                })
              }
              className="
              w-full
              px-4
              py-3
              border-2
              border-black
              rounded-xl
              outline-none
              "
            />

            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="font-semibold block mb-2">
              Email *
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="
              w-full
              px-4
              py-3
              border-2
              border-black
              rounded-xl
              outline-none
              "
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="font-semibold block mb-2">
              Phone Number *
            </label>

            <input
              type="tel"
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              className="
              w-full
              px-4
              py-3
              border-2
              border-black
              rounded-xl
              outline-none
              "
            />

            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="font-semibold block mb-2">
              Password *
            </label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="
              w-full
              px-4
              py-3
              border-2
              border-black
              rounded-xl
              outline-none
              "
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="font-semibold block mb-2">
              Confirm Password *
            </label>

            <input
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              className="
              w-full
              px-4
              py-3
              border-2
              border-black
              rounded-xl
              outline-none
              "
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="
            w-full
            mt-2
            bg-[#8B5CF6] hover:bg-[#D946EF]
            text-white
            py-3
            rounded-xl
            border-2
            border-black
            font-bold
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[2px]
            hover:translate-y-[2px]
            hover:shadow-none
            transition-all
            "
          >
            Sign Up
          </button>
        </div>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#8B5CF6] font-bold"
          >
            Login
          </Link>
        </p>
      </form>

    </div>
  );
}

export default Register;