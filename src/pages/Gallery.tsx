import React, { useState } from "react";
import { X } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import galleryData from "../data/gallery.json";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const getImageUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`;
};

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  useScrollAnimation([activeCategory]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = [
    "All",
    "Reception",
    "Restaurant",
    "Rooms",
    "Events",
    "Exterior",
  ];

  const filteredImages = React.useMemo(() => {
    if (activeCategory === "All") return galleryData;
    return galleryData.filter(
      (image) =>
        image.category.trim().toLowerCase() ===
        activeCategory.trim().toLowerCase()
    );
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
              VISUAL EXPERIENCE
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-6">
              Full <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our complete collection of images showcasing the luxurious facilities, elegant rooms, fine dining spaces, and world-class amenities at Hotel Yuvaan.
            </p>
          </div>

          {/* Gallery Categories */}
          <div className="mb-12 animate-on-scroll">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className={`relative group overflow-hidden rounded-2xl cursor-pointer animate-on-scroll-${
                  index % 2 === 0 ? "left" : "right"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedImage(getImageUrl(image.src))}
              >
                <img
                  src={getImageUrl(image.src)}
                  alt={image.alt}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-sm font-semibold">{image.alt}</div>
                  <div className="text-xs text-white/80">{image.category}</div>
                </div>
                <div className="absolute inset-0 ring-2 ring-primary ring-opacity-0 group-hover:ring-opacity-100 transition-all duration-300 rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-screen w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Gallery Image Full"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 hover:scale-110 transition-all duration-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
