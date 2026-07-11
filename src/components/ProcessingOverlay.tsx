import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps {
  open: boolean;
  message?: string;
  detail?: string;
}

const ProcessingOverlay = ({
  open,
  message = "Processing payment…",
  detail = "Please wait while we verify your payment. Do not close or refresh this page.",
}: ProcessingOverlayProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#4b3621]/80 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-live="assertive"
      aria-label={message}
    >
      <div className="mx-4 max-w-sm rounded-lg bg-white px-8 py-10 text-center shadow-xl">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#4b3621]" />
        <p className="mt-5 font-playfair text-xl text-[#4b3621]">{message}</p>
        {detail ? (
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{detail}</p>
        ) : null}
      </div>
    </div>
  );
};

export default ProcessingOverlay;
