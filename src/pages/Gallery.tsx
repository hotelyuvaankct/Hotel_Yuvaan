import React, { useState } from "react";
import { X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import PageBackground from "../components/PageBackground";
import GalleryCard from "../components/GalleryCard";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { fetchGalleryImages } from "@/services/galleryService";
import {
  GALLERY_CATEGORY_FILTERS,
  GALLERY_CATEGORY_FILTER_ALL,
  type GalleryCategoryFilter,
} from "@/lib/galleryCategories";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";

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
    <PageBackground className="flex flex-col">
      <Navigation />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <SectionHeader
            as="h1"
            eyebrow="VISUAL EXPERIENCE"
            title="Full"
            highlight="Gallery"
            description="Explore our complete collection of images showcasing the luxurious facilities, elegant rooms, fine dining spaces, and world-class amenities at Hotel Yuvaan."
          />

          <div className="mb-12 animate-on-scroll">
            <div className="flex flex-wrap justify-center gap-4">
              {GALLERY_CATEGORY_FILTERS.map((category) => (
                <Button
                  key={category}
                  type="button"
                  size="sm"
                  variant={activeCategory === category ? "solid" : "outline"}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                    disabled={page === 0 || isFetching}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((current) =>
                        Math.min(totalPages - 1, current + 1)
                      )
                    }
                    disabled={page + 1 >= totalPages || isFetching}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 bg-black/50 hover:bg-black/70 border-0 z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}
    </PageBackground>
  );
};

export default Gallery;
