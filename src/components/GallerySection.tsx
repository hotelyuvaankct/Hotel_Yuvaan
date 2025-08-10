import React, { useState } from "react";
import { X } from "lucide-react";

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      id: 1,
      src: `${
        import.meta.env.BASE_URL
      }image/Gallery/Hotel_Reception_Area.png`,
      alt: "Hotel Reception Area",
      category: "Reception",
    },
    {
      id: 2,
      src: `${
        import.meta.env.BASE_URL
      }image/Gallery/Restaurant_Booth_Seating.png`,
      alt: "Restaurant Booth Seating",
      category: "Restaurant",
    },
    {
      id: 3,
      src: `${
        import.meta.env.BASE_URL
      }image/Gallery/Birthday_Event_Decoration.png`,
      alt: "Birthday Event Decoration",
      category: "Events",
    },
    {
      id: 4,
      src: `${
        import.meta.env.BASE_URL
      }image/Gallery/Main_Restaurant_Dining_Area.png`,
      alt: "Main Restaurant Dining Area",
      category: "Restaurant",
    },
    {
      id: 5,
      src: `${
        import.meta.env.BASE_URL
      }image/Gallery/Deluxe_Room_Suite.png`,
      alt: "Deluxe Room Suite",
      category: "Rooms",
    },
    {
      id: 6,
      src: `${
        import.meta.env.BASE_URL
      }image/Gallery/Standard_Room.png`,
      alt: "Standard Room",
      category: "Rooms",
    },
    {
      id: 7,
      src: `${
        import.meta.env.BASE_URL
      }image/Gallery/Night_View.png`,
      alt: "Hotel Yuvaan Exterior Night View",
      category: "Exterior",
    },
    {
      id: 8,
      src: `${
        import.meta.env.BASE_URL
      }image/Gallery/Interior.png`,
      alt: "Premium Room Interior",
      category: "Rooms",
    },
    {
      id: 9,
      src: `${import.meta.env.BASE_URL
      }image/Gallery/Twin_Bed_Room.png`,
      alt: "Twin Bed Room",
      category: "Rooms",
    },
  ];

  const categories = [
    "All",
    "Reception",
    "Restaurant",
    "Rooms",
    "Events",
    "Exterior",
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages = React.useMemo(() => {
    if (activeCategory === "All") return galleryImages;
    return galleryImages.filter(
      (image) =>
        image.category.trim().toLowerCase() ===
        activeCategory.trim().toLowerCase()
    );
  }, [activeCategory, galleryImages]);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
            VISUAL EXPERIENCE
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
            Hotel <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take a visual tour of our luxurious facilities, elegant rooms, fine
            dining spaces, and world-class amenities at Hotel Yuvaan.
          </p>
        </div>

        {/* Gallery Categories */}
        {/* <div className="mb-12 animate-on-scroll">
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
        </div> */}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer animate-on-scroll-${
                index % 2 === 0 ? "left" : "right"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedImage(image.src)}
            >
              <img
                src={image.src}
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Gallery Image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
