import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import CouponCard from "@/components/CouponCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCoupons } from "@/services/couponService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";

const Coupons = () => {
  const { data: coupons = [], isLoading, isError } = useQuery({
    queryKey: ["public-coupons"],
    queryFn: fetchPublicCoupons,
  });

  useScrollAnimation([coupons.length, isLoading]);

  return (
    <PageBackground className="flex flex-col">
      <Navigation />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <SectionHeader
            as="h1"
            eyebrow="Special offers"
            title="Hotel"
            highlight="coupons"
            description="Browse all active promo codes for Hotel Yuvaan. Select a coupon and apply it when you complete your booking on our website."
          />

          {isLoading && (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <p className="text-center text-muted-foreground py-16">
              Unable to load offers right now. Please try again later.
            </p>
          )}

          {!isLoading && !isError && coupons.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-6">
                No active coupons at the moment.
              </p>
              <Button asChild variant="solid" className="tracking-[0.12em] uppercase">
                <Link to="/book">BOOK WITHOUT COUPON</Link>
              </Button>
            </div>
          )}

          {!isLoading && coupons.length > 0 && (
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
};

export default Coupons;
