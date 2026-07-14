import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import CouponCard from "@/components/CouponCard";
import SectionHeader from "@/components/SectionHeader";
import { fetchPublicCoupons } from "@/services/couponService";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export default async function Coupons({
  coupons: couponsProp,
}: {
  coupons?: Awaited<ReturnType<typeof fetchPublicCoupons>>;
}) {
  const coupons = couponsProp ?? (await fetchPublicCoupons().catch(() => []));

  return (
    <PageBackground className="flex flex-col">
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <SectionHeader
            as="h1"
            eyebrow="Special offers"
            title="Hotel"
            highlight="coupons"
            description="Browse all active promo codes for Hotel Yuvaan. Select a coupon and apply it when you complete your booking on our website."
          />

          {coupons.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-6">
                No active coupons at the moment.
              </p>
              <Button asChild variant="solid" className="tracking-[0.12em] uppercase">
                <Link href="/book">BOOK WITHOUT COUPON</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon, index) => (
                <CouponCard key={coupon.id} coupon={coupon} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
}
