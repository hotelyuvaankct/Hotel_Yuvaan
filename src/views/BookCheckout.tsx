"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ArrowLeft, CalendarDays, Clock3, Loader2, Moon, Undo2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import BookingSidebar, { type CartItem } from "@/components/booking/BookingSidebar";
import {
  computeGuestCapacity,
  fetchBookingConfig,
  type BookingConfig,
  type BookingQuote,
  type CheckoutPayload,
} from "@/services/bookingService";
import {
  checkoutSummaryToQuote,
  createRazorpayOrder,
  fetchCheckoutSummary,
  loadRazorpayScript,
  openRazorpayCheckout,
  verifyRazorpayPayment,
} from "@/services/paymentService";
import {
  fetchPublicCoupons,
  type CouponValidation,
} from "@/services/couponService";
import { buildBookUrl, formatRoomPrice } from "@/services/roomService";
import {
  bookingSession,
  type BookingSession,
  type GuestDetails,
} from "@/lib/bookingSessionManager";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  sanitizePhoneInput,
  sanitizeNameInput,
  MAX_NAME_LENGTH,
  validateGuestFields,
  type GuestFieldErrors,
} from "@/lib/guestValidation";
import LeaveGuardDialog from "@/components/LeaveGuardDialog";
import {
  isBookingFlowPath,
  useLeaveGuard,
} from "@/hooks/useLeaveGuard";

const emptyGuest: GuestDetails = {
  guestFirstName: "",
  guestLastName: "",
  guestEmail: "",
  guestPhone: "",
};

const BookCheckout = () => {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingSession | null>(null);
  const [guest, setGuest] = useState<GuestDetails>(emptyGuest);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [pendingCouponCode, setPendingCouponCode] = useState<string>("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState<string | null>(null);
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<GuestFieldErrors>({});
  const [marriedCoupleConfirmed, setMarriedCoupleConfirmed] = useState(false);
  const [allowLeave, setAllowLeave] = useState(false);
  const allowLeaveRef = useRef(false);

  const leaveGuard = useLeaveGuard({
    when: Boolean(draft) && !allowLeave,
    message:
      submitting || verifying
        ? "Payment is in progress. Leaving now may interrupt your booking."
        : "You have an unfinished booking. Are you sure you want to leave?",
    shouldBlock: ({ nextPathname }) => {
      if (allowLeaveRef.current) return false;
      // Confirmation / back to room selection stay in the booking flow
      if (isBookingFlowPath(nextPathname)) return false;
      return true;
    },
  });

  useEffect(() => {
    const saved = bookingSession.load();
    if (!saved || saved.cart.length === 0) {
      router.replace("/book");
      return;
    }
    setDraft(saved);
    setGuest(saved.guest ?? emptyGuest);
    setAppliedCoupon(saved.appliedCoupon ?? null);
    setPendingCouponCode(saved.pendingCouponCode?.trim().toUpperCase() ?? "");
  }, [router]);

  const configQuery = useQuery({
    queryKey: ["bookingConfig"],
    queryFn: fetchBookingConfig,
  });

  const couponsQuery = useQuery({
    queryKey: ["public-coupons-checkout"],
    queryFn: fetchPublicCoupons,
  });

  const cart = draft?.cart ?? [];
  const totalGuests = (draft?.adults ?? 0) + (draft?.children ?? 0);
  const accommodatedGuests = useMemo(() => computeGuestCapacity(cart), [cart]);

  const backToRoomsUrl = draft
    ? buildBookUrl({
        checkIn: draft.checkIn,
        checkOut: draft.checkOut,
        adults: draft.adults,
        children: draft.children,
        rooms: draft.roomGuests.length,
        roomGuests: draft.roomGuests,
        promo: appliedCoupon?.code ?? (pendingCouponCode || undefined),
      })
    : "/book";

  const persistGuest = (
    nextGuest: GuestDetails,
    coupon = appliedCoupon,
    pending = pendingCouponCode
  ) => {
    bookingSession.saveCheckoutDetails({
      guest: nextGuest,
      pendingCouponCode: coupon?.code ?? (pending || undefined),
      appliedCoupon: coupon,
    });
  };

  const updateGuest = (patch: Partial<GuestDetails>) => {
    setGuest((current) => {
      const next = { ...current, ...patch };
      persistGuest(next);
      if (patch.guestEmail !== undefined) {
        // Email change re-runs checkout-summary (may invalidate per-email coupons)
        setCouponError(null);
      }
      return next;
    });
    setFieldErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof GuestDetails)[]) {
        delete next[key];
      }
      return next;
    });
    setFormError(null);
  };

  const handleApplyCoupon = (code: string) => {
    if (!draft?.hotelId || cart.length === 0) return;
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    setCouponError(null);
    setApplyingCoupon(normalized);
    setPendingCouponCode(normalized);
    persistGuest(guest, null, normalized);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPendingCouponCode("");
    setCouponError(null);
    setApplyingCoupon(null);
    persistGuest(guest, null, "");
  };

  // Server checkout-summary drives sidebar tax / discount / total
  useEffect(() => {
    if (!draft?.hotelId || cart.length === 0) {
      setQuote(null);
      return;
    }

    let cancelled = false;
    const couponCode = pendingCouponCode || undefined;
    const email = guest.guestEmail.trim();
    const guestEmail = email.includes("@") ? email : undefined;

    const timer = window.setTimeout(() => {
      void (async () => {
        setQuoteLoading(true);
        if (couponCode) setApplyingCoupon(couponCode);
        try {
          const summary = await fetchCheckoutSummary({
            hotelId: draft.hotelId,
            checkIn: draft.checkIn,
            checkOut: draft.checkOut,
            adults: draft.adults,
            children: draft.children,
            rooms: cart.reduce((sum, item) => sum + item.quantity, 0),
            selections: cart.map((item) => ({
              roomTypeId: item.roomTypeId,
              ratePlanCode: item.ratePlanCode,
              quantity: item.quantity,
            })),
            ...(couponCode ? { couponCode } : {}),
            ...(guestEmail ? { guestEmail } : {}),
          });
          if (cancelled) return;
          setQuote(checkoutSummaryToQuote(summary));
          if (couponCode) {
            setCouponError(null);
          }
          if (summary.couponCode) {
            const applied: CouponValidation = {
              valid: true,
              code: summary.couponCode,
              title: summary.couponTitle,
              discountAmount: summary.discountAmount,
            };
            setAppliedCoupon(applied);
            setPendingCouponCode(summary.couponCode.toUpperCase());
            persistGuest(guest, applied, summary.couponCode.toUpperCase());
          } else if (!couponCode) {
            setAppliedCoupon(null);
          }
        } catch (error) {
          if (cancelled) return;
          const message = (error as Error).message;
          if (couponCode) {
            setCouponError(message);
            setAppliedCoupon(null);
            setPendingCouponCode("");
            persistGuest(guest, null, "");
            toast.error(message);
            try {
              const summary = await fetchCheckoutSummary({
                hotelId: draft.hotelId,
                checkIn: draft.checkIn,
                checkOut: draft.checkOut,
                adults: draft.adults,
                children: draft.children,
                rooms: cart.reduce((sum, item) => sum + item.quantity, 0),
                selections: cart.map((item) => ({
                  roomTypeId: item.roomTypeId,
                  ratePlanCode: item.ratePlanCode,
                  quantity: item.quantity,
                })),
                ...(guestEmail ? { guestEmail } : {}),
              });
              if (!cancelled) setQuote(checkoutSummaryToQuote(summary));
            } catch {
              if (!cancelled) setQuote(null);
            }
          } else {
            setQuote(null);
          }
        } finally {
          if (!cancelled) {
            setQuoteLoading(false);
            setApplyingCoupon(null);
          }
        }
      })();
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    draft?.hotelId,
    draft?.checkIn,
    draft?.checkOut,
    draft?.adults,
    draft?.children,
    cart,
    pendingCouponCode,
    guest.guestEmail,
  ]);

  const buildPayload = (couponCode?: string): CheckoutPayload | null => {
    if (!draft) return null;
    return {
      hotelId: draft.hotelId,
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      adults: draft.adults,
      children: draft.children,
      rooms: cart.reduce((sum, item) => sum + item.quantity, 0),
      selections: cart.map((item) => ({
        roomTypeId: item.roomTypeId,
        ratePlanCode: item.ratePlanCode,
        quantity: item.quantity,
      })),
      guestFirstName: guest.guestFirstName.trim(),
      guestLastName: guest.guestLastName.trim(),
      guestEmail: guest.guestEmail.trim(),
      guestPhone: guest.guestPhone.trim(),
      ...(couponCode ? { couponCode } : {}),
    };
  };

  const validateGuestForm = (): boolean => {
    const errors = validateGuestFields(guest);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError("Please fix the highlighted fields before continuing.");
      return false;
    }

    if (!marriedCoupleConfirmed) {
      setFormError(
        "Please confirm that you have read and understood the couple stay policy before continuing to payment."
      );
      return false;
    }

    setFormError(null);
    return true;
  };

  const handleContinueToPayment = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft || !validateGuestForm()) return;
    if (couponError) {
      toast.error(couponError);
      return;
    }

    const couponCode =
      appliedCoupon?.valid && appliedCoupon.code
        ? appliedCoupon.code.toUpperCase()
        : quote?.couponCode?.toUpperCase() || undefined;

    const payload = buildPayload(couponCode);
    if (!payload) return;

    setSubmitting(true);
    try {
      const summary = await fetchCheckoutSummary({
        hotelId: payload.hotelId,
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        adults: payload.adults,
        children: payload.children,
        rooms: payload.rooms,
        selections: payload.selections,
        ...(payload.couponCode ? { couponCode: payload.couponCode } : {}),
        ...(payload.guestEmail ? { guestEmail: payload.guestEmail } : {}),
      });
      setQuote(checkoutSummaryToQuote(summary));

      await loadRazorpayScript();
      const order = await createRazorpayOrder(payload);

      setSubmitting(false);
      const payment = await openRazorpayCheckout({
        order,
        name: "Hotel Yuvaan",
        description: `Stay ${draft.checkIn} → ${draft.checkOut}`,
        prefill: {
          name: `${guest.guestFirstName} ${guest.guestLastName}`.trim(),
          email: guest.guestEmail.trim(),
          contact: guest.guestPhone.trim(),
        },
      });

      setVerifying(true);
      const verified = await verifyRazorpayPayment({
        razorpayOrderId: payment.razorpay_order_id,
        razorpayPaymentId: payment.razorpay_payment_id,
        razorpaySignature: payment.razorpay_signature,
      });

      if (!verified.verified || !verified.booking) {
        throw new Error("Payment failed. Try again.");
      }

      bookingSession.clear();
      toast.success("Payment successful! Booking confirmed.");
      const booking = verified.booking;
      allowLeaveRef.current = true;
      setAllowLeave(true);
      router.push(`/booking/${booking.accessToken ?? booking.bookingCode}`);
    } catch (error) {
      const message = (error as Error).message;
      if (message === "Payment cancelled") {
        toast.message("Payment cancelled");
      } else {
        toast.error(
          /fail|unable|invalid|error/i.test(message)
            ? message
            : "Payment failed. Try again."
        );
      }
    } finally {
      setSubmitting(false);
      setVerifying(false);
    }
  };

  if (!draft) {
    return (
      <PageBackground className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </PageBackground>
    );
  }

  const config = configQuery.data as BookingConfig | undefined;
  const nights =
    quote?.totalNights ??
    Math.max(
      1,
      Math.round(
        (parseISO(draft.checkOut).getTime() - parseISO(draft.checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

  return (
    <PageBackground className="flex flex-col">
      <LeaveGuardDialog
        open={leaveGuard.pendingLeave}
        message={leaveGuard.message}
        onStay={leaveGuard.cancelLeave}
        onLeave={leaveGuard.confirmLeave}
      />
      <Navigation />
      <ProcessingOverlay
        open={submitting || verifying}
        message={
          verifying ? "Verifying payment…" : "Preparing payment…"
        }
        detail={
          verifying
            ? "Please wait while we confirm your payment. Do not close or refresh this page."
            : "Creating your order. Please wait — do not close or refresh this page."
        }
      />

      <section className="relative pt-28 pb-8 bg-[#4b3621]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white mt-6 mb-2">
            Complete your booking
          </h1>
          <p className="text-white/80 text-sm">
            {format(parseISO(draft.checkIn), "dd MMM yyyy")} →{" "}
            {format(parseISO(draft.checkOut), "dd MMM yyyy")} · {draft.adults} adult
            {draft.adults === 1 ? "" : "s"}
            {draft.children > 0
              ? `, ${draft.children} child${draft.children === 1 ? "" : "ren"}`
              : ""}
          </p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-10">
        <Link
          href={backToRoomsUrl}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#4b3621] hover:underline mb-5"
        >
          <ArrowLeft className="h-4 w-4" />
          Edit room selection
        </Link>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          <div className="space-y-5">
            {/* Stay summary — single source of truth */}
            <section className="relative overflow-hidden rounded-xl border border-[#4b3621]/15 bg-gradient-to-br from-[#4b3621] via-[#5c4330] to-[#3d2b1a] text-white shadow-lg">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#c9a227,_transparent_55%)]" />
              <div className="relative p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8d5a3]">
                      Your stay
                    </p>
                    <h2 className="mt-1.5 font-playfair text-2xl font-bold leading-tight sm:text-3xl md:text-[2rem]">
                      <span className="text-white">
                        {nights} Night{nights === 1 ? "" : "s"} at{" "}
                      </span>
                      <span className="text-gradient">Hotel Yuvaan</span>
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#f5e6c8] ring-1 ring-white/15">
                    <Moon className="h-3.5 w-3.5" />
                    {nights} night{nights === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
                  <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 text-[#e8d5a3] text-[11px] uppercase tracking-wider font-semibold mb-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Check-in
                    </div>
                    <p className="text-xl font-semibold leading-tight">
                      {format(parseISO(draft.checkIn), "d MMMM yyyy")}
                    </p>
                    {config ? (
                      <p className="text-sm text-white/70 mt-1 inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        From {config.checkInTime}
                      </p>
                    ) : null}
                  </div>
                  <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 text-[#e8d5a3] text-[11px] uppercase tracking-wider font-semibold mb-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Check-out
                    </div>
                    <p className="text-xl font-semibold leading-tight">
                      {format(parseISO(draft.checkOut), "d MMMM yyyy")}
                    </p>
                    {config ? (
                      <p className="text-sm text-white/70 mt-1 inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        Till {config.checkOutTime}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="border-t border-white/15 pt-4 space-y-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8d5a3]">
                    Selected rooms
                  </p>
                  <ul className="space-y-2">
                    {cart.map((item, index) => (
                      <li
                        key={item.key}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-white leading-snug">
                            Room {index + 1}: {item.roomTypeName}
                            {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                          </p>
                          <p className="text-white/65 text-xs mt-0.5">{item.ratePlanLabel}</p>
                        </div>
                        <p className="tabular-nums text-[#f5e6c8] font-medium shrink-0">
                          {formatRoomPrice(
                            item.pricePerNight * item.quantity * item.totalNights
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Guest details */}
            <section className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 sm:p-7">
              <div className="mb-5">
                <h2 className="text-2xl font-semibold text-[#4b3621]">Guest details</h2>
                <p className="text-sm text-neutral-600 mt-1">
                  You can update your information anytime before confirming.
                </p>
              </div>

              <form onSubmit={handleContinueToPayment} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">
                      First name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={guest.guestFirstName}
                      onChange={(e) =>
                        updateGuest({ guestFirstName: sanitizeNameInput(e.target.value) })
                      }
                      maxLength={MAX_NAME_LENGTH}
                      className="rounded-sm mt-1"
                      autoComplete="given-name"
                      placeholder="Enter first name"
                      aria-invalid={Boolean(fieldErrors.guestFirstName)}
                    />
                    {fieldErrors.guestFirstName ? (
                      <p className="text-sm text-destructive mt-1">{fieldErrors.guestFirstName}</p>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={guest.guestLastName}
                      onChange={(e) =>
                        updateGuest({ guestLastName: sanitizeNameInput(e.target.value) })
                      }
                      maxLength={MAX_NAME_LENGTH}
                      className="rounded-sm mt-1"
                      autoComplete="family-name"
                      placeholder="Enter last name"
                      aria-invalid={Boolean(fieldErrors.guestLastName)}
                    />
                    {fieldErrors.guestLastName ? (
                      <p className="text-sm text-destructive mt-1">{fieldErrors.guestLastName}</p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    value={guest.guestEmail}
                    onChange={(e) => updateGuest({ guestEmail: e.target.value })}
                    className="rounded-sm mt-1"
                    autoComplete="email"
                    placeholder="name@example.com"
                    aria-invalid={Boolean(fieldErrors.guestEmail)}
                  />
                  {fieldErrors.guestEmail ? (
                    <p className="text-sm text-destructive mt-1">{fieldErrors.guestEmail}</p>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={guest.guestPhone}
                    onChange={(e) =>
                      updateGuest({ guestPhone: sanitizePhoneInput(e.target.value) })
                    }
                    className="rounded-sm mt-1"
                    autoComplete="tel"
                    placeholder="e.g. 9876543210"
                    aria-invalid={Boolean(fieldErrors.guestPhone)}
                  />
                  {fieldErrors.guestPhone ? (
                    <p className="text-sm text-destructive mt-1">{fieldErrors.guestPhone}</p>
                  ) : null}
                </div>

                {accommodatedGuests < totalGuests ? (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-sm">
                    Selected rooms fit {accommodatedGuests} of {totalGuests} guests.{" "}
                    <Link href={backToRoomsUrl} className="font-medium underline">
                      Add more rooms
                    </Link>
                  </p>
                ) : null}

                <div className="rounded-sm border border-[#4b3621]/20 bg-[#faf7f2] px-4 py-3.5 space-y-3">
                  <p className="text-sm text-[#4b3621] leading-relaxed">
                    Hotel Yuvaan has a couple stay policy: couple bookings are
                    for{" "}
                    <span className="font-semibold">married couples only</span>.
                    Unmarried couples are not permitted. See our{" "}
                    <Link
                      href="/terms"
                      className="font-medium underline underline-offset-2"
                    >
                      Terms &amp; Conditions
                    </Link>
                    .
                  </p>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="coupleStayPolicyConfirmed"
                      checked={marriedCoupleConfirmed}
                      onCheckedChange={(checked) => {
                        setMarriedCoupleConfirmed(checked === true);
                        if (checked === true) setFormError(null);
                      }}
                      className="mt-0.5 border-[#4b3621] data-[state=checked]:bg-[#4b3621] data-[state=checked]:border-[#4b3621]"
                    />
                    <Label
                      htmlFor="coupleStayPolicyConfirmed"
                      className="text-sm text-neutral-700 font-normal leading-snug cursor-pointer"
                    >
                      I confirm that I have read and understood the property's
                      couple stay policy. If this booking is for a couple, all
                      guests comply with the hotel's eligibility requirements.
                    </Label>
                  </div>
                </div>

                {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

                <Button
                  type="submit"
                  variant="dark"
                  disabled={submitting || verifying || quoteLoading}
                  className="w-full tracking-wider uppercase"
                >
                  {submitting ? "Opening payment…" : "Continue to payment"}
                </Button>
              </form>
            </section>
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <BookingSidebar
              checkIn={draft.checkIn}
              checkOut={draft.checkOut}
              cart={cart as CartItem[]}
              quote={quote}
              quoteLoading={quoteLoading}
              config={config ?? null}
              onContinue={() => undefined}
              loading={submitting || verifying}
              availableCoupons={couponsQuery.data ?? []}
              couponsLoading={couponsQuery.isLoading}
              appliedCoupon={appliedCoupon}
              selectedCouponCode={
                appliedCoupon?.valid ? null : pendingCouponCode || null
              }
              applyingCouponCode={applyingCoupon}
              couponError={couponError}
              onSelectCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onClearCouponError={() => setCouponError(null)}
              showCoupons
              showContinueButton={false}
              showStayDetails={false}
              showCartItems={false}
              title="Payment summary"
            />
          </div>
        </div>
      </main>

      <Footer />
    </PageBackground>
  );
};

export default BookCheckout;
