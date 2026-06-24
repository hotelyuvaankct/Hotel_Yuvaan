import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CouponCard from "./CouponCard";
import { fetchPublicCoupons } from "@/services/couponService";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PREVIEW_LIMIT = 3;

const CouponsSection = () => {
  const { data: coupons = [], isLoading, isError } = useQuery({
    queryKey: ["public-coupons-preview"],
    queryFn: fetchPublicCoupons,
  });

  const previewCoupons = coupons.slice(0, PREVIEW_LIMIT);

  useScrollAnimation([previewCoupons.length, isLoading]);

  if (!isLoading && !isError && coupons.length === 0) {
    return null;
  }

  return (
    <section id="offers" className="py-16 md:py-24 bg-[#faf8f5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-on-scroll">
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
            SPECIAL OFFERS
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
            Exclusive <span className="text-gradient">Coupons</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Save on your stay with our active promo codes. Apply a coupon at checkout
            when you book directly with Hotel Yuvaan.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {isError && (
          <p className="text-center text-muted-foreground py-8">
            Offers will appear here soon.
          </p>
        )}

        {!isLoading && previewCoupons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewCoupons.map((coupon, index) => (
              <CouponCard key={coupon.id} coupon={coupon} index={index} />
            ))}
          </div>
        )}

        {!isLoading && coupons.length > PREVIEW_LIMIT && (
          <div className="mt-12 text-center animate-on-scroll">
            <Link
              to="/coupons"
              className="inline-block bg-primary text-primary-foreground py-3 px-8 rounded-full hover:bg-primary/90 transition-all duration-300 font-semibold tracking-wider text-sm shadow-lg hover:shadow-xl"
            >
              VIEW ALL OFFERS
            </Link>
          </div>
        )}

        {!isLoading && coupons.length > 0 && coupons.length <= PREVIEW_LIMIT && (
          <div className="mt-12 text-center animate-on-scroll">
            <Link
              to="/book"
              className="inline-block border border-primary text-primary py-3 px-8 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold tracking-wider text-sm"
            >
              BOOK YOUR STAY
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CouponsSection;
