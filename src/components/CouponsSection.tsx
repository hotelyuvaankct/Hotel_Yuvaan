import Link from "next/link";
import CouponCard from "./CouponCard";
import SectionHeader from "./SectionHeader";
import type { PublicCoupon } from "@/services/couponService";
import { Button } from "@/components/ui/button";

const PREVIEW_LIMIT = 3;

type CouponsSectionProps = {
  coupons: PublicCoupon[];
};

export default function CouponsSection({ coupons }: CouponsSectionProps) {
  if (coupons.length === 0) return null;

  const previewCoupons = coupons.slice(0, PREVIEW_LIMIT);

  return (
    <section id="offers" className="pt-16 md:pt-24 pb-10 md:pb-12">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Special offers"
          title="Exclusive"
          highlight="coupons"
          description="Save on your stay with our active promo codes. Apply a coupon at checkout when you book directly with Hotel Yuvaan."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewCoupons.map((coupon, index) => (
            <CouponCard key={coupon.id} coupon={coupon} index={index} />
          ))}
        </div>

        {coupons.length > PREVIEW_LIMIT && (
          <div className="mt-12 text-center animate-on-scroll">
            <Button asChild variant="solid" className="tracking-[0.12em] uppercase">
              <Link href="/coupons">View all offers</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
