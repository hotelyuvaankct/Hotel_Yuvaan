import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { format, parseISO, addDays, startOfToday } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Minus, Plus, Users, Bed, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BookingSearchBar from "@/components/BookingSearchBar";
import BookingSidebar, { type CartItem } from "@/components/booking/BookingSidebar";
import CapacityWarningModal from "@/components/booking/CapacityWarningModal";
import {
  computeGuestCapacity,
  decodeRoomGuests,
  fetchBookingConfig,
  fetchRatePlans,
  resolveDefaultHotelId,
  searchAvailabilityWithRooms,
  type AvailableRoomType,
  type BookingConfig,
  type RatePlan,
} from "@/services/bookingService";
import { bookingSession } from "@/lib/bookingSessionManager";
import { buildBookUrl, formatRoomPrice, normalizeStorageUrl } from "@/services/roomService";
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
  const [ratePlansByRoom, setRatePlansByRoom] = useState<Record<number, RatePlan[]>>({});
  const [loadingRates, setLoadingRates] = useState(false);
  const [capacityModalOpen, setCapacityModalOpen] = useState(false);
  const [cartRestored, setCartRestored] = useState(false);

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
    resolveDefaultHotelId()
      .then(setHotelId)
      .catch((error: Error) => toast.error(error.message));
  }, []);

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
    setCartRestored(true);
  }, [hasSearch, checkIn, checkOut, adults, children, roomGuestsKey, cartRestored]);

  const configQuery = useQuery({
    queryKey: ["bookingConfig"],
    queryFn: fetchBookingConfig,
  });

  const availabilityQuery = useQuery({
    queryKey: ["availability", hotelId, checkIn, checkOut, roomGuests],
    queryFn: () =>
      searchAvailabilityWithRooms({
        hotelId: hotelId!,
        checkIn,
        checkOut,
        roomGuests,
      }),
    enabled: hasSearch && hotelId != null,
  });

  const accommodatedGuests = useMemo(
    () => computeGuestCapacity(cart),
    [cart]
  );

  useEffect(() => {
    if (!hasSearch || !checkIn || !checkOut || !availabilityQuery.data?.length) {
      setRatePlansByRoom({});
      return;
    }

    let cancelled = false;
    const availableRooms = availabilityQuery.data.filter((room) => !room.soldOut);
    setLoadingRates(true);

    Promise.all(
      availableRooms.map(async (room) => {
        const plans = await fetchRatePlans({
          roomTypeId: room.roomTypeId,
          checkIn,
          checkOut,
          rooms: 1,
        });
        return [room.roomTypeId, plans] as const;
      })
    )
      .then((entries) => {
        if (cancelled) return;
        setRatePlansByRoom(Object.fromEntries(entries));
      })
      .catch((error: Error) => {
        if (!cancelled) toast.error(error.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingRates(false);
      });

    return () => {
      cancelled = true;
    };
  }, [availabilityQuery.data, checkIn, checkOut, hasSearch]);

  const persistCart = (nextCart: CartItem[]) => {
    if (!hotelId) return;
    bookingSession.saveRoomSelection({
      hotelId,
      checkIn,
      checkOut,
      adults,
      children,
      roomGuests,
      cart: nextCart,
      pendingCouponCode: promoFromUrl || bookingSession.load()?.pendingCouponCode,
    });
  };

  const updateCartQuantity = (
    room: AvailableRoomType,
    plan: RatePlan,
    delta: number
  ) => {
    const key = `${room.roomTypeId}-${plan.code}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      const currentQty = existing?.quantity ?? 0;
      const nextQty = Math.max(0, Math.min(room.availableRooms, currentQty + delta));
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
      pendingCouponCode: promoFromUrl || bookingSession.load()?.pendingCouponCode,
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
  const config = configQuery.data as BookingConfig | undefined;

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <Navigation />

      <section className="relative pt-28 pb-10 bg-[#4b3621]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
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

      <main className="flex-1 container mx-auto px-4 py-10">
        {!hasSearch && (
          <div className="text-center text-[#8b7355] max-w-xl mx-auto py-8">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-[#b8892f]" />
            <p>Loading availability…</p>
          </div>
        )}

        {hasSearch && (
          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            <div>
              {availabilityQuery.isLoading && (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {availabilityQuery.isError && (
                <p className="text-center text-destructive">
                  {(availabilityQuery.error as Error).message}
                </p>
              )}

              {availabilityQuery.isSuccess && (
                <div className="space-y-6">
                  {availabilityQuery.data.length === 0 ? (
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
                    availabilityQuery.data.map((room) => (
                      <RoomCard
                        key={room.roomTypeId}
                        room={room}
                        ratePlans={ratePlansByRoom[room.roomTypeId]}
                        loadingRates={loadingRates && !ratePlansByRoom[room.roomTypeId]}
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

            <BookingSidebar
              checkIn={checkIn}
              checkOut={checkOut}
              cart={cart}
              quote={null}
              config={config ?? null}
              onContinue={handleContinue}
              showCoupons={false}
              continueLabel="Continue to checkout ›"
            />
          </div>
        )}
      </main>

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

const RoomCard = ({
  room,
  ratePlans,
  loadingRates,
  getQuantity,
  onQuantityChange,
}: {
  room: AvailableRoomType;
  ratePlans?: RatePlan[];
  loadingRates: boolean;
  getQuantity: (code: string) => number;
  onQuantityChange: (plan: RatePlan, delta: number) => void;
}) => (
  <article className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
    <div className="grid md:grid-cols-[280px_1fr] gap-0">
      <div className="relative bg-neutral-100 min-h-[200px]">
        {room.primaryImageUrl ? (
          <img
            src={normalizeStorageUrl(room.primaryImageUrl)}
            alt={room.name}
            className="w-full h-full object-cover min-h-[200px]"
          />
        ) : (
          <div className="w-full h-full min-h-[200px] flex items-center justify-center text-neutral-400">
            No image
          </div>
        )}
        {room.soldOut && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Sold out
          </span>
        )}
        {!room.soldOut && room.availableRooms <= 2 && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {room.availableRooms} room{room.availableRooms === 1 ? "" : "s"} left
          </span>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-xl font-playfair font-semibold text-[#4b3621]">
          {room.name}
        </h2>

        <div className="flex flex-wrap gap-4 text-sm text-neutral-500 mt-2 mb-3">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            up to {room.maxGuests} guests
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bed className="h-4 w-4" />
            {room.availableRooms} of {room.totalRooms} available
          </span>
        </div>

        {room.description && (
          <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{room.description}</p>
        )}

        {room.amenities?.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-4">
            {room.amenities.slice(0, 6).map((amenity) => (
              <li
                key={amenity}
                className="text-xs bg-neutral-100 px-2 py-1 rounded text-neutral-600"
              >
                {amenity}
              </li>
            ))}
          </ul>
        )}

        {!room.soldOut && (
          <div className="border-t border-neutral-100 pt-4 mt-2 space-y-4">
            {loadingRates ? (
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading rate plans…
              </div>
            ) : ratePlans && ratePlans.length > 0 ? (
              ratePlans.map((plan) => {
                const qty = getQuantity(plan.code);
                return (
                  <div
                    key={plan.code}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-neutral-50 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm text-neutral-800">{plan.label}</p>
                      <ul className="text-xs text-neutral-500 mt-1 space-y-0.5">
                        {plan.features?.slice(0, 3).map((feature) => (
                          <li key={feature}>· {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-orange-600">
                          {formatRoomPrice(plan.pricePerNight)}
                        </p>
                        <p className="text-xs text-neutral-500">per night, taxes incl.</p>
                      </div>
                      <div className="inline-flex items-center border border-neutral-300">
                        <button
                          type="button"
                          className="h-9 w-9 flex items-center justify-center disabled:opacity-40"
                          onClick={() => onQuantityChange(plan, -1)}
                          disabled={qty <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="h-9 min-w-[2rem] flex items-center justify-center border-x border-neutral-300 text-sm">
                          {qty}
                        </span>
                        <button
                          type="button"
                          className="h-9 w-9 flex items-center justify-center disabled:opacity-40"
                          onClick={() => onQuantityChange(plan, 1)}
                          disabled={qty >= room.availableRooms}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-neutral-500">No rate plans available.</p>
            )}
          </div>
        )}

        {room.soldOut && (
          <p className="text-sm text-neutral-500 mt-2">This room type is sold out for your dates.</p>
        )}
      </div>
    </div>
  </article>
);

export default Book;
