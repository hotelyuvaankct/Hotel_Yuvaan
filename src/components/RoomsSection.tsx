import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  fetchPublicRoomTypes,
  formatRoomPrice,
  buildBookUrl,
  normalizeStorageUrl,
} from "@/services/roomService";
import { getAmenityIcon, getAmenityLabel } from "@/lib/amenities";
import { Link } from "react-router-dom";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const RoomsSection = () => {
  const { data: rooms = [], isLoading, isError } = useQuery({
    queryKey: ["public-room-types"],
    queryFn: () => fetchPublicRoomTypes(),
  });

  useScrollAnimation([rooms.length, isLoading]);

  const defaultBookUrl = buildBookUrl({
    checkIn: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    checkOut: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    adults: 2,
    children: 0,
    rooms: 1,
  });

  return (
    <section
      id="rooms"
      className="pt-10 md:pt-12 pb-16 md:pb-24 relative"
    >
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="HOTEL YUVAAN LUXURY ACCOMMODATION"
          title="Rooms &"
          highlight="Suites"
          description="Experience luxury and comfort in our elegantly designed rooms, each offering premium amenities and exceptional service with modern interiors that create unforgettable memories."
        />

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {isError && (
          <p className="text-center text-muted-foreground py-8">
            Unable to load room types right now. Please try again later.
          </p>
        )}

        {!isLoading && !isError && (
          <div className="grid lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => {
              const images = (room.images ?? [])
                .map(normalizeStorageUrl)
                .filter(Boolean);
              const displayFeatures =
                (room.amenities?.length ?? 0) > 0
                  ? room.amenities!.slice(0, 4)
                  : [
                      `${room.maxAdults} Adults`,
                      room.maxChildren > 0
                        ? `${room.maxChildren} Children`
                        : "No Extra Bed",
                    ];

              return (
                <div
                  key={room.id}
                  className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500 border border-border hover:border-gold-300 animate-on-scroll-${
                    index % 2 === 0 ? "left" : "right"
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative group h-64">
                    {images.length > 0 ? (
                      <Carousel
                        className="w-full h-full"
                        opts={{ loop: images.length > 1 }}
                        plugins={
                          images.length > 1
                            ? [Autoplay({ delay: 3000 })]
                            : undefined
                        }
                      >
                        <CarouselContent className="ml-0 h-full">
                          {images.map((imageUrl, imgIndex) => (
                            <CarouselItem
                              key={`${room.id}-${imgIndex}`}
                              className="pl-0 basis-full h-full"
                            >
                              <div className="relative h-64 overflow-hidden">
                                <img
                                  src={imageUrl}
                                  alt={`${room.name} - Image ${imgIndex + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  loading="lazy"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    ) : (
                      <div className="relative h-full bg-gradient-to-br from-[#4b3621] via-[#6b4f33] to-[#c9a227] flex items-end p-6">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_60%)]" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-600 to-gold-400 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-10 pointer-events-none">
                      {formatRoomPrice(room.basePrice)} / Night
                    </div>
                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium z-10 pointer-events-none">
                      Up to {room.maxAdults} adults
                      {room.maxChildren > 0 ? ` · ${room.maxChildren} children` : ""}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold font-playfair mb-3 text-foreground">
                      {room.name}
                    </h3>
                    {room.description && (
                      <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                        {room.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {displayFeatures.map((feature, featureIndex) => {
                        const Icon = getAmenityIcon(feature);
                        return (
                          <div
                            key={`${feature}-${featureIndex}`}
                            className="flex items-center space-x-2 text-sm p-2 rounded-lg border border-border/60"
                          >
                            <Icon className="w-4 h-4 text-gold-500" />
                            <span className="text-muted-foreground font-medium truncate">
                              {getAmenityLabel(feature)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <Button asChild variant="solid" className="w-full tracking-wide">
                      <Link to={defaultBookUrl}>BOOK NOW</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomsSection;
