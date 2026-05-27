import React, { useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import galleryData from "../data/gallery.json";
import GalleryCard from "./GalleryCard";

const getImageUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`;
};

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Take only the first 6 images for the home page preview
  const homeImages = galleryData.slice(0, 6);

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
          {homeImages.map((image, index) => (
            <GalleryCard
              key={image.id}
              imageUrl={getImageUrl(image.src)}
              alt={image.alt}
              category={image.category}
              index={index}
              onClick={() => setSelectedImage(getImageUrl(image.src))}
            />
          ))}
        </div>

        <div className="mt-12 text-center animate-on-scroll">
          <Link
            to="/gallery"
            className="inline-block bg-primary text-primary-foreground py-3 px-8 rounded-full hover:bg-primary/90 transition-all duration-300 font-semibold tracking-wider text-sm shadow-lg hover:shadow-xl"
          >
            VIEW FULL GALLERY
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
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
