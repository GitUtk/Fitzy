import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] p-6">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-3xl font-black">
          FITZY
          <span className="text-orange-500">.</span>
        </h1>

        <button
          onClick={handleLogout}
          className="
          bg-red-500
          text-white
          px-5
          py-2
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
          Logout
        </button>

      </div>

      {/* Dashboard Card */}
      <div
        className="
        max-w-5xl
        mx-auto
        bg-white
        border-2
        border-black
        rounded-[30px]
        p-10
        shadow-[10px_10px_0px_black]
        "
      >
        <h2 className="text-5xl font-black mb-3">
          Welcome to Fitzy 👋
        </h2>

        <p className="text-gray-600 text-lg">
          Your AI Fashion Dashboard is ready.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-6">

          <div className="border-2 border-black rounded-2xl p-6">
            <h3 className="font-bold text-xl">
              Uploaded Photos
            </h3>

            <p className="text-4xl font-black mt-3">
              0
            </p>
          </div>

          <div className="border-2 border-black rounded-2xl p-6">
            <h3 className="font-bold text-xl">
              Outfit Trials
            </h3>

            <p className="text-4xl font-black mt-3">
              0
            </p>
          </div>

          <div className="border-2 border-black rounded-2xl p-6">
            <h3 className="font-bold text-xl">
              Saved Looks
            </h3>

            <p className="text-4xl font-black mt-3">
              0
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;