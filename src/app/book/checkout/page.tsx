import type { Metadata } from "next";
import { Suspense } from "react";
import BookCheckout from "@/views/BookCheckout";
import { createPageMetadata, OG_IMAGES } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Checkout",
  description:
    "Complete your Hotel Yuvaan booking securely with Razorpay. Guest details, payment summary, and instant confirmation.",
  path: "/book/checkout",
  image: OG_IMAGES.book,
  noIndex: true,
});

export default function BookCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <BookCheckout />
    </Suspense>
  );
}
