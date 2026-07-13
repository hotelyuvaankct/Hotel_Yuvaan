import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CouponCard from "@/components/CouponCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCoupons } from "@/services/couponService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Coupons = () => {
  const { data: coupons = [], isLoading, isError } = useQuery({
    queryKey: ["public-coupons"],
    queryFn: fetchPublicCoupons,
  });

  useScrollAnimation([coupons.length, isLoading]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 animate-on-scroll">
            <p className="text-[#b8892f] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
              Special offers
            </p>
            <h1 className="font-inter text-3xl md:text-4xl lg:text-5xl font-semibold text-[#4b3621] mb-4">
              Hotel coupons
            </h1>
            <p className="text-[#6b5a45] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Browse all active promo codes for Hotel Yuvaan. Select a coupon and
              apply it when you complete your booking on our website.
            </p>
          </div>

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
    </div>
  );
};

export default Coupons;
