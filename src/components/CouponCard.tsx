import { format, parseISO, addDays, startOfToday } from "date-fns";
import { ArrowRight, CalendarDays, Tag } from "lucide-react";
import Link from "next/link";
import {
  formatCouponDiscount,
  formatCouponMinBooking,
  type PublicCoupon,
} from "@/services/couponService";
import { buildBookUrl } from "@/services/roomService";
import { Button } from "@/components/ui/button";

interface CouponCardProps {
  coupon: PublicCoupon;
  index?: number;
}

const CouponCard = ({ coupon, index = 0 }: CouponCardProps) => {
  const today = startOfToday();
  const bookUrl = buildBookUrl({
    checkIn: format(addDays(today, 1), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 2), "yyyy-MM-dd"),
    adults: 2,
    children: 0,
    rooms: 1,
    promo: coupon.code,
  });

  const minBooking = formatCouponMinBooking(coupon.minBookingAmount);

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#e8dfd0] bg-white shadow-[0_4px_24px_rgba(75,54,33,0.06)] transition-all duration-300 hover:border-[#c9a227]/50 hover:shadow-[0_8px_32px_rgba(75,54,33,0.12)] animate-on-scroll"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#e8dfd0] bg-[#faf8f5] px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#4b3621]/10 text-[#b8892f]">
            <Tag className="h-4 w-4" />
          </span>
          <span className="truncate font-mono text-sm font-semibold tracking-[0.14em] text-[#4b3621]">
            {coupon.code}
          </span>
        </div>
        <span className="shrink-0 rounded-md bg-gradient-to-r from-[#c9a227] to-[#b8892f] px-2.5 py-1 text-[11px] font-semibold text-white">
          {formatCouponDiscount(coupon)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-inter text-lg font-semibold text-[#4b3621] leading-snug mb-2">
          {coupon.title}
        </h3>
        {coupon.description ? (
          <p className="text-sm text-[#6b5a45] mb-4 line-clamp-3 flex-1 leading-relaxed">
            {coupon.description}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <div className="mb-5 space-y-1.5 text-xs text-[#8b7355]">
          <p className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#b8892f]" />
            Valid till {format(parseISO(coupon.expiryDate), "d MMMM yyyy")}
          </p>
          {minBooking ? <p className="pl-5">{minBooking}</p> : null}
        </div>

        <Button asChild variant="solid" className="w-full tracking-[0.12em] uppercase">
          <Link href={bookUrl}>
            Book with code
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
};

export default CouponCard;
