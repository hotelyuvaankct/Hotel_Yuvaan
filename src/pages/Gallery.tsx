import React, { useState } from "react";
import { X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import GalleryCard from "../components/GalleryCard";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { fetchGalleryImages } from "@/services/galleryService";
import {
  GALLERY_CATEGORY_FILTERS,
  GALLERY_CATEGORY_FILTER_ALL,
  type GalleryCategoryFilter,
} from "@/lib/galleryCategories";

const PAGE_SIZE = 12;

const Gallery = () => {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategoryFilter>(GALLERY_CATEGORY_FILTER_ALL);
  const [page, setPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["gallery-images", activeCategory, page],
    queryFn: () =>
      fetchGalleryImages({
        page,
        size: PAGE_SIZE,
        category: activeCategory,
      }),
  });

  const images = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  useScrollAnimation([activeCategory, page, images.length, isLoading]);

  const handleCategoryChange = (category: GalleryCategoryFilter) => {
    setActiveCategory(category);
    setPage(0);
  };

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
              Explore our complete collection of images showcasing the luxurious
              facilities, elegant rooms, fine dining spaces, and world-class
              amenities at Hotel Yuvaan.
            </p>
          </div>

          <div className="mb-12 animate-on-scroll">
            <div className="flex flex-wrap justify-center gap-4">
              {GALLERY_CATEGORY_FILTERS.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
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

          {isLoading && (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <p className="text-center text-muted-foreground py-16">
              Unable to load gallery images. Please try again later.
            </p>
          )}

          {!isLoading && !isError && images.length === 0 && (
            <p className="text-center text-muted-foreground py-16">
              No gallery images available for this category yet.
            </p>
          )}

          {!isLoading && images.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <GalleryCard
                    key={image.id}
                    imageUrl={image.publicUrl}
                    alt={image.title}
                    category={image.category}
                    index={index}
                    onClick={() => setSelectedImage(image.publicUrl)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                    disabled={page === 0 || isFetching}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) =>
                        Math.min(totalPages - 1, current + 1)
                      )
                    }
                    disabled={page + 1 >= totalPages || isFetching}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-screen w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
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
