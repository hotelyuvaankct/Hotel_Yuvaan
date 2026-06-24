import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CouponCard from "@/components/CouponCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicCoupons } from "@/services/couponService";
import { Link } from "react-router-dom";

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
          <div className="text-center mb-16 animate-on-scroll">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
              SPECIAL OFFERS
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-6">
              Hotel <span className="text-gradient">Coupons</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
              <Link
                to="/book"
                className="inline-block bg-primary text-primary-foreground py-3 px-8 rounded-full font-semibold tracking-wider text-sm"
              >
                BOOK WITHOUT COUPON
              </Link>
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
