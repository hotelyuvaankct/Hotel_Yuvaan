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
import {
  sanitizePhoneInput,
  validateGuestFields,
  type GuestFieldErrors,
} from "@/lib/guestValidation";

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
  const [fieldErrors, setFieldErrors] = useState<GuestFieldErrors>({});

  const updateField = <K extends keyof GuestFormData>(key: K, value: GuestFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateGuestFields(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#4b3621]">
            Guest details
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={form.guestFirstName}
                onChange={(e) => updateField("guestFirstName", e.target.value)}
                className="rounded-none"
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
                value={form.guestLastName}
                onChange={(e) => updateField("guestLastName", e.target.value)}
                className="rounded-none"
                placeholder="Enter last name"
                aria-invalid={Boolean(fieldErrors.guestLastName)}
              />
              {fieldErrors.guestLastName ? (
                <p className="text-sm text-destructive mt-1">{fieldErrors.guestLastName}</p>
              ) : null}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              value={form.guestEmail}
              onChange={(e) => updateField("guestEmail", e.target.value)}
              className="rounded-none"
              placeholder="name@example.com"
              aria-invalid={Boolean(fieldErrors.guestEmail)}
            />
            {fieldErrors.guestEmail ? (
              <p className="text-sm text-destructive mt-1">{fieldErrors.guestEmail}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              value={form.guestPhone}
              onChange={(e) => updateField("guestPhone", sanitizePhoneInput(e.target.value))}
              className="rounded-none"
              placeholder="e.g. 9876543210"
              aria-invalid={Boolean(fieldErrors.guestPhone)}
            />
            {fieldErrors.guestPhone ? (
              <p className="text-sm text-destructive mt-1">{fieldErrors.guestPhone}</p>
            ) : null}
          </div>
          <Button
            type="submit"
            variant="dark"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Confirming…" : "Confirm booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestCheckoutForm;
