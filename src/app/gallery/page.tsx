import { Suspense } from "react";
import Gallery from "@/views/Gallery";

export const metadata = {
  title: "Gallery | Hotel Yuvaan",
  description:
    "Explore photos of rooms, restaurant, and amenities at Hotel Yuvaan, Kuchaman City.",
};

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
