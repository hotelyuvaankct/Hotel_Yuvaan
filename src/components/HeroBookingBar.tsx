"use client";

import BookingSearchBar from "./BookingSearchBar";

/** Client island for the booking bar — kept out of the hero SSR critical path. */
export default function HeroBookingBar() {
  return <BookingSearchBar />;
}
