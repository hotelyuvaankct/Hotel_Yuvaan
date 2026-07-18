import React from "react";
import {
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";
import StatsRow from "./StatsRow";

type AboutSectionProps = {
  contact?: {
    phoneHref?: string;
    contactPhone?: string;
    mapsLinkUrl?: string;
  };
};

const aboutImages = [
  {
    src: "/image/About/reception.png",
    alt: "Hotel reception",
    label: "Grand Lobby",
    height: "h-36 min-[380px]:h-44 sm:h-48 md:h-52",
    delay: "scroll-delay-1",
  },
  {
    src: "/image/About/restaurant.png",
    alt: "Hotel restaurant",
    label: "Gourmet Dining",
    height: "h-44 min-[380px]:h-52 sm:h-56 md:h-64",
    delay: "scroll-delay-2",
  },
  {
    src: "/image/About/family_table.png",
    alt: "Hotel family table",
    label: "Family Experience",
    height: "h-44 min-[380px]:h-52 sm:h-56 md:h-64",
    delay: "scroll-delay-3",
  },
  {
    src: "/image/About/room.png",
    alt: "Hotel room",
    label: "Luxury Suite",
    height: "h-36 min-[380px]:h-44 sm:h-48 md:h-52",
    delay: "scroll-delay-4",
  },
] as const;

export default function AboutSection({ contact }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="pt-12 sm:pt-16 md:pt-24 pb-12 sm:pb-16 md:pb-24 relative"
    >
      <div className="container mx-auto px-3 min-[380px]:px-4">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Content */}
          <div className="min-w-0">
            <SectionHeader
              align="left"
              animate={false}
              className="mb-6 sm:mb-8"
              eyebrow="HOTEL YUVAAN LUXURY HOTEL"
              title="Enjoy a Luxury"
              highlight="Experience"
              description={
                <>
                  Welcome to the finest five-star deluxe hotel in the heart of the
                  city.{" "}
                  <span className="font-medium text-foreground">Hotel Yuvaan</span>{" "}
                  offers unparalleled luxury and comfort with world-class amenities
                  and exceptional hospitality that creates unforgettable memories
                  for our distinguished guests.
                  <br />
                  <br />
                  Our exquisite hotel features elegantly appointed rooms and
                  suites, each meticulously designed with contemporary furnishings
                  and premium amenities. Experience fine dining at our signature
                  restaurant, rejuvenate at our award-winning spa, or host your
                  special events in our sophisticated venues.
                </>
              }
            />

            <StatsRow
              className="mb-5 sm:mb-8 animate-on-scroll scroll-delay-3"
              items={[
                { value: "16+", label: "Luxury Rooms" },
                { value: "2+", label: "Years Experience" },
                { value: "1000+", label: "Happy Guests" },
                { value: "24/7", label: "Service" },
              ]}
            />

            <div className="flex flex-col min-[400px]:flex-row flex-wrap gap-2.5 sm:gap-4 animate-on-scroll scroll-delay-4">
              {contact?.phoneHref ? (
                <Button
                  asChild
                  variant="solid"
                  className="group h-9 w-full min-[400px]:w-fit gap-2 px-3 text-xs sm:h-10 sm:gap-3 sm:px-5 sm:text-sm"
                >
                  <a href={contact.phoneHref}>
                    <span className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/20">
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                    <span className="truncate">{contact.contactPhone}</span>
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              ) : (
                <Button
                  variant="solid"
                  className="h-9 w-full min-[400px]:w-fit gap-2 px-3 text-xs sm:h-10 sm:gap-3 sm:px-5 sm:text-sm"
                  disabled
                >
                  <span className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/20">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                  {contact?.contactPhone ?? "Call us"}
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              )}

              {contact?.mapsLinkUrl ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-9 w-full min-[400px]:w-fit gap-2 px-3 text-xs sm:h-10 sm:gap-3 sm:px-5 sm:text-sm"
                >
                  <a
                    href={contact.mapsLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                    View Location
                  </a>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="h-9 w-full min-[400px]:w-fit gap-2 px-3 text-xs sm:h-10 sm:gap-3 sm:px-5 sm:text-sm"
                  disabled
                >
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                  View Location
                </Button>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="relative overflow-hidden px-0.5 sm:px-0">
            <div className="absolute top-0 right-0 hidden min-[480px]:block w-24 h-24 sm:w-32 sm:h-32 border-2 border-gold-400 rounded-lg opacity-30 translate-x-3 -translate-y-3 sm:translate-x-4 sm:-translate-y-4" />
            <div className="absolute bottom-0 left-0 hidden min-[480px]:block w-16 h-16 sm:w-24 sm:h-24 border-2 border-gold-400 rounded-full opacity-30 -translate-x-3 translate-y-3 sm:-translate-x-4 sm:translate-y-4" />

            <div className="grid grid-cols-2 gap-2 min-[380px]:gap-3 sm:gap-4 relative z-10">
              <div className="space-y-2 min-[380px]:space-y-3 sm:space-y-4">
                {aboutImages.slice(0, 2).map((image) => (
                  <div
                    key={image.src}
                    className={`relative overflow-hidden rounded-lg min-[380px]:rounded-xl group animate-on-scroll-right ${image.delay}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`block w-full ${image.height} object-cover transition-transform duration-700 group-hover:scale-105`}
                    />
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-20">
                      <p className="text-white font-medium text-[11px] min-[380px]:text-sm sm:text-base leading-tight drop-shadow">
                        {image.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 min-[380px]:space-y-3 sm:space-y-4 mt-6 min-[380px]:mt-8 sm:mt-10 md:mt-12">
                {aboutImages.slice(2).map((image) => (
                  <div
                    key={image.src}
                    className={`relative overflow-hidden rounded-lg min-[380px]:rounded-xl group animate-on-scroll-right ${image.delay}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`block w-full ${image.height} object-cover transition-transform duration-700 group-hover:scale-105`}
                    />
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-20">
                      <p className="text-white font-medium text-[11px] min-[380px]:text-sm sm:text-base leading-tight drop-shadow">
                        {image.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
