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
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gold-border bg-card shadow-[0_4px_24px_hsl(var(--brand)/0.06)] transition-all duration-300 hover:border-gold/50 hover:shadow-[0_8px_32px_hsl(var(--brand)/0.12)] animate-on-scroll"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-border bg-surface px-3 py-2.5 min-[380px]:gap-3 min-[380px]:px-5 min-[380px]:py-3.5">
        <div className="flex min-w-0 items-center gap-1.5 min-[380px]:gap-2">
          <span className="inline-flex h-7 w-7 min-[380px]:h-8 min-[380px]:w-8 shrink-0 items-center justify-center rounded-md bg-brand/10 text-gold-strong">
            <Tag className="h-3.5 w-3.5 min-[380px]:h-4 min-[380px]:w-4" />
          </span>
          <span className="truncate font-mono text-xs min-[380px]:text-sm font-semibold tracking-[0.1em] min-[380px]:tracking-[0.14em] text-foreground">
            {coupon.code}
          </span>
        </div>
        <span className="shrink-0 rounded-md bg-gradient-to-r from-gold to-gold-strong px-2 py-0.5 min-[380px]:px-2.5 min-[380px]:py-1 text-[10px] min-[380px]:text-[11px] font-semibold text-primary-foreground">
          {formatCouponDiscount(coupon)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5 min-[380px]:p-5">
        <h3 className="font-inter text-base min-[380px]:text-lg font-semibold text-foreground leading-snug mb-1.5 min-[380px]:mb-2">
          {coupon.title}
        </h3>
        {coupon.description ? (
          <p className="text-xs min-[380px]:text-sm text-muted-foreground mb-3 min-[380px]:mb-4 line-clamp-3 flex-1 leading-relaxed">
            {coupon.description}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <div className="mb-3.5 min-[380px]:mb-5 space-y-1 text-[11px] min-[380px]:text-xs text-muted-foreground">
          <p className="inline-flex items-start gap-1.5">
            <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-strong" />
            <span>Valid till {format(parseISO(coupon.expiryDate), "d MMMM yyyy")}</span>
          </p>
          {minBooking ? (
            <p className="pl-5 leading-snug">{minBooking}</p>
          ) : null}
        </div>

        <Button
          asChild
          variant="solid"
          className="h-9 w-full px-3 text-[11px] tracking-[0.1em] uppercase min-[380px]:h-10 min-[380px]:text-xs min-[380px]:tracking-[0.12em]"
        >
          <Link href={bookUrl}>
            Book with code
            <ArrowRight className="h-3.5 w-3.5 min-[380px]:h-4 min-[380px]:w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
};

export default CouponCard;
