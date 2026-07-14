import { Suspense } from "react";
import Book from "@/views/Book";
import {
  decodeRoomGuests,
  fetchStay,
  type StayResult,
} from "@/services/bookingService";
import { fetchPublicRoomTypes, type PublicRoomType } from "@/services/roomService";

export const metadata = {
  title: "Book Rooms | Hotel Yuvaan",
  description: "Search availability and book rooms at Hotel Yuvaan, Kuchaman City.",
};

type BookPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams;
  const checkIn = typeof params.checkIn === "string" ? params.checkIn : "";
  const checkOut = typeof params.checkOut === "string" ? params.checkOut : "";
  const adults = Number(
    typeof params.adults === "string" ? params.adults : "2"
  );
  const roomsCount = Number(
    typeof params.rooms === "string" ? params.rooms : "1"
  );
  const roomGuests =
    decodeRoomGuests(
      typeof params.roomGuests === "string" ? params.roomGuests : null
    ) ??
    Array.from({ length: Math.max(1, roomsCount) }, () => ({
      adults: Math.max(1, Math.floor(adults / Math.max(1, roomsCount))),
      children: 0,
    }));

  let initialStay: StayResult | null = null;
  let initialRoomTypes: PublicRoomType[] | undefined;

  if (checkIn && checkOut) {
    const [stay, roomTypes] = await Promise.all([
      fetchStay({ checkIn, checkOut, roomGuests }).catch(() => null),
      fetchPublicRoomTypes().catch(() => []),
    ]);
    initialStay = stay;
    initialRoomTypes = roomTypes;
  }

  return (
    <Suspense fallback={null}>
      <Book initialStay={initialStay} initialRoomTypes={initialRoomTypes} />
    </Suspense>
  );
}
