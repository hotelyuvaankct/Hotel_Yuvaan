import Link from "next/link";
import GalleryCard from "./GalleryCard";
import type { GalleryImage } from "@/services/galleryService";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";

type GallerySectionProps = {
  images: GalleryImage[];
};

export default function GallerySection({ images }: GallerySectionProps) {
  return (
    <section id="gallery" className="pt-10 md:pt-12 pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="VISUAL EXPERIENCE"
          title="Hotel"
          highlight="Gallery"
          description="Take a visual tour of our luxurious facilities, elegant rooms, fine dining spaces, and world-class amenities at Hotel Yuvaan."
        />

        {images.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            New gallery photos are being added. Check back soon.
          </p>
        ) : (
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

        <div className="mt-12 text-center animate-on-scroll">
          <Button asChild variant="solid" className="tracking-wider">
            <Link href="/gallery">VIEW FULL GALLERY</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
