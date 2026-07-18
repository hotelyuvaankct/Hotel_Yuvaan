import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import GalleryCard from "@/components/GalleryCard";
import { fetchGalleryImages } from "@/services/galleryService";
import {
  GALLERY_CATEGORY_FILTERS,
  GALLERY_CATEGORY_FILTER_ALL,
  type GalleryCategoryFilter,
} from "@/lib/galleryCategories";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";

const PAGE_SIZE = 12;

function isGalleryCategory(value: string): value is GalleryCategoryFilter {
  return (GALLERY_CATEGORY_FILTERS as readonly string[]).includes(value);
}

type GalleryProps = {
  category?: string;
  page?: string;
};

export default async function Gallery({ category, page }: GalleryProps) {
  const activeCategory = isGalleryCategory(category ?? "")
    ? category!
    : GALLERY_CATEGORY_FILTER_ALL;
  const pageIndex = Math.max(0, Number(page ?? "0") || 0);

  const data = await fetchGalleryImages({
    page: pageIndex,
    size: PAGE_SIZE,
    category: activeCategory,
  }).catch(() => null);

  const images = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <PageBackground className="flex flex-col">
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <SectionHeader
            as="h1"
            eyebrow="VISUAL EXPERIENCE"
            title="Full"
            highlight="Gallery"
            description="Explore our complete collection of images showcasing the luxurious facilities, elegant rooms, fine dining spaces, and world-class amenities at Hotel Yuvaan."
          />

          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {GALLERY_CATEGORY_FILTERS.map((cat) => {
                const href =
                  cat === GALLERY_CATEGORY_FILTER_ALL
                    ? "/gallery"
                    : `/gallery?category=${encodeURIComponent(cat)}`;
                const active = activeCategory === cat;
                return (
                  <Button
                    key={cat}
                    asChild
                    size="sm"
                    variant={active ? "solid" : "outline"}
                  >
                    <Link href={href}>{cat}</Link>
                  </Button>
                );
              })}
            </div>
          </div>

          {!data && (
            <p className="text-center text-muted-foreground py-16">
              Unable to load gallery images right now. Please try again later.
            </p>
          )}

          {data && images.length === 0 && (
            <p className="text-center text-muted-foreground py-16">
              No images in this category yet.
            </p>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <GalleryCard
                  key={image.id}
                  imageUrl={image.publicUrl}
                  category={image.category}
                  index={index}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              {pageIndex > 0 ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={
                      activeCategory === GALLERY_CATEGORY_FILTER_ALL
                        ? `/gallery?page=${pageIndex - 1}`
                        : `/gallery?category=${encodeURIComponent(activeCategory)}&page=${pageIndex - 1}`
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Link>
                </Button>
              ) : null}
              <span className="text-sm text-muted-foreground">
                Page {pageIndex + 1} of {totalPages}
              </span>
              {pageIndex < totalPages - 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={
                      activeCategory === GALLERY_CATEGORY_FILTER_ALL
                        ? `/gallery?page=${pageIndex + 1}`
                        : `/gallery?category=${encodeURIComponent(activeCategory)}&page=${pageIndex + 1}`
                    }
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
