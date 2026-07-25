import Link from "next/link";
import {
  formatRoomPrice,
  buildBookUrl,
  normalizeStorageUrl,
  type PublicRoomType,
} from "@/services/roomService";
import { getAmenityIcon, getAmenityLabel } from "@/lib/amenities";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";
import RoomImageCarousel from "./RoomImageCarousel";

type RoomsSectionProps = {
  rooms: PublicRoomType[];
};

export default function RoomsSection({ rooms }: RoomsSectionProps) {
  const defaultBookUrl = buildBookUrl({
    checkIn: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    checkOut: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    adults: 2,
    children: 0,
    rooms: 1,
  });

  return (
    <section id="rooms" className="pt-10 md:pt-12 pb-16 md:pb-24 relative">
      <div className="container mx-auto px-3 min-[380px]:px-4">
        <SectionHeader
          eyebrow="HOTEL YUVAAN LUXURY ACCOMMODATION"
          title="Rooms &"
          highlight="Suites"
          description="Experience luxury and comfort in our elegantly designed rooms, each offering premium amenities and exceptional service with modern interiors that create unforgettable memories."
        />

        {rooms.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Unable to load room types right now. Please try again later.
          </p>
        ) : (
          <div className="grid gap-5 min-[380px]:gap-6 lg:grid-cols-3 lg:gap-8">
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
                  className={`flex h-full flex-col rounded-xl min-[380px]:rounded-2xl overflow-hidden bg-card shadow-lg hover:shadow-xl transition-shadow duration-500 border border-border hover:border-gold-border animate-on-scroll-${
                    index % 2 === 0 ? "left" : "right"
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative group h-48 min-[360px]:h-56 sm:h-64 shrink-0 overflow-hidden bg-muted">
                    <RoomImageCarousel images={images} alt={room.name} />

                    <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex flex-col gap-1 min-[380px]:top-3 min-[380px]:left-3 min-[380px]:right-3 min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between min-[380px]:gap-1.5 pointer-events-none">
                      <div className="w-fit max-w-full shrink-0 bg-gradient-to-r from-gold-strong to-gold-bright text-white px-2 py-0.5 min-[380px]:px-2.5 min-[380px]:py-1 rounded-full text-[10px] min-[380px]:text-sm font-semibold shadow-lg">
                        {formatRoomPrice(room.basePrice)}
                        <span className="hidden min-[360px]:inline"> / Night</span>
                      </div>
                      <div className="w-fit max-w-full min-[380px]:max-w-[55%] bg-overlay/40 backdrop-blur-sm text-white px-2 py-0.5 min-[380px]:py-1 rounded-full text-[10px] min-[380px]:text-xs font-medium leading-snug">
                        Up to {room.maxAdults} adults
                        {room.maxChildren > 0
                          ? ` · ${room.maxChildren} ${room.maxChildren === 1 ? "child" : "children"}`
                          : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-3.5 min-[380px]:p-5 sm:p-6">
                    <h3 className="text-lg min-[380px]:text-xl font-bold font-playfair mb-2 min-[380px]:mb-3 text-foreground leading-snug min-h-[1.5em] line-clamp-1">
                      {room.name}
                    </h3>
                    <p className="text-xs min-[380px]:text-sm text-muted-foreground mb-3 min-[380px]:mb-4 leading-relaxed line-clamp-2 min-[380px]:line-clamp-3 min-h-[2.5rem] min-[380px]:min-h-[3.75rem]">
                      {room.description?.trim() || "\u00A0"}
                    </p>

                    <div className="mb-4 grid grid-cols-2 gap-1.5 min-[380px]:mb-6 min-[380px]:gap-2.5">
                      {displayFeatures.map((feature, featureIndex) => {
                        const Icon = getAmenityIcon(feature);
                        return (
                          <div
                            key={`${feature}-${featureIndex}`}
                            className="flex h-9 min-w-0 items-center gap-1.5 rounded-lg border border-border/60 bg-surface px-1.5 min-[380px]:h-10 min-[380px]:gap-2 min-[380px]:px-2"
                          >
                            <Icon className="h-3.5 w-3.5 min-[380px]:h-4 min-[380px]:w-4 shrink-0 text-gold" />
                            <span className="min-w-0 truncate text-[11px] font-medium leading-none text-muted-foreground min-[380px]:text-sm">
                              {getAmenityLabel(feature)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <Button
                      asChild
                      variant="solid"
                      className="mt-auto h-9 w-full px-3 text-[11px] tracking-wide min-[380px]:h-10 min-[380px]:text-sm"
                    >
                      <Link href={defaultBookUrl}>BOOK NOW</Link>
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
}
