import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingSidebar, { type CartItem } from "@/components/booking/BookingSidebar";
import {
  checkoutBooking,
  computeGuestCapacity,
  fetchBookingConfig,
  quoteCheckout,
  type BookingConfig,
  type BookingQuote,
} from "@/services/bookingService";
import {
  fetchPublicCoupons,
  validatePublicCoupon,
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
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState<string | null>(null);
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const pendingCouponAppliedRef = useRef(false);

  useEffect(() => {
    const saved = bookingSession.load();
    if (!saved || saved.cart.length === 0) {
      navigate("/book", { replace: true });
      return;
    }
    setDraft(saved);
    setGuest(saved.guest ?? emptyGuest);
    setAppliedCoupon(saved.appliedCoupon ?? null);
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
  const cartSubtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.pricePerNight * item.quantity * item.totalNights,
        0
      ),
    [cart]
  );

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
        promo: appliedCoupon?.code ?? draft.pendingCouponCode,
      })
    : "/book";

  const persistGuest = (nextGuest: GuestDetails, coupon = appliedCoupon) => {
    bookingSession.saveCheckoutDetails({
      guest: nextGuest,
      pendingCouponCode: coupon?.code ?? draft?.pendingCouponCode,
      appliedCoupon: coupon,
    });
  };

  const updateGuest = (patch: Partial<GuestDetails>) => {
    setGuest((current) => {
      const next = { ...current, ...patch };
      persistGuest(next);
      if (patch.guestEmail !== undefined && appliedCoupon) {
        setAppliedCoupon(null);
        setQuote(null);
        bookingSession.saveCheckoutDetails({
          guest: next,
          pendingCouponCode: draft?.pendingCouponCode,
          appliedCoupon: null,
        });
      }
      return next;
    });
  };

  const handleApplyCoupon = async (code: string) => {
    if (!draft?.hotelId || cartSubtotal <= 0) return;

    const email = guest.guestEmail.trim();
    if (!email || !email.includes("@")) {
      setCouponError("Enter your email above before applying a coupon");
      return;
    }

    const normalizedCode = code.trim().toUpperCase();
    setApplyingCoupon(normalizedCode);
    setCouponError(null);
    try {
      const result = await validatePublicCoupon({
        code: normalizedCode,
        hotelId: draft.hotelId,
        bookingAmount: cartSubtotal,
        guestEmail: email,
      });
      if (!result.valid) {
        setAppliedCoupon(null);
        setQuote(null);
        setCouponError(result.message ?? "Invalid coupon code");
        persistGuest(guest, null);
        return;
      }
      setAppliedCoupon(result);
      setQuote(null);
      persistGuest(guest, result);
      toast.success(result.title ? `Coupon applied: ${result.title}` : "Coupon applied");
    } catch (error) {
      setAppliedCoupon(null);
      setQuote(null);
      setCouponError((error as Error).message);
      persistGuest(guest, null);
    } finally {
      setApplyingCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setQuote(null);
    persistGuest(guest, null);
  };

  useEffect(() => {
    if (
      pendingCouponAppliedRef.current ||
      !draft?.pendingCouponCode ||
      appliedCoupon?.valid ||
      !guest.guestEmail.includes("@")
    ) {
      return;
    }
    pendingCouponAppliedRef.current = true;
    void handleApplyCoupon(draft.pendingCouponCode);
  }, [draft?.pendingCouponCode, guest.guestEmail, appliedCoupon?.valid]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;

    if (!guest.guestFirstName.trim()) {
      setFormError("First name is required");
      return;
    }
    if (!guest.guestLastName.trim()) {
      setFormError("Last name is required");
      return;
    }
    if (!guest.guestEmail.trim() || !guest.guestEmail.includes("@")) {
      setFormError("Valid email is required");
      return;
    }
    if (!guest.guestPhone.trim() || guest.guestPhone.trim().length < 10) {
      setFormError("Valid phone number is required");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      let couponCode = appliedCoupon?.valid ? appliedCoupon.code?.toUpperCase() : undefined;

      if (couponCode) {
        const validation = await validatePublicCoupon({
          code: couponCode,
          hotelId: draft.hotelId,
          bookingAmount: cartSubtotal,
          guestEmail: guest.guestEmail.trim(),
        });
        if (!validation.valid) {
          throw new Error(validation.message ?? "Invalid coupon code");
        }
        setAppliedCoupon(validation);
        couponCode = validation.code?.toUpperCase();
      }

      const payload = {
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

      const quoteResult = await quoteCheckout(payload);
      setQuote(quoteResult);
      const booking = await checkoutBooking(payload);
      bookingSession.clear();
      toast.success("Booking confirmed! Check your email for details.");
      navigate(`/booking/${booking.accessToken ?? booking.bookingCode}`, {
        replace: true,
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
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

      <section className="relative pt-28 pb-8 bg-[#4b3621]">
        <div className="container mx-auto px-4">
          <Link
            to={backToRoomsUrl}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Edit room selection
          </Link>
          <h1 className="font-playfair text-3xl md:text-4xl text-white mb-2">
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
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-playfair text-2xl text-[#4b3621]">Guest details</h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    You can update your information anytime before confirming.
                  </p>
                </div>
                <Link
                  to={backToRoomsUrl}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4b3621] hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit rooms
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                  disabled={submitting}
                  className="w-full rounded-none bg-[#4b3621] hover:bg-[#3d2b1a] py-6 text-sm font-semibold tracking-wider uppercase"
                >
                  {submitting ? "Confirming booking…" : "Confirm booking"}
                </Button>
              </form>
            </div>
          </div>

          <BookingSidebar
            checkIn={draft.checkIn}
            checkOut={draft.checkOut}
            cart={cart as CartItem[]}
            quote={quote}
            config={config ?? null}
            onContinue={() => undefined}
            loading={submitting}
            availableCoupons={couponsQuery.data ?? []}
            couponsLoading={couponsQuery.isLoading}
            appliedCoupon={appliedCoupon}
            applyingCouponCode={applyingCoupon}
            couponError={couponError}
            onSelectCoupon={(code) => void handleApplyCoupon(code)}
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
