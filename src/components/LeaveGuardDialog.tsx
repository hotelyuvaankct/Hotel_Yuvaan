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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-guard-title"
    >
      <div className="w-full max-w-md rounded-xl border border-[#e8dfd0] bg-white p-6 shadow-xl">
        <h2
          id="leave-guard-title"
          className="font-playfair text-xl font-bold text-[#4b3621]"
        >
          Leave booking?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onStay}>
            Stay on page
          </Button>
          <Button type="button" variant="dark" size="sm" onClick={onLeave}>
            Leave anyway
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaveGuardDialog;
