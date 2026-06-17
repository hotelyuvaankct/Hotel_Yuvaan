import React, { useMemo, useState } from "react";
import { Calendar, Minus, Plus, Users } from "lucide-react";
import { format, addDays, parseISO, isBefore, startOfToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { buildBookUrl } from "@/services/roomService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RoomGuests {
  adults: number;
  children: number;
}

interface GuestSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: RoomGuests[];
  onChange: (rooms: RoomGuests[]) => void;
}

export const GuestSelectorModal: React.FC<GuestSelectorModalProps> = ({
  open,
  onOpenChange,
  rooms,
  onChange,
}) => {
  const updateRoom = (index: number, patch: Partial<RoomGuests>) => {
    onChange(
      rooms.map((room, i) => (i === index ? { ...room, ...patch } : room))
    );
  };

  const addRoom = () => {
    onChange([...rooms, { adults: 2, children: 0 }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-none border-neutral-200 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-playfair text-2xl font-semibold text-[#4b3621]">
            Guests
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4 space-y-6 max-h-[60vh] overflow-y-auto">
          {rooms.map((room, index) => (
            <div key={index} className="space-y-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                Room {index + 1}
              </p>

              <CounterRow
                label="Adults"
                value={room.adults}
                min={1}
                onChange={(adults) => updateRoom(index, { adults })}
              />

              <CounterRow
                label="children under 12 years old"
                value={room.children}
                min={0}
                onChange={(children) => updateRoom(index, { children })}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-6 py-4 bg-neutral-50">
          <Button
            type="button"
            variant="outline"
            className="rounded-none border-neutral-300 text-neutral-700"
            onClick={addRoom}
          >
            + Add a room
          </Button>
          <Button
            type="button"
            className="rounded-none bg-[#4b3621] hover:bg-[#3d2b1a] text-white px-8"
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
  onChange: (value: number) => void;
}

const CounterRow: React.FC<CounterRowProps> = ({
  label,
  value,
  min,
  onChange,
}) => (
  <div>
    <p className="text-sm text-neutral-600 mb-2">{label}</p>
    <div className="inline-flex items-center border border-neutral-300">
      <button
        type="button"
        className="h-10 w-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="h-10 min-w-[3rem] px-3 flex items-center justify-center border-x border-neutral-300 text-sm font-medium">
        {value}
      </span>
      <button
        type="button"
        className="h-10 w-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
        onClick={() => onChange(value + 1)}
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
    return format(parseISO(value), "dd/MM/yyyy");
  } catch {
    return value;
  }
};

const BookingSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const today = startOfToday();
  const defaultCheckIn = toInputDate(addDays(today, 1));
  const defaultCheckOut = toInputDate(addDays(today, 2));

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guestRooms, setGuestRooms] = useState<RoomGuests[]>([
    { adults: 2, children: 0 },
  ]);
  const [promo, setPromo] = useState("");
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  const totals = useMemo(() => {
    return guestRooms.reduce(
      (acc, room) => ({
        adults: acc.adults + room.adults,
        children: acc.children + room.children,
      }),
      { adults: 0, children: 0 }
    );
  }, [guestRooms]);

  const guestSummary = `${totals.adults} adult${totals.adults === 1 ? "" : "s"}, ${totals.children} child${totals.children === 1 ? "" : "ren"}`;

  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    const checkInDate = parseISO(value);
    const checkOutDate = parseISO(checkOut);
    if (!isBefore(checkInDate, checkOutDate)) {
      setCheckOut(toInputDate(addDays(checkInDate, 1)));
    }
  };

  const handleSearch = () => {
    navigate(
      buildBookUrl({
        checkIn,
        checkOut,
        adults: totals.adults,
        children: totals.children,
        rooms: guestRooms.length,
        promo,
      })
    );
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto bg-white rounded-sm shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="hidden lg:flex flex-col justify-center px-6 py-5 min-w-[170px] border-b lg:border-b-0 lg:border-r border-neutral-200">
            <p className="font-playfair text-xl text-[#4b3621] font-semibold leading-tight">
              Book Online
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Guaranteed accommodation
            </p>
          </div>

          <DateField
            label="Check-in"
            value={checkIn}
            min={toInputDate(today)}
            displayValue={displayDate(checkIn)}
            onChange={handleCheckInChange}
          />

          <DateField
            label="Check-out"
            value={checkOut}
            min={toInputDate(addDays(parseISO(checkIn), 1))}
            displayValue={displayDate(checkOut)}
            onChange={setCheckOut}
          />

          <button
            type="button"
            onClick={() => setGuestModalOpen(true)}
            className="flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-neutral-200 text-left hover:bg-neutral-50 transition-colors min-w-[200px]"
          >
            <Users className="h-4 w-4 text-neutral-500 shrink-0" />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-0.5">
                Guests
              </p>
              <p className="text-sm text-neutral-800">{guestSummary}</p>
            </div>
          </button>

          <div className="flex items-center px-5 py-4 border-b lg:border-b-0 lg:border-r border-neutral-200 flex-1 min-w-[140px]">
            <input
              type="text"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code"
              className="w-full text-sm text-neutral-800 placeholder:text-neutral-400 outline-none bg-transparent"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="px-8 py-5 text-sm font-semibold tracking-[0.15em] uppercase text-white bg-gradient-to-r from-[#c9a227] via-[#b8892f] to-[#4b3621] hover:opacity-95 transition-opacity"
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
      />
    </>
  );
};

interface DateFieldProps {
  label: string;
  value: string;
  min: string;
  displayValue: string;
  onChange: (value: string) => void;
}

const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  min,
  displayValue,
  onChange,
}) => (
  <label className="relative flex items-center gap-3 px-5 py-4 border-b lg:border-b-0 lg:border-r border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer min-w-[170px]">
    <Calendar className="h-4 w-4 text-neutral-500 shrink-0 pointer-events-none" />
    <div className="pointer-events-none">
      <p className="text-[11px] uppercase tracking-wider text-neutral-500 mb-0.5">
        {label}
      </p>
      <p className="text-sm text-neutral-800">{displayValue}</p>
    </div>
    <input
      type="date"
      value={value}
      min={min}
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 opacity-0 cursor-pointer"
      aria-label={label}
    />
  </label>
);

export default BookingSearchBar;
