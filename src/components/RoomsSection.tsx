import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Bed, Wifi, Coffee, Award, Star, Loader2 } from "lucide-react";
import {
  fetchPublicRoomTypes,
  formatRoomPrice,
  buildBookUrl,
  normalizeStorageUrl,
} from "@/services/roomService";
import { Link } from "react-router-dom";
import { format, addDays } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const featureIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Free WiFi": Wifi,
  WiFi: Wifi,
  Breakfast: Coffee,
  "Premium Amenities": Award,
  "City View": Award,
  "Premium Lighting": Star,
  "Modern Decor": Star,
};

const defaultAmenityIcons = [Users, Bed, Wifi, Coffee];

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
      className="py-16 md:py-24 bg-background relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="relative inline-block mb-6">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 relative z-10">
              HOTEL YUVAAN LUXURY ACCOMMODATION
            </p>
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"></div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-8 text-foreground relative">
            <span className="relative z-10">
              Rooms &{" "}
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-gold-600 via-gold-500 to-gold-300">
                Suites
              </span>
            </span>
          </h2>

          <div className="space-y-4 text-muted-foreground max-w-2xl mx-auto relative">
            <div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-gold-500 to-transparent rounded-full"></div>
            <p className="relative pl-4">
              Experience luxury and comfort in our elegantly designed rooms,
              each offering premium amenities and exceptional service with modern
              interiors that create unforgettable memories.
            </p>
          </div>
        </div>

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
                  className={`bg-gradient-to-br from-background to-muted/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-muted hover:border-gold-300 animate-on-scroll-${
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
                        const Icon =
                          featureIcons[feature] ??
                          defaultAmenityIcons[
                            featureIndex % defaultAmenityIcons.length
                          ];
                        return (
                          <div
                            key={`${feature}-${featureIndex}`}
                            className="flex items-center space-x-2 text-sm bg-muted/50 p-2 rounded-lg"
                          >
                            <Icon className="w-4 h-4 text-gold-500" />
                            <span className="text-muted-foreground font-medium truncate">
                              {feature}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <Link
                      to={defaultBookUrl}
                      className="block w-full bg-gradient-to-r from-gold-600 to-gold-400 text-white py-3 px-4 rounded-lg hover:from-gold-700 hover:to-gold-500 transition-all duration-300 text-sm font-semibold text-center shadow-lg hover:shadow-gold hover:shadow-lg"
                    >
                      BOOK NOW
                    </Link>
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
