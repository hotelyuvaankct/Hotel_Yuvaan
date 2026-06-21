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
  onContinueAnyway: () => void;
}

const CapacityWarningModal = ({
  open,
  onOpenChange,
  totalGuests,
  accommodatedGuests,
  cart,
  onSelectMore,
  onContinueAnyway,
}: CapacityWarningModalProps) => {
  const unaccommodated = totalGuests - accommodatedGuests;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-none">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl text-[#4b3621]">
            Rooms cannot accommodate all guests
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-neutral-600">
          You haven&apos;t selected accommodation for {unaccommodated} guest
          {unaccommodated === 1 ? "" : "s"}. Select more rooms or continue booking?
        </p>
        <p className="text-sm font-medium text-neutral-800">
          {accommodatedGuests} out of {totalGuests} guests accommodated
        </p>
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
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onSelectMore} className="rounded-none">
            Select more rooms
          </Button>
          <Button
            onClick={onContinueAnyway}
            className="rounded-none bg-[#4b3621] hover:bg-[#3d2b1a]"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CapacityWarningModal;
