import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/components/booking/BookingSidebar";

interface CapacityWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalGuests: number;
  accommodatedGuests: number;
  cart: CartItem[];
  onSelectMore: () => void;
}

const CapacityWarningModal = ({
  open,
  onOpenChange,
  totalGuests,
  accommodatedGuests,
  cart,
  onSelectMore,
}: CapacityWarningModalProps) => {
  const unaccommodated = Math.max(0, totalGuests - accommodatedGuests);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-none">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl text-brand">
            Not enough room for all guests
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-neutral-600">
          Your selected rooms can fit {accommodatedGuests} of {totalGuests} guests.{" "}
          <span className="font-medium text-brand">
            {unaccommodated} guest{unaccommodated === 1 ? "" : "s"} still need a room.
          </span>{" "}
          Please add more rooms before continuing.
        </p>
        <p className="text-sm font-medium text-neutral-800">
          {accommodatedGuests} / {totalGuests} guests accommodated
        </p>
        {cart.length > 0 ? (
          <ul className="space-y-2 my-4">
            {cart.map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-3 text-sm border border-neutral-100 p-2 rounded"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.roomTypeName}</p>
                  <p className="text-xs text-neutral-500">
                    Up to {item.maxGuests} guests × {item.quantity}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex justify-end gap-3">
          <Button
            variant="dark"
            onClick={() => {
              onSelectMore();
              onOpenChange(false);
            }}
          >
            Add rooms / fix guests
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CapacityWarningModal;
