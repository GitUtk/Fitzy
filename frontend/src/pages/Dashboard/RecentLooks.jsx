import { FaImages } from "react-icons/fa";

function RecentLooks() {
  const looks = [];

  return (
    <div
      className="
      bg-white
      border-2
      border-black
      rounded-2xl
      p-5
      shadow-[5px_5px_0px_black]
      "
    >
      <h2 className="text-xl font-black">
        Recent Looks
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Your generated outfits will appear here.
      </p>

      {looks.length === 0 ? (
        <div
          className="
          mt-6
          border-2
          border-dashed
          border-gray-300
          rounded-xl
          p-10
          text-center
          "
        >
          <FaImages className="mx-auto text-4xl text-gray-300" />

          <h3 className="mt-4 font-semibold text-gray-700">
            No Looks Yet
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Upload a photo and try your first outfit.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {looks.map((look) => (
            <div key={look.id}>
              {/* render real looks here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentLooks;