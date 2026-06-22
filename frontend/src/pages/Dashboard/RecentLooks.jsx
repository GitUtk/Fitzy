import { FaImages, FaSpinner, FaCalendarAlt } from "react-icons/fa";

function RecentLooks({ looks = [], loading = false }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div
      className="
      bg-white
      border-2
      border-black
      rounded-2xl
      p-5
      shadow-[5px_5px_0px_black]
      flex
      flex-col
      h-[400px]
      "
    >
      <div>
        <h2 className="text-xl font-black">Recent Looks</h2>
        <p className="text-sm text-gray-500 mt-1">
          Your uploaded and generated outfits will appear here.
        </p>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        {loading && looks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-10">
            <FaSpinner className="animate-spin text-orange-500 text-3xl" />
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Loading looks...
            </p>
          </div>
        ) : looks.length === 0 ? (
          <div
            className="
            h-[230px]
            border-2
            border-dashed
            border-gray-300
            rounded-xl
            p-6
            text-center
            flex
            flex-col
            items-center
            justify-center
            bg-gray-50/50
            "
          >
            <FaImages className="text-4xl text-gray-300" />
            <h3 className="mt-3 font-bold text-gray-700">No Looks Yet</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
              Upload a fashion photo to see it in your history.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {looks.map((look) => (
              <div
                key={look.id}
                className="
                group
                relative
                bg-white
                border-2
                border-black
                rounded-xl
                overflow-hidden
                shadow-[2px_2px_0px_black]
                hover:shadow-[4px_4px_0px_black]
                hover:-translate-x-[1px]
                hover:-translate-y-[1px]
                transition-all
                duration-200
                "
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={look.image_url}
                    alt="Look"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-2 border-t-2 border-black bg-white flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold">
                  <FaCalendarAlt className="shrink-0 text-orange-500" />
                  <span className="truncate">{formatDate(look.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentLooks;