import { useState, useEffect, useRef } from "react";

const WARDROBE_KEY = "wardrobeItems";

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"];
const UPLOAD_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

const OUTFIT_SUGGESTIONS = [
  {
    title: "Casual Day Out",
    description: "Mix your tops with bottoms for a relaxed everyday look.",
    icon: "wb_sunny",
    color: "#8B5CF6",
  },
  {
    title: "Work Ready",
    description: "Pair outerwear with formal tops for a professional vibe.",
    icon: "work",
    color: "#D946EF",
  },
  {
    title: "Weekend Brunch",
    description: "Light layers and accessories for a chic weekend feel.",
    icon: "local_cafe",
    color: "#F59E0B",
  },
  {
    title: "Evening Glam",
    description: "Dress up your wardrobe pieces for a night out.",
    icon: "nightlife",
    color: "#EC4899",
  },
];

function MyWardrobe() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [dragOver, setDragOver] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Pending items waiting for user to tag before saving
  const [pendingItems, setPendingItems] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(WARDROBE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem(WARDROBE_KEY, JSON.stringify(newItems));
  };

  // Read files → open tagging modal (no category defaulted to Tops)
  const processFiles = (files) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!validFiles.length) return;

    const readers = validFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: `wardrobe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              src: e.target.result,
              name: file.name.replace(/\.[^/.]+$/, ""),
              category: "", // no default — user must pick
              size: file.size,
              addedAt: new Date().toISOString(),
            });
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((newPending) => {
      setPendingItems(newPending);
    });
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  // Called from the tagging modal
  const handleConfirmPending = (taggedItems) => {
    const updated = [...items, ...taggedItems];
    saveItems(updated);
    setPendingItems([]);
  };

  const handleDelete = (id) => {
    const updated = items.filter((item) => item.id !== id);
    saveItems(updated);
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleCategoryChange = (id, category) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, category } : item
    );
    saveItems(updated);
    if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, category });
  };

  const handleRename = (id, name) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, name } : item
    );
    saveItems(updated);
    if (selectedItem?.id === id) setSelectedItem({ ...selectedItem, name });
  };

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-black">My Wardrobe</h2>
          <p className="text-gray-500 mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} saved · Upload clothes to get AI outfit suggestions
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#EFE7FF] text-[#8B5CF6] border-2 border-[#8B5CF6] rounded-xl font-bold hover:bg-[#8B5CF6] hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Outfit Ideas
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8B5CF6] text-white rounded-xl font-bold hover:bg-[#7C3AED] transition-all shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)]"
          >
            <span className="material-symbols-outlined text-sm">upload</span>
            Upload Clothes
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* AI Outfit Suggestions Panel */}
      {showSuggestions && (
        <div className="mb-8 bg-gradient-to-br from-[#EFE7FF] to-[#FDF4FF] border-2 border-[#8B5CF6] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#8B5CF6]">auto_awesome</span>
            <h3 className="text-lg font-black text-black">
              AI Outfit Suggestions
              {items.length === 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Upload clothes to get personalized suggestions)
                </span>
              )}
            </h3>
          </div>

          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Add some clothes to your wardrobe first and we'll suggest outfits based on what you own!
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-5">
                Based on your {items.length} wardrobe item{items.length !== 1 ? "s" : ""}, here are some outfit ideas:
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {OUTFIT_SUGGESTIONS.map((suggestion, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 border border-purple-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: suggestion.color + "20" }}
                    >
                      <span
                        className="material-symbols-outlined text-lg"
                        style={{ color: suggestion.color }}
                      >
                        {suggestion.icon}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-black mb-1">{suggestion.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{suggestion.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {items.slice(0, 3).map((item) => (
                        <img
                          key={item.id}
                          src={item.src}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover border border-purple-100"
                        />
                      ))}
                      {items.length > 3 && (
                        <div className="w-8 h-8 rounded-lg bg-[#EFE7FF] flex items-center justify-center text-xs font-bold text-[#8B5CF6]">
                          +{items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Empty State Drop Zone */}
      {items.length === 0 ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-[#8B5CF6] bg-[#EFE7FF]"
              : "border-gray-300 bg-white hover:border-[#8B5CF6] hover:bg-[#FAF8FF]"
          }`}
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#EFE7FF] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-4xl text-[#8B5CF6]">add_photo_alternate</span>
          </div>
          <h3 className="text-xl font-black text-black mb-2">Upload Your Clothes</h3>
          <p className="text-gray-500 text-sm mb-4">
            Drag & drop images here, or click to browse
          </p>
          <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP · Multiple files allowed</p>
        </div>
      ) : (
        <>
          {/* Drop Bar */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mb-6 border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
              dragOver
                ? "border-[#8B5CF6] bg-[#EFE7FF]"
                : "border-gray-200 bg-white hover:border-[#8B5CF6] hover:bg-[#FAF8FF]"
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-gray-400 hover:text-[#8B5CF6] transition-colors">
              <span className="material-symbols-outlined">add_photo_alternate</span>
              <span className="text-sm font-semibold">Drop more clothes here or click to upload</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {CATEGORIES.map((cat) => {
              const count = cat === "All" ? items.length : items.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    activeCategory === cat
                      ? "bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-[0_4px_12px_rgba(139,92,246,0.3)]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
                  }`}
                >
                  {cat} {count > 0 && <span className="opacity-60">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <span className="material-symbols-outlined text-5xl block mb-3">category</span>
              <p className="font-semibold">No items in "{activeCategory}" yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
                <WardrobeCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Tagging Modal (shown right after upload) ── */}
      {pendingItems.length > 0 && (
        <TaggingModal
          pendingItems={pendingItems}
          setPendingItems={setPendingItems}
          onConfirm={handleConfirmPending}
          categories={UPLOAD_CATEGORIES}
        />
      )}

      {/* Detail / Edit Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square overflow-hidden">
              <img src={selectedItem.src} alt={selectedItem.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <input
                value={selectedItem.name}
                onChange={(e) => handleRename(selectedItem.id, e.target.value)}
                className="w-full text-xl font-black text-black border-b-2 border-gray-200 focus:border-[#8B5CF6] outline-none pb-1 mb-4 bg-transparent"
                placeholder="Item name"
              />
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {UPLOAD_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(selectedItem.id, cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        selectedItem.category === cat
                          ? "bg-[#8B5CF6] text-white border-[#8B5CF6]"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#8B5CF6]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Added {new Date(selectedItem.addedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { handleDelete(selectedItem.id); setSelectedItem(null); }}
                  className="flex-1 py-2.5 rounded-xl border-2 border-red-200 text-red-500 font-bold hover:bg-red-50 transition-all"
                >
                  Remove
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#8B5CF6] text-white font-bold hover:bg-[#7C3AED] transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tagging Modal: lets user pick category for each uploaded image before saving ──
function TaggingModal({ pendingItems, setPendingItems, onConfirm, categories }) {
  const [tagged, setTagged] = useState(
    pendingItems.map((item) => ({ ...item, category: "" }))
  );

  const setCategory = (id, category) => {
    setTagged((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category } : item))
    );
  };

  const allTagged = tagged.every((item) => item.category !== "");

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-black">Tag Your Clothes</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Select a category for each item before saving
            </p>
          </div>
          <button
            onClick={() => setPendingItems([])}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="p-6 space-y-6">
          {tagged.map((item, idx) => (
            <div key={item.id} className="flex gap-4 items-start">
              {/* Preview */}
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-100 flex-shrink-0">
                <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Name + Category picker */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-black text-sm truncate mb-3">{item.name}</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
                  Select Category <span className="text-red-400">*</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(item.id, cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                        item.category === cat
                          ? "bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-[0_2px_8px_rgba(139,92,246,0.4)]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {item.category === "" && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">error</span>
                    Please select a category
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex gap-3">
          <button
            onClick={() => setPendingItems([])}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            disabled={!allTagged}
            onClick={() => onConfirm(tagged)}
            className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
              allTagged
                ? "bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-[0_4px_15px_rgba(139,92,246,0.4)]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Save to Wardrobe ({tagged.length} item{tagged.length !== 1 ? "s" : ""})
          </button>
        </div>
      </div>
    </div>
  );
}

function WardrobeCard({ item, onDelete, onClick }) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[#8B5CF6] transition-all hover:shadow-[0_8px_25px_rgba(139,92,246,0.15)] cursor-pointer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative aspect-square overflow-hidden" onClick={onClick}>
        <img
          src={item.src}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {hovering && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">View</span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
      <div className="p-3">
        <p className="text-xs font-bold text-black truncate">{item.name}</p>
        <span className="inline-block mt-1 px-2 py-0.5 bg-[#EFE7FF] text-[#8B5CF6] text-xs font-semibold rounded-full">
          {item.category}
        </span>
      </div>
    </div>
  );
}

export default MyWardrobe;
