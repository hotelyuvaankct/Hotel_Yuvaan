import React, { useMemo, useState, useEffect } from "react";
import { Calendar as CalendarIcon, Minus, Plus, Trash2, Users } from "lucide-react";
import {
  format,
  addDays,
  parseISO,
  isBefore,
  startOfToday,
  startOfDay,
} from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import { buildBookUrl } from "@/services/roomService";
import {
  decodeRoomGuests,
  fetchBookingConfig,
  type BookingConfig,
} from "@/services/bookingService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface RoomGuests {
  adults: number;
  children: number;
}

interface GuestSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: RoomGuests[];
  onChange: (rooms: RoomGuests[]) => void;
  config: BookingConfig | null;
}

export const GuestSelectorModal: React.FC<GuestSelectorModalProps> = ({
  open,
  onOpenChange,
  rooms,
  onChange,
  config,
}) => {
  const maxRooms = config?.maxRooms ?? 10;
  const minAdults = config?.minAdultsPerRoom ?? 1;
  const maxAdults = config?.maxAdultsPerRoom ?? 4;
  const maxChildren = config?.maxChildrenPerRoom ?? 2;

  const updateRoom = (index: number, patch: Partial<RoomGuests>) => {
    onChange(
      rooms.map((room, i) => (i === index ? { ...room, ...patch } : room))
    );
  };

  const addRoom = () => {
    if (rooms.length >= maxRooms) return;
    onChange([...rooms, { adults: 2, children: 0 }]);
  };

  const removeRoom = (index: number) => {
    if (rooms.length <= 1) return;
    onChange(rooms.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-lg border-[#e8dfd0] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 bg-[#faf8f5]">
          <DialogTitle className="font-playfair text-2xl font-semibold text-[#4b3621]">
            Guests
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="space-y-4 border-b border-[#e8dfd0] pb-4 last:border-0"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#8b7355] uppercase">
                  Room {index + 1}
                </p>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeRoom(index)}
                    className="text-neutral-400 hover:text-red-600 transition-colors"
                    aria-label={`Remove room ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <CounterRow
                label="Adults"
                value={room.adults}
                min={minAdults}
                max={maxAdults}
                onChange={(adults) => updateRoom(index, { adults })}
              />

              <CounterRow
                label="Children under 12 years old"
                value={room.children}
                min={0}
                max={maxChildren}
                onChange={(children) => updateRoom(index, { children })}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#e8dfd0] px-6 py-4 bg-[#faf8f5]">
          <Button
            type="button"
            variant="outline"
            className="rounded-md border-[#d4c4a8] text-[#4b3621] hover:bg-[#f5efe6]"
            onClick={addRoom}
            disabled={rooms.length >= maxRooms}
          >
            + Add a room
          </Button>
          <Button
            type="button"
            className="rounded-md bg-[#4b3621] hover:bg-[#3d2b1a] text-white px-8"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface CounterRowProps {
  label: string;
  value: number;
  min: number;
  max?: number;
  onChange: (value: number) => void;
}

const CounterRow: React.FC<CounterRowProps> = ({
  label,
  value,
  min,
  max,
  onChange,
}) => (
  <div>
    <p className="text-sm text-[#6b5a45] mb-2">{label}</p>
    <div className="inline-flex items-center border border-[#d4c4a8] rounded-md overflow-hidden">
      <button
        type="button"
        className="h-10 w-10 flex items-center justify-center text-[#4b3621] hover:bg-[#f5efe6] disabled:opacity-40"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="h-10 min-w-[3rem] px-3 flex items-center justify-center border-x border-[#d4c4a8] text-sm font-medium text-[#4b3621]">
        {value}
      </span>
      <button
        type="button"
        className="h-10 w-10 flex items-center justify-center text-[#4b3621] hover:bg-[#f5efe6] disabled:opacity-40"
        onClick={() => onChange(max != null ? Math.min(max, value + 1) : value + 1)}
        disabled={max != null && value >= max}
        aria-label={`Increase ${label}`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  </div>
);

const toInputDate = (date: Date) => format(date, "yyyy-MM-dd");

const displayDate = (value: string) => {
  try {
    return format(parseISO(value), "dd MMM yyyy");
  } catch {
    return value;
  }
};

const BookingSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const today = startOfToday();
  const defaultCheckIn = toInputDate(addDays(today, 1));
  const defaultCheckOut = toInputDate(addDays(today, 2));

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guestRooms, setGuestRooms] = useState<RoomGuests[]>([
    { adults: 2, children: 0 },
  ]);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [bookingConfig, setBookingConfig] = useState<BookingConfig | null>(null);

  useEffect(() => {
    fetchBookingConfig().then(setBookingConfig).catch(() => undefined);
  }, []);

  useEffect(() => {
    const urlCheckIn = searchParams.get("checkIn");
    const urlCheckOut = searchParams.get("checkOut");
    const urlRoomGuests = decodeRoomGuests(searchParams.get("roomGuests"));

    if (urlCheckIn) setCheckIn(urlCheckIn);
    if (urlCheckOut) setCheckOut(urlCheckOut);
    if (urlRoomGuests) setGuestRooms(urlRoomGuests);
  }, [searchParams]);

  const totals = useMemo(() => {
    return guestRooms.reduce(
      (acc, room) => ({
        adults: acc.adults + room.adults,
        children: acc.children + room.children,
      }),
      { adults: 0, children: 0 }
    );
  }, [guestRooms]);

  const guestSummary = `${totals.adults} adult${totals.adults === 1 ? "" : "s"}, ${guestRooms.length} room${guestRooms.length === 1 ? "" : "s"}`;

  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    const checkInDate = parseISO(value);
    const checkOutDate = parseISO(checkOut);
    if (!isBefore(checkInDate, checkOutDate)) {
      setCheckOut(toInputDate(addDays(checkInDate, 1)));
    }
  };

  const handleSearch = () => {
    const promo = searchParams.get("promo")?.trim() || undefined;
    navigate(
      buildBookUrl({
        checkIn,
        checkOut,
        adults: totals.adults,
        children: totals.children,
        rooms: guestRooms.length,
        roomGuests: guestRooms,
        promo,
      })
    );
  };

  const checkInDate = parseISO(checkIn);
  const checkOutDate = parseISO(checkOut);
  const minCheckOut = addDays(checkInDate, 1);

  return (
    <>
      <div className="w-full max-w-6xl mx-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-[0_8px_40px_rgba(75,54,33,0.15)] border border-[#e8dfd0] overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="hidden lg:flex flex-col justify-center px-6 py-5 min-w-[170px] border-b lg:border-b-0 lg:border-r border-[#e8dfd0] bg-[#faf8f5]">
            <p className="font-playfair text-xl text-[#4b3621] font-semibold leading-tight">
              Book Online
            </p>
            <p className="text-xs text-[#8b7355] mt-1">Guaranteed accommodation</p>
          </div>

          <DatePickerField
            label="Check-in"
            value={checkIn}
            displayValue={displayDate(checkIn)}
            open={checkInOpen}
            onOpenChange={setCheckInOpen}
            selected={checkInDate}
            disabled={(date) => startOfDay(date) < today}
            onSelect={(date) => {
              if (!date) return;
              handleCheckInChange(toInputDate(date));
              setCheckInOpen(false);
            }}
          />

          <DatePickerField
            label="Check-out"
            value={checkOut}
            displayValue={displayDate(checkOut)}
            open={checkOutOpen}
            onOpenChange={setCheckOutOpen}
            selected={checkOutDate}
            disabled={(date) => startOfDay(date) < minCheckOut}
            onSelect={(date) => {
              if (!date) return;
              setCheckOut(toInputDate(date));
              setCheckOutOpen(false);
            }}
          />

          <button
            type="button"
            onClick={() => setGuestModalOpen(true)}
            className="flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-[#e8dfd0] text-left hover:bg-[#faf8f5] transition-colors min-w-[200px]"
          >
            <Users className="h-4 w-4 text-[#b8892f] shrink-0" />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#8b7355] mb-0.5">
                Guests
              </p>
              <p className="text-sm text-[#4b3621] font-medium">{guestSummary}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="px-8 py-5 text-sm font-semibold tracking-[0.15em] uppercase text-white bg-gradient-to-r from-[#c9a227] via-[#b8892f] to-[#4b3621] hover:brightness-105 active:scale-[0.99] transition-all"
          >
            Find Room
          </button>
        </div>
      </div>

      <GuestSelectorModal
        open={guestModalOpen}
        onOpenChange={setGuestModalOpen}
        rooms={guestRooms}
        onChange={setGuestRooms}
        config={bookingConfig}
      />
    </>
  );
};

interface DatePickerFieldProps {
  label: string;
  value: string;
  displayValue: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Date;
  disabled: (date: Date) => boolean;
  onSelect: (date: Date | undefined) => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  displayValue,
  open,
  onOpenChange,
  selected,
  disabled,
  onSelect,
}) => (
  <Popover open={open} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild>
      <button
        type="button"
        className={cn(
          "flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-[#e8dfd0]",
          "text-left hover:bg-[#faf8f5] transition-colors min-w-[180px] w-full",
          open && "bg-[#faf8f5] ring-1 ring-inset ring-[#c9a227]/40"
        )}
        aria-label={`Select ${label}`}
      >
        <CalendarIcon className="h-4 w-4 text-[#b8892f] shrink-0" />
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[#8b7355] mb-0.5">
            {label}
          </p>
          <p className="text-sm text-[#4b3621] font-medium">{displayValue}</p>
        </div>
      </button>
    </PopoverTrigger>
    <PopoverContent
      className="w-auto p-0 border-[#e8dfd0] shadow-xl rounded-lg overflow-hidden"
      align="start"
      sideOffset={8}
    >
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        initialFocus
        className="rounded-lg bg-white"
      />
    </PopoverContent>
  </Popover>
);

export default BookingSearchBar;
