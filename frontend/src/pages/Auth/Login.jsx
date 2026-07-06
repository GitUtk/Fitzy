// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       navigate("/dashboard");
//     }
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};

//     if (!form.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (
//       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
//     ) {
//       newErrors.email = "Enter a valid email address";
//     }

//     if (!form.password) {
//       newErrors.password = "Password is required";
//     } else if (form.password.length < 6) {
//       newErrors.password =
//         "Password must be at least 6 characters";
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setApiError("");

//     const validationErrors = validate();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setErrors({});
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "https://fitzy-f7uv.onrender.com/api/v1/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type":
//               "application/x-www-form-urlencoded",
//           },
//           body: new URLSearchParams({
//             username: form.email,
//             password: form.password,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem(
//           "token",
//           data.access_token
//         );

//         navigate("/dashboard");
//       } else {
//         setApiError(
//           data.detail || "Invalid email or password"
//         );
//       }
//     } catch (error) {
//       console.log(error);
//       setApiError("Server error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center px-4">

//       <form
//         onSubmit={handleSubmit}
//         className="
//         w-full
//         max-w-md
//         bg-white
//         border-2
//         border-black
//         rounded-3xl
//         p-8
//         shadow-[8px_8px_0px_black]
//         "
//       >
//         <h1 className="text-4xl font-black text-center">
//           Welcome Back
//         </h1>

//         <p className="text-center text-gray-500 mt-2 mb-8">
//           Login to your Fitzy account
//         </p>

//         {apiError && (
//           <div className="mb-4 bg-red-100 border border-red-500 text-red-600 p-3 rounded-xl">
//             {apiError}
//           </div>
//         )}

//         <div className="mb-5">
//           <label className="font-semibold">
//             Email *
//           </label>

//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="w-full mt-2 border-2 border-black rounded-xl p-3 outline-none focus:border-orange-500 transition"
//             value={form.email}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 email: e.target.value,
//               })
//             }
//           />

//           {errors.email && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.email}
//             </p>
//           )}
//         </div>

//         <div>
//           <label className="font-semibold">
//             Password *
//           </label>

//           <input
//             type="password"
//             placeholder="Enter your password"
//             className="w-full mt-2 border-2 border-black rounded-xl p-3 outline-none focus:border-orange-500 transition"
//             value={form.password}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 password: e.target.value,
//               })
//             }
//           />

//           {errors.password && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.password}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="
//           mt-6
//           w-full
//           bg-orange-500
//           text-white
//           py-3
//           rounded-xl
//           border-2
//           border-black
//           font-bold
//           shadow-[4px_4px_0px_black]
//           hover:translate-x-[2px]
//           hover:translate-y-[2px]
//           hover:shadow-none
//           transition-all
//           disabled:opacity-50
//           disabled:cursor-not-allowed
//           "
//         >
//           {loading ? "Logging In..." : "Login"}
//         </button>

//         <p className="text-center mt-6">
//           Don't have an account?{" "}
//           <Link
//             to="/register"
//             className="text-orange-500 font-bold"
//           >
//             Sign Up
//           </Link>
//         </p>
//       </form>

//     </div>
//   );
// }

// export default Login;
// import { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       navigate("/dashboard");
//     }
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};

//     if (!form.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (
//       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
//     ) {
//       newErrors.email = "Enter a valid email address";
//     }

//     if (!form.password) {
//       newErrors.password = "Password is required";
//     } else if (form.password.length < 6) {
//       newErrors.password =
//         "Password must be at least 6 characters";
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setApiError("");

//     const validationErrors = validate();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setErrors({});
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "https://fitzy-f7uv.onrender.com/api/v1/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type":
//               "application/x-www-form-urlencoded",
//           },
//           body: new URLSearchParams({
//             username: form.email,
//             password: form.password,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem(
//           "token",
//           data.access_token
//         );

//         navigate("/dashboard");
//       } else {
//         setApiError(
//           data.detail || "Invalid email or password"
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       setApiError("Server error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center px-4">

//       <form
//         onSubmit={handleSubmit}
//         className="
//         w-full
//         max-w-md
//         bg-white
//         border-2
//         border-black
//         rounded-3xl
//         p-8
//         shadow-[8px_8px_0px_black]
//         "
//       >
//         <h1 className="text-4xl font-black text-center">
//           Welcome Back
//         </h1>

//         <p className="text-center text-gray-500 mt-2 mb-8">
//           Login to your Fitzy account
//         </p>

//         {apiError && (
//           <div className="mb-4 bg-red-100 border border-red-500 text-red-600 p-3 rounded-xl">
//             {apiError}
//           </div>
//         )}

//         <div className="mb-5">
//           <label className="font-semibold">
//             Email *
//           </label>

//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="w-full mt-2 border-2 border-black rounded-xl p-3 outline-none focus:border-orange-500 transition"
//             value={form.email}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 email: e.target.value,
//               })
//             }
//           />

//           {errors.email && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.email}
//             </p>
//           )}
//         </div>

//         <div>
//           <label className="font-semibold">
//             Password *
//           </label>

//           <input
//             type="password"
//             placeholder="Enter your password"
//             className="w-full mt-2 border-2 border-black rounded-xl p-3 outline-none focus:border-orange-500 transition"
//             value={form.password}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 password: e.target.value,
//               })
//             }
//           />

//           {errors.password && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.password}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="
//           mt-6
//           w-full
//           bg-orange-500
//           text-white
//           py-3
//           rounded-xl
//           border-2
//           border-black
//           font-bold
//           shadow-[4px_4px_0px_black]
//           hover:translate-x-[2px]
//           hover:translate-y-[2px]
//           hover:shadow-none
//           transition-all
//           disabled:opacity-50
//           disabled:cursor-not-allowed
//           "
//         >
//           {loading ? "Logging In..." : "Login"}
//         </button>

//         <p className="text-center mt-6">
//           Don't have an account?{" "}
//           <Link
//             to="/register"
//             className="text-orange-500 font-bold"
//           >
//             Sign Up
//           </Link>
//         </p>
//       </form>

//     </div>
//   );
// }

// export default Login;
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(
        "https://fitzy-f7uv.onrender.com/api/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: form.email,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "token",
          data.access_token
        );

        navigate("/dashboard");
      } else {
        setApiError(
          data.detail || "Invalid email or password"
        );
      }
    } catch (error) {
      console.error(error);
      setApiError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center px-4">

      <form
        onSubmit={handleSubmit}
        className="
        w-full
        max-w-md
        bg-white
        border-2
        border-black
        rounded-3xl
        p-8
        shadow-[8px_8px_0px_black]
        "
      >
        <h1 className="text-4xl font-black text-center">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Login to your Fitzy account
        </p>

        {apiError && (
          <div className="mb-4 bg-red-100 border border-red-500 text-red-600 p-3 rounded-xl">
            {apiError}
          </div>
        )}

        <div className="mb-5">
          <label className="font-semibold">
            Email *
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-2 border-2 border-black rounded-xl p-3 outline-none focus:border-[#8B5CF6] transition"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="font-semibold">
            Password *
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full mt-2 border-2 border-black rounded-xl p-3 outline-none focus:border-[#8B5CF6] transition"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
          mt-6
          w-full
          bg-[#8B5CF6] hover:bg-[#D946EF]
          text-white
          py-3
          rounded-xl
          border-2
          border-black
          font-bold
          shadow-[4px_4px_0px_black]
          hover:translate-x-[2px]
          hover:translate-y-[2px]
          hover:shadow-none
          transition-all
          disabled:opacity-50
          disabled:cursor-not-allowed
          "
        >
          {loading ? "Logging In..." : "Login"}
        </button>

        <p className="text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#8B5CF6] font-bold"
          >
            Sign Up
          </Link>
        </p>
      </form>

    </div>
  );
}

export default Login;