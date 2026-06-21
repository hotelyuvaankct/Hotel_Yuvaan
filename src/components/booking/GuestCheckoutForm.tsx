import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface GuestFormData {
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
}

interface GuestCheckoutFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GuestFormData) => void;
  loading?: boolean;
}

const GuestCheckoutForm = ({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: GuestCheckoutFormProps) => {
  const [form, setForm] = useState<GuestFormData>({
    guestFirstName: "",
    guestLastName: "",
    guestEmail: "",
    guestPhone: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.guestFirstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!form.guestLastName.trim()) {
      setError("Last name is required");
      return;
    }
    if (!form.guestEmail.trim() || !form.guestEmail.includes("@")) {
      setError("Valid email is required");
      return;
    }
    if (!form.guestPhone.trim() || form.guestPhone.trim().length < 10) {
      setError("Valid phone number is required");
      return;
    }
    setError(null);
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl text-[#4b3621]">
            Guest details
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={form.guestFirstName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, guestFirstName: e.target.value }))
                }
                className="rounded-none"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={form.guestLastName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, guestLastName: e.target.value }))
                }
                className="rounded-none"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.guestEmail}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, guestEmail: e.target.value }))
              }
              className="rounded-none"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={form.guestPhone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, guestPhone: e.target.value }))
              }
              className="rounded-none"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-none bg-[#4b3621] hover:bg-[#3d2b1a]"
          >
            {loading ? "Confirming…" : "Confirm booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestCheckoutForm;
