import type { Metadata } from "next";
import { Suspense } from "react";
import BookingView from "@/views/BookingView";
import { fetchPublicBooking } from "@/services/bookingService";
import { createPageMetadata, OG_IMAGES } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Your Booking",
  description:
    "View your Hotel Yuvaan reservation details, download your receipt, or cancel online within the refund window.",
  path: "/booking",
  image: OG_IMAGES.book,
  noIndex: true,
});

type BookingPageProps = {
  params: Promise<{ token: string }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { token } = await params;
  const initialBooking = token
    ? await fetchPublicBooking(token).catch(() => null)
    : null;

  return (
    <Suspense fallback={null}>
      <BookingView initialBooking={initialBooking} />
    </Suspense>
  );
}
