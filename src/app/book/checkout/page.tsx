import { Suspense } from "react";
import BookCheckout from "@/views/BookCheckout";

export const metadata = {
  title: "Checkout | Hotel Yuvaan",
  description: "Complete your booking at Hotel Yuvaan.",
};

export default function BookCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <BookCheckout />
    </Suspense>
  );
}
