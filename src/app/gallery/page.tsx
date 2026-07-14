import { Suspense } from "react";
import Gallery from "@/views/Gallery";

export const metadata = {
  title: "Gallery | Hotel Yuvaan",
  description:
    "Explore photos of rooms, restaurant, and amenities at Hotel Yuvaan, Kuchaman City.",
};

export default function GalleryPage() {
  return (
    <Suspense fallback={null}>
      <Gallery />
    </Suspense>
  );
}
