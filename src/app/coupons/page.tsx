import type { Metadata } from "next";
import Coupons from "@/views/Coupons";
import { fetchPublicCoupons } from "@/services/couponService";
import { createPageMetadata, OG_IMAGES } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Coupons & Offers",
  description:
    "Find active promo codes and discounts for Hotel Yuvaan room bookings. Apply coupons at checkout for better rates.",
  path: "/coupons",
  image: OG_IMAGES.offers,
  imageAlt: "Coupons and offers at Hotel Yuvaan",
});

export default async function CouponsPage() {
  const coupons = await fetchPublicCoupons().catch(() => []);
  return <Coupons coupons={coupons} />;
}
