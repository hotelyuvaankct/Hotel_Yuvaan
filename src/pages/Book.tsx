import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { format, parseISO, addDays, startOfToday } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Minus,
  Plus,
  Users,
  Bed,
  Check,
  Wifi,
  Tv,
  Coffee,
  Utensils,
  UtensilsCrossed,
  Thermometer,
  Wind,
  Snowflake,
  Shirt,
  Waves,
  Car,
  CreditCard,
  ShieldCheck,
  ShowerHead,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingSearchBar from "@/components/BookingSearchBar";
import { type CartItem } from "@/components/booking/BookingSidebar";
import CapacityWarningModal from "@/components/booking/CapacityWarningModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  computeGuestCapacity,
  decodeRoomGuests,
  fetchStay,
  type AvailableRoomType,
  type BookingQuote,
  type RatePlan,
} from "@/services/bookingService";
import {
  checkoutSummaryToQuote,
  fetchCheckoutSummary,
} from "@/services/paymentService";
import { type CouponValidation } from "@/services/couponService";
import { bookingSession } from "@/lib/bookingSessionManager";
import {
  buildBookUrl,
  fetchPublicRoomTypes,
  formatRoomPrice,
  normalizeStorageUrl,
} from "@/services/roomService";
import { toast } from "sonner";

const Book = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const adults = Number(searchParams.get("adults") ?? "2");
  const children = Number(searchParams.get("children") ?? "0");
  const roomGuests =
    decodeRoomGuests(searchParams.get("roomGuests")) ??
    Array.from({ length: Number(searchParams.get("rooms") ?? "1") }, () => ({
      adults: Math.max(1, Math.floor(adults / Number(searchParams.get("rooms") ?? "1"))),
      children: 0,
    }));
  const totalGuests = adults + children;
  const hasSearch = Boolean(checkIn && checkOut);
  const roomGuestsKey = JSON.stringify(roomGuests);

  const promoFromUrl = searchParams.get("promo")?.trim().toUpperCase() ?? "";

  const [hotelId, setHotelId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [capacityModalOpen, setCapacityModalOpen] = useState(false);
  const [cartRestored, setCartRestored] = useState(false);
  const [pendingCouponCode, setPendingCouponCode] = useState(
    () =>
      promoFromUrl ||
      bookingSession.load()?.pendingCouponCode?.trim().toUpperCase() ||
      ""
  );
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(
    () => bookingSession.load()?.appliedCoupon ?? null
  );
  const [applyingCoupon, setApplyingCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  useEffect(() => {
    if (!checkIn || !checkOut) {
      const today = startOfToday();
      navigate(
        buildBookUrl({
          checkIn: format(addDays(today, 1), "yyyy-MM-dd"),
          checkOut: format(addDays(today, 2), "yyyy-MM-dd"),
          adults: 2,
          children: 0,
          rooms: 1,
          roomGuests: [{ adults: 2, children: 0 }],
          promo: promoFromUrl || undefined,
        }),
        { replace: true }
      );
    }
  }, [checkIn, checkOut, navigate, promoFromUrl]);

  useEffect(() => {
    if (!hasSearch || cartRestored) return;

    const session = bookingSession.load();
    const matchesStay = bookingSession.matchesStay({
      checkIn,
      checkOut,
      adults,
      children,
      roomGuestsKey,
    });

    if (session && matchesStay && session.cart.length > 0) {
      setCart(session.cart);
    }
    if (!promoFromUrl && session?.pendingCouponCode) {
      setPendingCouponCode(session.pendingCouponCode.trim().toUpperCase());
    }
    if (session?.appliedCoupon?.valid) {
      setAppliedCoupon(session.appliedCoupon);
    }
    setCartRestored(true);
  }, [hasSearch, checkIn, checkOut, adults, children, roomGuestsKey, cartRestored, promoFromUrl]);

  useEffect(() => {
    if (promoFromUrl) {
      setPendingCouponCode(promoFromUrl);
    }
  }, [promoFromUrl]);

  const stayQuery = useQuery({
    queryKey: ["stay", checkIn, checkOut, roomGuestsKey],
    queryFn: () => fetchStay({ checkIn, checkOut, roomGuests }),
    enabled: hasSearch,
  });

  const roomTypesQuery = useQuery({
    queryKey: ["public-room-types-book"],
    queryFn: () => fetchPublicRoomTypes(),
    enabled: hasSearch,
  });


  const stay = stayQuery.data;

  const roomsWithImages = useMemo(() => {
    const catalog = roomTypesQuery.data ?? [];
    return (stay?.rooms ?? []).map((room) => {
      if (room.images && room.images.length > 0) return room;
      const match = catalog.find(
        (item) =>
          item.id === room.roomTypeId ||
          item.name.trim().toLowerCase() === room.name.trim().toLowerCase()
      );
      if (!match?.images?.length) return room;
      return { ...room, images: match.images };
    });
  }, [stay?.rooms, roomTypesQuery.data]);

  useEffect(() => {
    if (stay?.hotelId != null) setHotelId(stay.hotelId);
  }, [stay?.hotelId]);

  const accommodatedGuests = useMemo(
    () => computeGuestCapacity(cart),
    [cart]
  );

  const persistCart = (nextCart: CartItem[], couponCode = pendingCouponCode) => {
    if (!hotelId) return;
    bookingSession.saveRoomSelection({
      hotelId,
      checkIn,
      checkOut,
      adults,
      children,
      roomGuests,
      cart: nextCart,
      pendingCouponCode: couponCode,
    });
  };


  // Server checkout-summary drives tax / discount / total
  useEffect(() => {
    if (!cartRestored || !hotelId || cart.length === 0 || !checkIn || !checkOut) {
      setQuote(null);
      return;
    }

    let cancelled = false;
    const couponCode = pendingCouponCode || undefined;
    const timer = window.setTimeout(() => {
      void (async () => {
        setQuoteLoading(true);
        if (couponCode) setApplyingCoupon(couponCode);
        try {
          const summary = await fetchCheckoutSummary({
            hotelId,
            checkIn,
            checkOut,
            adults,
            children,
            rooms: cart.reduce((sum, item) => sum + item.quantity, 0),
            selections: cart.map((item) => ({
              roomTypeId: item.roomTypeId,
              ratePlanCode: item.ratePlanCode,
              quantity: item.quantity,
            })),
            ...(couponCode ? { couponCode } : {}),
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
            bookingSession.patch({
              pendingCouponCode: summary.couponCode.toUpperCase(),
              appliedCoupon: applied,
            });
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
            bookingSession.patch({
              appliedCoupon: null,
              pendingCouponCode: undefined,
            });
            toast.error(message);
            try {
              const summary = await fetchCheckoutSummary({
                hotelId,
                checkIn,
                checkOut,
                adults,
                children,
                rooms: cart.reduce((sum, item) => sum + item.quantity, 0),
                selections: cart.map((item) => ({
                  roomTypeId: item.roomTypeId,
                  ratePlanCode: item.ratePlanCode,
                  quantity: item.quantity,
                })),
              });
              if (!cancelled) setQuote(checkoutSummaryToQuote(summary));
            } catch {
              if (!cancelled) setQuote(null);
            }
          } else {
            setQuote(null);
            toast.error(message);
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
    cartRestored,
    hotelId,
    checkIn,
    checkOut,
    adults,
    children,
    cart,
    pendingCouponCode,
  ]);

  const updateCartQuantity = (
    room: AvailableRoomType,
    plan: RatePlan,
    delta: number
  ) => {
    const key = `${room.roomTypeId}-${plan.code}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      const currentQty = existing?.quantity ?? 0;
      // Total rooms already selected for this room type across ALL variants.
      const otherVariantsQty = prev
        .filter((item) => item.roomTypeId === room.roomTypeId && item.key !== key)
        .reduce((sum, item) => sum + item.quantity, 0);
      const remaining = Math.max(0, room.availableRooms - otherVariantsQty);
      const nextQty = Math.max(0, Math.min(remaining, currentQty + delta));
      const filtered = prev.filter((item) => item.key !== key);
      const nextCart =
        nextQty === 0
          ? filtered
          : [
              ...filtered,
              {
                key,
                roomTypeId: room.roomTypeId,
                roomTypeName: room.name,
                ratePlanCode: plan.code,
                ratePlanLabel: plan.label,
                quantity: nextQty,
                pricePerNight: plan.pricePerNight,
                maxGuests: room.maxGuests,
                imageUrl: room.primaryImageUrl
                  ? normalizeStorageUrl(room.primaryImageUrl)
                  : undefined,
                totalNights: room.totalNights,
              } satisfies CartItem,
            ];
      persistCart(nextCart);
      return nextCart;
    });
  };

  const getCartQuantity = (roomTypeId: number, ratePlanCode: string) =>
    cart.find((item) => item.key === `${roomTypeId}-${ratePlanCode}`)?.quantity ?? 0;

  const getRoomTypeQuantity = (roomTypeId: number) =>
    cart
      .filter((item) => item.roomTypeId === roomTypeId)
      .reduce((sum, item) => sum + item.quantity, 0);

  const goToCheckout = () => {
    if (!hotelId || cart.length === 0) return;
    bookingSession.saveRoomSelection({
      hotelId,
      checkIn,
      checkOut,
      adults,
      children,
      roomGuests,
      cart,
      pendingCouponCode,
    });
    navigate("/book/checkout");
  };

  const handleContinue = () => {
    if (cart.length === 0) return;
    if (accommodatedGuests < totalGuests) {
      setCapacityModalOpen(true);
      return;
    }
    goToCheckout();
  };

  const displayCheckIn = checkIn ? format(parseISO(checkIn), "dd MMM yyyy") : "";
  const displayCheckOut = checkOut ? format(parseISO(checkOut), "dd MMM yyyy") : "";
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <Navigation />

      <section className="relative pt-24 md:pt-28 pb-6 md:pb-8 bg-[#4b3621]">
        <div className="container mx-auto px-4">
          <div className="text-center m-5 md:mb-6">
            <h1 className="font-playfair text-3xl md:text-4xl text-white mb-2">
              Select rooms
            </h1>
            {hasSearch && (
              <p className="text-white/80 text-sm">
                {displayCheckIn} → {displayCheckOut} · {adults} adult
                {adults === 1 ? "" : "s"}
                {children > 0
                  ? `, ${children} child${children === 1 ? "" : "ren"}`
                  : ""}{" "}
                · {roomGuests.length} room{roomGuests.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <BookingSearchBar />
        </div>
      </section>

      <div className="bg-[#fff3e6] border-b border-orange-100">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-[#4b3621]">
          <span className="font-semibold tracking-wider">BOOK AT BEST PRICE!</span>
          {["Direct reservations", "Price match guarantee", "Your information is secure"].map(
            (item) => (
              <span key={item} className="inline-flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-orange-500" />
                {item}
              </span>
            )
          )}
        </div>
      </div>

      <main className="flex-1 container mx-auto px-3 sm:px-4 pt-4 sm:pt-5 pb-8 sm:pb-10 min-w-0 overflow-x-hidden">
        {!hasSearch && (
          <div className="text-center text-[#8b7355] max-w-xl mx-auto py-8">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-[#b8892f]" />
            <p>Loading availability…</p>
          </div>
        )}

        {hasSearch && (
          <div className="min-w-0 w-full max-w-5xl mx-auto">
              {stayQuery.isLoading && (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {stayQuery.isError && (
                <p className="text-center text-destructive">
                  {(stayQuery.error as Error).message}
                </p>
              )}

              {stayQuery.isSuccess && (
                <div className="space-y-5">
                  {(roomsWithImages.length ?? 0) === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg border">
                      <p className="text-lg font-medium mb-2">No rooms available</p>
                      <p className="text-muted-foreground mb-6">
                        Try different dates or reduce the number of guests.
                      </p>
                      <Link
                        to="/#rooms"
                        className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-sm text-sm font-semibold tracking-wider uppercase"
                      >
                        View All Room Types
                      </Link>
                    </div>
                  ) : (
                    roomsWithImages.map((room) => (
                      <RoomCard
                        key={room.roomTypeId}
                        room={room}
                        ratePlans={room.ratePlans}
                        roomTypeSelectedTotal={getRoomTypeQuantity(room.roomTypeId)}
                        getQuantity={(code) => getCartQuantity(room.roomTypeId, code)}
                        onQuantityChange={(plan, delta) =>
                          updateCartQuantity(room, plan, delta)
                        }
                      />
                    ))
                  )}
                </div>
              )}
          </div>
        )}
      </main>

      {cart.length > 0 ? (
        <div className="sticky bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="container mx-auto px-3 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-neutral-700">
              <span className="font-medium text-[#4b3621]">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} room
                {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "" : "s"} selected
              </span>
              {quote?.totalAmount != null ? (
                <span className="text-neutral-500">
                  {" "}
                  · {formatRoomPrice(Number(quote.totalAmount))} total
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="px-5 py-2.5 text-sm font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-[#c9a227] to-[#4b3621] hover:opacity-95 transition-opacity"
            >
              Continue to checkout ›
            </button>
          </div>
        </div>
      ) : null}

      <CapacityWarningModal
        open={capacityModalOpen}
        onOpenChange={setCapacityModalOpen}
        totalGuests={totalGuests}
        accommodatedGuests={accommodatedGuests}
        cart={cart}
        onSelectMore={() => setCapacityModalOpen(false)}
        onContinueAnyway={() => {
          setCapacityModalOpen(false);
          goToCheckout();
        }}
      />

      <Footer />
    </div>
  );
};

const AMENITY_ICONS: { match: RegExp; icon: LucideIcon }[] = [
  { match: /wifi|wi-fi|internet/i, icon: Wifi },
  { match: /tv|televis|satellite|cable|channel/i, icon: Tv },
  { match: /coffee|tea/i, icon: Coffee },
  { match: /breakfast|dinner|meal|restaurant|food/i, icon: UtensilsCrossed },
  { match: /kitchen/i, icon: Utensils },
  { match: /heat/i, icon: Thermometer },
  { match: /air ?condition|\bac\b|cooling|snow/i, icon: Snowflake },
  { match: /fan|ventilat/i, icon: Wind },
  { match: /wardrobe|closet|cupboard/i, icon: Shirt },
  { match: /pool|swim/i, icon: Waves },
  { match: /park/i, icon: Car },
  { match: /payment|card|bank/i, icon: CreditCard },
  { match: /cancel|policy/i, icon: ShieldCheck },
  { match: /hot water|shower|geyser|bath/i, icon: ShowerHead },
];

function amenityIcon(value: string): LucideIcon {
  return AMENITY_ICONS.find((entry) => entry.match.test(value))?.icon ?? Sparkles;
}

function formatAmenity(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function roomImageUrls(room: AvailableRoomType): string[] {
  const fromList = (room.images ?? [])
    .map((url) => normalizeStorageUrl(url))
    .filter(Boolean);
  if (fromList.length > 0) return fromList;
  if (room.primaryImageUrl) return [normalizeStorageUrl(room.primaryImageUrl)];
  return [];
}

function RoomImageCarousel({
  room,
}: {
  room: AvailableRoomType;
}) {
  const images = roomImageUrls(room);
  const autoplay = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
        No image
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={room.name}
        className={`w-full h-full object-cover ${room.soldOut ? "opacity-60" : ""}`}
      />
    );
  }

  return (
    <Carousel
      className="w-full h-full"
      opts={{ loop: true }}
      plugins={[autoplay.current]}
    >
      <CarouselContent className="ml-0 h-full">
        {images.map((imageUrl, index) => (
          <CarouselItem key={`${room.roomTypeId}-${index}`} className="pl-0 basis-full h-full">
            <div className="relative h-40 sm:h-44 md:h-[200px]">
              <img
                src={imageUrl}
                alt={`${room.name} - Image ${index + 1}`}
                className={`w-full h-full object-cover ${room.soldOut ? "opacity-60" : ""}`}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

const RoomCard = ({
  room,
  ratePlans,
  roomTypeSelectedTotal,
  getQuantity,
  onQuantityChange,
}: {
  room: AvailableRoomType;
  ratePlans?: RatePlan[];
  roomTypeSelectedTotal: number;
  getQuantity: (code: string) => number;
  onQuantityChange: (plan: RatePlan, delta: number) => void;
}) => (
  <article
    className={`bg-white border rounded-lg overflow-hidden shadow-sm w-full min-w-0 ${
      room.soldOut ? "border-neutral-200 opacity-90" : "border-neutral-200"
    }`}
  >
    {/* Room header */}
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-w-0">
      <div
        className={`relative bg-neutral-100 h-40 sm:h-44 md:h-[200px] overflow-hidden ${
          room.soldOut ? "grayscale" : ""
        }`}
      >
        <RoomImageCarousel room={room} />
        {room.soldOut ? (
          <span className="absolute top-2.5 left-2.5 z-10 bg-neutral-800/90 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded tracking-wide uppercase pointer-events-none">
            Sold out
          </span>
        ) : room.availableRooms <= 2 ? (
          <span className="absolute top-2.5 left-2.5 z-10 bg-orange-500 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded pointer-events-none">
            {room.availableRooms} room{room.availableRooms === 1 ? "" : "s"} left
          </span>
        ) : null}
      </div>

      <div className="px-3 sm:px-5 py-3.5 sm:py-4 flex flex-col justify-center gap-1.5 sm:gap-2 md:min-h-[200px] min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-1.5">
          <h2 className="text-lg sm:text-xl font-playfair font-semibold text-[#4b3621] leading-snug break-words">
            {room.name}
          </h2>
          {room.soldOut && (
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded shrink-0">
              Unavailable
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            up to {room.maxGuests} guests
          </span>
          <span className="inline-flex items-center gap-1">
            <Bed className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            {room.soldOut
              ? "No rooms available"
              : `${room.availableRooms} of ${room.totalRooms} available`}
          </span>
        </div>

        {room.description && (
          <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-snug">
            {room.description}
          </p>
        )}

        {room.amenities?.length > 0 && (
          <ul className="flex flex-wrap gap-1 pt-0.5">
            {room.amenities.slice(0, 5).map((amenity) => {
              const Icon = amenityIcon(amenity);
              return (
                <li
                  key={amenity}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-neutral-100 px-1.5 sm:px-2 py-0.5 rounded text-neutral-600 max-w-full"
                >
                  <Icon className="h-3 w-3 text-[#b8892f] shrink-0" />
                  <span className="truncate">{formatAmenity(amenity)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>

    {/* Rates / sold-out footer — same card */}
    <div className="border-t border-neutral-100 min-w-0">
      {room.soldOut ? (
        <div className="px-3 sm:px-5 py-3 bg-neutral-50">
          <p className="text-xs sm:text-sm text-neutral-600 leading-snug">
            Sold out for your selected dates. Try different dates or another room.
          </p>
        </div>
      ) : (
        <>
          <div className="px-3 sm:px-5 pt-2.5 sm:pt-3 pb-1">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Choose a rate and add rooms
            </p>
          </div>
          {ratePlans && ratePlans.length > 0 ? (
            <ul className="min-w-0">
              {ratePlans.map((plan, index) => {
                const qty = getQuantity(plan.code);
                return (
                  <li
                    key={plan.code}
                    className={`px-3 sm:px-5 py-2.5 sm:py-3 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 ${
                      index < ratePlans.length - 1 ? "border-b border-neutral-100" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-neutral-800 leading-snug break-words">
                        {plan.label}
                      </p>

                      {plan.features && plan.features.length > 0 && (
                        <ul className="mt-1.5 flex flex-col gap-0.5 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:gap-x-3 min-[400px]:gap-y-0.5">
                          {plan.features.slice(0, 3).map((feature) => {
                            const Icon = amenityIcon(feature);
                            return (
                              <li
                                key={feature}
                                className="inline-flex items-start gap-1 text-[11px] sm:text-xs text-neutral-500 min-w-0"
                              >
                                <Icon className="h-3 w-3 text-[#b8892f] shrink-0 mt-0.5" />
                                <span className="break-words leading-snug">{feature}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 w-full sm:w-auto">
                      <div className="sm:text-right min-w-[5.5rem]">
                        <p className="text-base sm:text-lg font-semibold text-orange-600 leading-none tabular-nums">
                          {formatRoomPrice(plan.pricePerNight)}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-neutral-500 mt-0.5 leading-tight whitespace-nowrap">
                          per night + taxes
                        </p>
                      </div>
                      {qty === 0 ? (
                        <button
                          type="button"
                          className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#4b3621] border border-[#d4c4a8] rounded-sm bg-white hover:bg-[#faf8f5] disabled:opacity-40 touch-manipulation whitespace-nowrap"
                          onClick={() => onQuantityChange(plan, 1)}
                          disabled={roomTypeSelectedTotal >= room.availableRooms}
                          aria-label={`Add room — ${plan.label}`}
                        >
                          Add room
                        </button>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-400 leading-none">
                            Rooms
                          </p>
                          <div className="inline-flex items-center border border-neutral-300 rounded-sm shrink-0">
                            <button
                              type="button"
                              className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center disabled:opacity-40 touch-manipulation"
                              onClick={() => onQuantityChange(plan, -1)}
                              aria-label={`Remove room — ${plan.label}`}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="h-8 sm:h-9 min-w-[3.25rem] px-1.5 flex items-center justify-center border-x border-neutral-300 text-sm tabular-nums text-[#4b3621]">
                              {qty}
                            </span>
                            <button
                              type="button"
                              className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center disabled:opacity-40 touch-manipulation"
                              onClick={() => onQuantityChange(plan, 1)}
                              disabled={roomTypeSelectedTotal >= room.availableRooms}
                              aria-label={`Add room — ${plan.label}`}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-3 sm:px-5 py-3 text-sm text-neutral-500">No rate plans available.</p>
          )}
        </>
      )}
    </div>
  </article>
);

export default Book;
