import { Button } from "@/components/ui/button";

type LeaveGuardDialogProps = {
  open: boolean;
  message: string;
  onStay: () => void;
  onLeave: () => void;
};

const LeaveGuardDialog = ({
  open,
  message,
  onStay,
  onLeave,
}: LeaveGuardDialogProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-3 min-[380px]:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-guard-title"
    >
      <div className="w-full max-w-[min(100%,22rem)] min-[380px]:max-w-md rounded-xl border border-gold-border bg-white p-4 min-[380px]:p-5 sm:p-6 shadow-xl">
        <h2
          id="leave-guard-title"
          className="font-playfair text-lg min-[380px]:text-xl font-bold text-brand leading-snug"
        >
          Leave booking?
        </h2>
        <p className="mt-2 text-xs min-[380px]:text-sm text-muted-foreground leading-relaxed">
          {message}
        </p>
        <div className="mt-4 min-[380px]:mt-6 flex flex-col-reverse min-[380px]:flex-row min-[380px]:flex-wrap min-[380px]:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onStay}
            className="h-9 w-full min-[380px]:h-8 min-[380px]:w-auto px-3 text-xs sm:text-sm"
          >
            Stay on page
          </Button>
          <Button
            type="button"
            variant="dark"
            size="sm"
            onClick={onLeave}
            className="h-9 w-full min-[380px]:h-8 min-[380px]:w-auto px-3 text-xs sm:text-sm"
          >
            Leave anyway
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaveGuardDialog;
