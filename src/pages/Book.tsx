import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingSearchBar from "@/components/BookingSearchBar";
import {
  resolveDefaultHotelId,
  searchAvailability,
  type AvailableRoomType,
} from "@/services/bookingService";
import { formatRoomPrice } from "@/services/roomService";
import { Users, Bed, Loader2 } from "lucide-react";

const Book = () => {
  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const adults = Number(searchParams.get("adults") ?? "2");
  const children = Number(searchParams.get("children") ?? "0");
  const rooms = Number(searchParams.get("rooms") ?? "1");
  const promo = searchParams.get("promo") ?? "";
  const hasSearch = Boolean(checkIn && checkOut);

  const [hotelId, setHotelId] = useState<number | null>(null);
  const [hotelError, setHotelError] = useState<string | null>(null);

  useEffect(() => {
    resolveDefaultHotelId()
      .then(setHotelId)
      .catch((error: Error) => setHotelError(error.message));
  }, []);

  const availabilityQuery = useQuery({
    queryKey: ["availability", hotelId, checkIn, checkOut, adults, children, rooms],
    queryFn: () =>
      searchAvailability({
        hotelId: hotelId!,
        checkIn,
        checkOut,
        adults,
        children,
        rooms,
      }),
    enabled: hasSearch && hotelId != null,
  });

  const displayCheckIn = checkIn ? format(parseISO(checkIn), "dd MMM yyyy") : "";
  const displayCheckOut = checkOut ? format(parseISO(checkOut), "dd MMM yyyy") : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <section className="relative pt-28 pb-10 bg-[#4b3621]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl md:text-4xl text-white mb-2">
              Find Your Room
            </h1>
            {hasSearch && (
              <p className="text-white/80 text-sm">
                {displayCheckIn} → {displayCheckOut} · {adults} adult
                {adults === 1 ? "" : "s"}
                {children > 0
                  ? `, ${children} child${children === 1 ? "" : "ren"}`
                  : ""}{" "}
                · {rooms} room{rooms === 1 ? "" : "s"}
                {promo ? ` · Promo: ${promo}` : ""}
              </p>
            )}
          </div>
          <BookingSearchBar />
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-12">
        {!hasSearch && (
          <div className="text-center text-muted-foreground max-w-xl mx-auto">
            <p>Select your dates and guests above, then click Find Room to see available options.</p>
          </div>
        )}

        {hotelError && (
          <p className="text-center text-destructive">{hotelError}</p>
        )}

        {hasSearch && availabilityQuery.isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {hasSearch && availabilityQuery.isError && (
          <p className="text-center text-destructive">
            {(availabilityQuery.error as Error).message}
          </p>
        )}

        {hasSearch && availabilityQuery.isSuccess && (
          <>
            {availabilityQuery.data.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-medium mb-2">No rooms available</p>
                <p className="text-muted-foreground mb-6">
                  Try different dates or reduce the number of guests.
                </p>
                <Link
                  to="/#rooms"
                  className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-sm text-sm font-semibold tracking-wider uppercase"
                >
                  View All Room Types
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 max-w-4xl mx-auto">
                {availabilityQuery.data.map((room) => (
                  <AvailabilityCard key={room.roomTypeId} room={room} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

const AvailabilityCard = ({ room }: { room: AvailableRoomType }) => (
  <article className="border border-muted rounded-lg p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h2 className="text-xl font-playfair font-semibold">{room.name}</h2>
          {room.badges?.map((badge) => (
            <span
              key={badge}
              className="text-xs px-2 py-0.5 rounded-full bg-gold-100 text-gold-800"
            >
              {badge}
            </span>
          ))}
        </div>
        {room.description && (
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
            {room.description}
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gold-500" />
            Up to {room.maxAdults} adults, {room.maxChildren} children
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-gold-500" />
            {room.availableRooms} of {room.totalRooms} available
          </span>
        </div>
        {room.amenities?.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 6).map((amenity) => (
              <li
                key={amenity}
                className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
              >
                {amenity}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="md:text-right shrink-0">
        {room.discountPercent != null && room.discountPercent > 0 && (
          <p className="text-xs text-muted-foreground line-through mb-1">
            {formatRoomPrice(room.originalPrice ?? room.fromPrice)}
          </p>
        )}
        <p className="text-2xl font-semibold text-[#4b3621]">
          {formatRoomPrice(room.fromPrice)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {room.totalNights} night{room.totalNights === 1 ? "" : "s"} total ·{" "}
          {formatRoomPrice(room.basePricePerNight)}/night
        </p>
        <button
          type="button"
          className="mt-4 w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-[#c9a227] to-[#4b3621] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:opacity-95 transition-opacity"
        >
          Select Room
        </button>
      </div>
    </div>
  </article>
);

export default Book;
