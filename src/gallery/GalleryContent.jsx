import { useState } from "react";
import { X } from "lucide-react";

const images = [
  {
    id: 1,
    url: "https://picsum.photos/400/300?random=1",
    title: "Mountain View",
  },
  {
    id: 2,
    url: "https://picsum.photos/400/300?random=2",
    title: "Ocean Sunset",
  },
  {
    id: 3,
    url: "https://picsum.photos/400/300?random=3",
    title: "City Lights",
  },
  {
    id: 4,
    url: "https://picsum.photos/400/300?random=4",
    title: "Forest Path",
  },
  {
    id: 5,
    url: "https://picsum.photos/400/300?random=5",
    title: "Desert Dunes",
  },
  { id: 6, url: "https://picsum.photos/400/300?random=6", title: "River Flow" },
];

const GalleryContent = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="h-full bg-gray-50 p-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[90vh] rounded-lg"
            />
            <p className="text-white text-center mt-4 text-lg">
              {selectedImage.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryContent;
