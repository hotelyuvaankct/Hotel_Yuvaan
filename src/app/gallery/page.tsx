import type { Metadata } from "next";
import { Suspense } from "react";
import Gallery from "@/views/Gallery";
import { createPageMetadata, OG_IMAGES } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Photo Gallery",
  description:
    "Browse photos of rooms, restaurant, events, and amenities at Hotel Yuvaan, Kuchaman City — see your stay before you book.",
  path: "/gallery",
  image: OG_IMAGES.gallery,
  imageAlt: "Night view of Hotel Yuvaan, Kuchaman City",
});

type GalleryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams;
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const page = typeof params.page === "string" ? params.page : undefined;

  return (
    <Suspense fallback={null}>
      <Gallery category={category} page={page} />
    </Suspense>
  );
}
