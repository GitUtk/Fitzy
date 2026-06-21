import { Link } from "react-router-dom";
import {
  FaHome,
  FaTshirt,
  FaHeart,
  FaBookmark,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaCrown,
} from "react-icons/fa";

function Sidebar({ handleLogout }) {
  const menuItems = [
    {
      icon: <FaHome />,
      label: "Dashboard",
      path: "/dashboard",
      active: true,
    },
    {
      icon: <FaTshirt />,
      label: "Try On",
      path: "/tryon",
    },
    {
      icon: <FaHeart />,
      label: "My Looks",
      path: "/looks",
    },
    {
      icon: <FaBookmark />,
      label: "Saved",
      path: "/saved",
    },
    {
      icon: <FaUser />,
      label: "Profile",
      path: "/profile",
    },
    {
      icon: <FaCog />,
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <aside
      className="
      hidden lg:flex
      flex-col
      justify-between
      w-[230px]
      min-h-screen
      bg-white
      border-r-2
      border-black
      p-5
      "
    >
      <div>
        <h1 className="text-3xl font-black mb-10">
          FITZY
          <span className="text-orange-500">.</span>
        </h1>

        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
            >
              <button
                className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                transition
                text-sm
                font-medium
                mb-2

                ${
                  item.active
                    ? "bg-orange-100 border-2 border-black"
                    : "hover:bg-orange-50"
                }
                `}
              >
                {item.icon}
                {item.label}
              </button>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div
          className="
          bg-[#FFF7ED]
          border-2
          border-black
          rounded-2xl
          p-4
          shadow-[5px_5px_0px_black]
          "
        >
          <div
            className="
            w-12
            h-12
            rounded-full
            bg-orange-500
            text-white
            flex
            items-center
            justify-center
            text-lg
            "
          >
            <FaCrown />
          </div>

          <h3 className="font-bold mt-3">
            Premium
          </h3>

          <p className="text-xs text-gray-600 mt-1">
            Unlimited try-ons and advanced outfit recommendations.
          </p>

          <button
            className="
            mt-4
            w-full
            bg-orange-500
            text-white
            py-2
            rounded-xl
            border-2
            border-black
            text-sm
            font-semibold
            "
          >
            Upgrade
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="
          mt-5
          flex
          items-center
          gap-3
          text-red-500
          font-semibold
          "
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;