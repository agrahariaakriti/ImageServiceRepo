import { useState } from "react";
import Navbar from "../components/Navbar";
import { ImageIcon, Eye, Pencil, Trash2, Copy, X } from "lucide-react";

function Gallery() {
  const [images, setImages] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `image-${i + 1}.jpg`,
      image: `https://picsum.photos/800/600?random=${i + 1}`,
      imageUrl: `https://picsum.photos/800/600?random=${i + 1}`,
    })),
  );

  const [selected, setSelected] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const card =
    "rounded-2xl border border-white/5 bg-[#0b0f17] transition-all duration-300";

  // COPY URL
  const handleCopy = async (id, url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch (err) {
      console.log("Copy failed");
    }
  };

  // DELETE
  const handleDelete = (id) => {
    const ok = window.confirm("Delete this image?");
    if (!ok) return;

    setImages((prev) => prev.filter((img) => img.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  // EDIT
  const handleEdit = (img) => {
    console.log("Navigate to edit page:", img);
    // navigate(`/edit/${img.id}`)
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white overflow-x-hidden">
      <Navbar user={null} />

      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/5 blur-[180px] top-[-200px] left-[-200px]" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/5 blur-[180px] bottom-[-200px] right-[-200px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* HEADER */}
        <div className={`${card} p-8 mb-10`}>
          <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center">
            <div>
              <p className="text-cyan-300 text-sm">Image Sharing System</p>
              <h1 className="text-4xl font-semibold mt-1">Gallery</h1>
              <p className="text-white/50 mt-3 max-w-xl">
                Manage your images with preview, edit, copy and delete actions.
              </p>
            </div>

            <div className="flex items-center gap-4 px-6 py-5 rounded-2xl border border-cyan-500/10 bg-cyan-500/5">
              <ImageIcon className="text-cyan-300" />
              <div>
                <p className="text-white/50 text-sm">Total</p>
                <p className="text-2xl font-semibold">{images.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className={`${card} overflow-hidden group relative`}
            >
              {/* IMAGE */}
              <img
                src={img.image}
                alt={img.name}
                className="w-full h-64 object-cover"
              />

              {/* HOVER LAYER */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-4">
                {/* TOP ACTIONS */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelected(img)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-cyan-500/20"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => handleEdit(img)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
                  >
                    <Pencil size={18} />
                  </button>
                </div>

                {/* BOTTOM */}
                <div>
                  {/* URL */}
                  <p className="text-xs text-white/60 truncate mb-3">
                    {img.imageUrl}
                  </p>

                  {/* ACTIONS */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleCopy(img.id, img.imageUrl)}
                      className="text-xs py-2 rounded-lg bg-white/10 hover:bg-white/20"
                    >
                      {copiedId === img.id ? "Copied" : "Copy"}
                    </button>

                    <button
                      onClick={() => handleEdit(img)}
                      className="text-xs py-2 rounded-lg bg-white/10 hover:bg-white/20"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(img.id)}
                      className="text-xs py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {images.length === 0 && (
          <div className="text-center mt-20">
            <ImageIcon className="mx-auto text-cyan-300" size={40} />
            <h2 className="text-xl mt-4">No Images Found</h2>
            <p className="text-white/50 mt-2">Upload images to get started</p>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="relative max-w-4xl w-full">
            {/* CLOSE */}
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-white"
            >
              <X size={24} />
            </button>

            {/* IMAGE */}
            <img src={selected.image} className="w-full rounded-2xl" />

            {/* INFO */}
            <div className="mt-4 text-center text-white/60 text-sm">
              {selected.imageUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
