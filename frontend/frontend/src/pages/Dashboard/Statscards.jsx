import {
  FaMagic,
  FaHeart,
  FaStore,
  FaChartLine,
} from "react-icons/fa";

function StatsCards() {
  const stats = [
    {
      title: "AI Try-Ons",
      value: "0",
      icon: <FaMagic />,
      bg: "bg-orange-100",
    },
    {
      title: "Saved Looks",
      value: "0",
      icon: <FaHeart />,
      bg: "bg-pink-100",
    },
    {
      title: "Connected Stores",
      value: "0",
      icon: <FaStore />,
      bg: "bg-yellow-100",
    },
    {
      title: "Match Rate",
      value: "0%",
      icon: <FaChartLine />,
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

      {stats.map((item, index) => (
        <div
          key={index}
          className="
          bg-white
          border-2
          border-black
          rounded-2xl
          p-4
          shadow-[5px_5px_0px_black]
          "
        >

          <div
            className={`
              w-11
              h-11
              rounded-xl
              border-2
              border-black
              flex
              items-center
              justify-center
              text-sm
              ${item.bg}
            `}
          >
            {item.icon}
          </div>

          <h3 className="text-gray-500 text-sm mt-3">
            {item.title}
          </h3>

          <p className="text-2xl font-black mt-1">
            {item.value}
          </p>

        </div>
      ))}

    </div>
  );
}

export default StatsCards;