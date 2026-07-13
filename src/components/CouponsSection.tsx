import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CouponCard from "./CouponCard";
import { fetchPublicCoupons } from "@/services/couponService";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";

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
    <section id="offers" className="pt-16 md:pt-24 pb-10 md:pb-12 bg-[#faf8f5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 animate-on-scroll">
          <p className="text-[#b8892f] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Special offers
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#4b3621] mb-4">
            Exclusive coupons
          </h2>
          <p className="text-[#6b5a45] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
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
            <Button asChild variant="solid" className="tracking-[0.12em] uppercase">
              <Link to="/coupons">View all offers</Link>
            </Button>
          </div>
        )}
           </div>
    </section>
  );
};

export default CouponsSection;
