import { FaBell } from "react-icons/fa";

function Header() {
  return (
    <div
      className="
      flex
      items-center
      justify-between
      mb-5
      "
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-black">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your virtual try-ons and saved looks.
        </p>
      </div>

      <button
        className="
        relative
        w-11
        h-11
        rounded-full
        border-2
        border-black
        bg-white
        flex
        items-center
        justify-center
        shadow-[4px_4px_0px_black]
        "
      >
        <FaBell />

        <span
          className="
          absolute
          top-1
          right-1
          w-2.5
          h-2.5
          rounded-full
          bg-orange-500
          "
        />
      </button>
    </div>
  );
}

export default Header;