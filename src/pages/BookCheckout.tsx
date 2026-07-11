import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
import { buildBookUrl } from "@/services/roomService";
import {
  bookingSession,
  type BookingSession,
  type GuestDetails,
} from "@/lib/bookingSessionManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const emptyGuest: GuestDetails = {
  guestFirstName: "",
  guestLastName: "",
  guestEmail: "",
  guestPhone: "",
};

const BookCheckout = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const saved = bookingSession.load();
    if (!saved || saved.cart.length === 0) {
      navigate("/book", { replace: true });
      return;
    }
    setDraft(saved);
    setGuest(saved.guest ?? emptyGuest);
    setAppliedCoupon(saved.appliedCoupon ?? null);
    setPendingCouponCode(saved.pendingCouponCode?.trim().toUpperCase() ?? "");
  }, [navigate]);

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
          setCouponError(null);
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
    if (!guest.guestFirstName.trim()) {
      setFormError("First name is required");
      return false;
    }
    if (!guest.guestLastName.trim()) {
      setFormError("Last name is required");
      return false;
    }
    if (!guest.guestEmail.trim() || !guest.guestEmail.includes("@")) {
      setFormError("Valid email is required");
      return false;
    }
    if (!guest.guestPhone.trim() || guest.guestPhone.trim().length < 10) {
      setFormError("Valid phone number is required");
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
      navigate(`/booking/${booking.accessToken ?? booking.bookingCode}`, {
        replace: true,
      });
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
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const config = configQuery.data as BookingConfig | undefined;

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <Navigation />
      <ProcessingOverlay
        open={verifying}
        message="Verifying payment…"
        detail="Please wait while we confirm your payment. Do not close or refresh this page."
      />

      <section className="relative pt-28 pb-8 bg-[#4b3621]">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-3xl md:text-4xl text-white mt-6 mb-2">
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

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="space-y-4">
            <Link
              to={backToRoomsUrl}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#4b3621] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Edit room selection
            </Link>

            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 md:p-8">
              <div className="mb-6">
                <h2 className="font-playfair text-2xl text-[#4b3621]">Guest details</h2>
                <p className="text-sm text-neutral-600 mt-1">
                  You can update your information anytime before confirming.
                </p>
              </div>

              <form onSubmit={handleContinueToPayment} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={guest.guestFirstName}
                      onChange={(e) => updateGuest({ guestFirstName: e.target.value })}
                      className="rounded-none mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={guest.guestLastName}
                      onChange={(e) => updateGuest({ guestLastName: e.target.value })}
                      className="rounded-none mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={guest.guestEmail}
                    onChange={(e) => updateGuest({ guestEmail: e.target.value })}
                    className="rounded-none mt-1"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Used for confirmation and coupon validation.
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={guest.guestPhone}
                    onChange={(e) => updateGuest({ guestPhone: e.target.value })}
                    className="rounded-none mt-1"
                  />
                </div>

                {accommodatedGuests < totalGuests ? (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2">
                    Selected rooms fit {accommodatedGuests} of {totalGuests} guests.{" "}
                    <Link to={backToRoomsUrl} className="font-medium underline">
                      Add more rooms
                    </Link>
                  </p>
                ) : null}

                {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

                <Button
                  type="submit"
                  disabled={submitting || verifying || quoteLoading}
                  className="w-full rounded-none bg-[#4b3621] hover:bg-[#3d2b1a] py-6 text-sm font-semibold tracking-wider uppercase"
                >
                  {submitting ? "Opening payment…" : "Continue to payment"}
                </Button>
              </form>
            </div>
          </div>

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
            showCoupons
            showContinueButton={false}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookCheckout;
