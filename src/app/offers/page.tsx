import type { Metadata } from "next";
import Coupons from "@/views/Coupons";
import { fetchPublicCoupons } from "@/services/couponService";
import { createPageMetadata, OG_IMAGES } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Special Offers",
  description:
    "Browse active promo codes and special offers for Hotel Yuvaan bookings in Kuchaman City. Save on your next stay.",
  path: "/offers",
  image: OG_IMAGES.offers,
  imageAlt: "Special offers at Hotel Yuvaan",
});

export default async function OffersPage() {
  const coupons = await fetchPublicCoupons().catch(() => []);
  return <Coupons coupons={coupons} />;
}
