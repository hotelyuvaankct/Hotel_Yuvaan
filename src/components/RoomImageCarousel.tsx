"use client";

import { useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type RoomImageCarouselProps = {
  images: string[];
  alt: string;
};

export default function RoomImageCarousel({
  images,
  alt,
}: RoomImageCarouselProps) {
  const autoplay = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  if (images.length === 0) {
    return (
      <div className="relative h-full bg-gradient-to-br from-brand via-brand-muted to-gold flex items-end p-6">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_60%)]" />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <Image
        src={images[0]}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
    );
  }

  return (
    <Carousel
      className="h-full w-full"
      opts={{ loop: true, align: "start" }}
      plugins={[autoplay.current]}
    >
      <CarouselContent className="-ml-0">
        {images.map((src, index) => (
          <CarouselItem
            key={`${src}-${index}`}
            className="basis-full pl-0"
          >
            <div className="relative h-48 min-[360px]:h-56 sm:h-64 overflow-hidden">
              <Image
                src={src}
                alt={`${alt} - Image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        type="button"
        className="left-1.5 top-1/2 z-20 h-7 w-7 min-[380px]:left-2 min-[380px]:h-8 min-[380px]:w-8 -translate-y-1/2 border-white/40 bg-black/45 text-white opacity-0 transition-opacity hover:bg-black/65 hover:text-white disabled:opacity-0 group-hover:opacity-100"
      />
      <CarouselNext
        type="button"
        className="right-1.5 top-1/2 z-20 h-7 w-7 min-[380px]:right-2 min-[380px]:h-8 min-[380px]:w-8 -translate-y-1/2 border-white/40 bg-black/45 text-white opacity-0 transition-opacity hover:bg-black/65 hover:text-white disabled:opacity-0 group-hover:opacity-100"
      />
    </Carousel>
  );
}
