import React, { useEffect, useState } from "react";
import { Dialog } from "../components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";

interface Room {
  type: string;
  name: string;
  size: string;
  bed: string;
  view: string;
  bathroom: string;
  amenities: string[];
  bookingUrl: string;
  images: string[];
}

interface RoomPopupProps {
  open: boolean;
  onClose: () => void;
  room: Room | null;
}

const RoomPopup: React.FC<RoomPopupProps> = ({ open, onClose, room }) => {
  if (!room) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-auto">
        <h2 className="text-xl font-bold mb-4">{room.name}</h2>
        <Carousel className="mb-4">
          <CarouselContent>
            {room.images.map((img, i) => (
              <CarouselItem key={i}>
                <img
                  src={import.meta.env.BASE_URL + img}
                  alt={`${room.name} ${i + 1}`}
                  className="rounded-lg w-full h-64 object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div>
            <p className="text-muted-foreground">Size</p>
            <p>{room.size}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Bed</p>
            <p>{room.bed}</p>
          </div>
          <div>
            <p className="text-muted-foreground">View</p>
            <p>{room.view}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Bathroom</p>
            <p>{room.bathroom}</p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Amenities</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {room.amenities.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-primary">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <a
          href={room.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-primary text-white text-center py-2 rounded hover:bg-primary/90 transition"
        >
          Book Now
        </a>
      </div>
    </Dialog>
  );
};

export default RoomPopup;
