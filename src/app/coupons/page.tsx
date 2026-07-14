import Coupons from "@/views/Coupons";
import { fetchPublicCoupons } from "@/services/couponService";

export const revalidate = 60;

export const metadata = {
  title: "Coupons & Offers | Hotel Yuvaan",
  description:
    "Browse active promo codes and special offers for Hotel Yuvaan bookings.",
};

export default async function CouponsPage() {
  const coupons = await fetchPublicCoupons().catch(() => []);
  return <Coupons coupons={coupons} />;
}
