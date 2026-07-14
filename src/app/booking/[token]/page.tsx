import { Suspense } from "react";
import BookingView from "@/views/BookingView";
import { fetchPublicBooking } from "@/services/bookingService";

export const metadata = {
  title: "Your Booking | Hotel Yuvaan",
  description: "View and manage your Hotel Yuvaan booking.",
};

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
