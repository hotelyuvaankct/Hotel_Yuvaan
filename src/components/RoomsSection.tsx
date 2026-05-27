import React, { useState } from "react";
import { Users, Bed, Wifi, Coffee, Award, Star } from "lucide-react";
import roomData from "../data/room.json";
import RoomPopup from "./RoomPopup";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const featureIcons: Record<string, any> = {
  "1-2 Persons": Users,
  "2-3 Persons": Users,
  "King Bed": Bed,
  "Twin Beds": Bed,
  "Free WiFi": Wifi,
  Breakfast: Coffee,
  "Premium Amenities": Award,
  "City View": Award,
  "Premium Lighting": Star,
  "Modern Decor": Star,
};

const RoomsSection = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const rooms = roomData as any[];

  return (
    <section
      id="rooms"
      className="py-16 md:py-24 bg-background relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
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
              each offering premium amenities and exceptional service with
              modern interiors that create unforgettable memories.
            </p>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div
              key={room.type}
              className={`bg-gradient-to-br from-background to-muted/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-muted hover:border-gold-300 animate-on-scroll-${
                index % 2 === 0 ? "left" : "right"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Room Image Carousel */}
              <div className="relative group">
                <Carousel 
                  className="w-full"
                  opts={{ loop: true }}
                  plugins={[
                    Autoplay({
                      delay: 3000,
                    }),
                  ]}
                >
                  <CarouselContent className="m-0">
                    {room.images.map((image: string, imgIndex: number) => (
                      <CarouselItem key={imgIndex} className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={`${import.meta.env.BASE_URL}${image}`}
                            alt={`${room.name} - Image ${imgIndex + 1}`}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                            onClick={() => {
                              setSelectedRoom(room);
                              setPopupOpen(true);
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-600 to-gold-400 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-10 pointer-events-none">
                  {room.price} / Night
                </div>
                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium z-10 pointer-events-none">
                  {room.size}
                </div>
              </div>

              {/* Room Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold font-playfair mb-3 text-foreground">
                  {room.name}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {room.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {room.features.map(
                    (feature: string, featureIndex: number) => {
                      const Icon = featureIcons[feature];
                      return (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2 text-sm bg-muted/50 p-2 rounded-lg"
                        >
                          {Icon && <Icon className="w-4 h-4 text-gold-500" />}
                          <span className="text-muted-foreground font-medium">
                            {feature}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <a
                    href={room.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-gold-600 to-gold-400 text-white py-3 px-4 rounded-lg hover:from-gold-700 hover:to-gold-500 transition-all duration-300 text-sm font-semibold text-center shadow-lg hover:shadow-gold hover:shadow-lg"
                  >
                    BOOK NOW
                  </a>
                  {/* <button
                    onClick={() => {
                      setSelectedRoom(room);
                      setPopupOpen(true);
                    }}
                    className="border border-gold-300 text-gold-600 py-3 px-4 rounded-lg hover:bg-gold-500 hover:text-white hover:border-gold-500 transition-all duration-300 text-sm font-semibold flex items-center justify-center"
                  >
                    DETAILS →
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

       

        <RoomPopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          room={selectedRoom}
        />
      </div>
    </section>
  );
};

export default RoomsSection;
