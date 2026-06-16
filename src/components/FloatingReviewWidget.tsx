import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitReview } from "@/services/reviewService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const RATING_LABELS: Record<number, string> = {
  1: "Poor — we can do better",
  2: "Fair — room for improvement",
  3: "Good — a pleasant stay",
  4: "Very good — exceeded expectations",
  5: "Amazing, above expectations!",
};

const FloatingReviewWidget = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({
    rating: 5,
    review: "",
  });
  const { toast } = useToast();

  const activeRating = hoverRating || form.rating;
  const ratingLabel = useMemo(
    () => RATING_LABELS[activeRating] ?? RATING_LABELS[5],
    [activeRating]
  );

  const resetForm = () => {
    setForm({ rating: 5, review: "" });
    setHoverRating(0);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await submitReview({
        rating: form.rating,
        review: form.review.trim(),
      });
      toast({
        title: "Thank you for your review!",
        description:
          result.message ?? "We have received your feedback.",
      });
      handleClose();
    } catch (error) {
      toast({
        title: "Could not submit review",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-6 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 md:right-6 md:bottom-8 md:px-5"
        aria-label="Leave a review"
      >
        <Star className="h-5 w-5 fill-current" />
        <span className="text-sm font-semibold hidden sm:inline">
          Leave a Review
        </span>
      </button>

      <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
        <DialogContent className="max-w-xl gap-0 p-0 overflow-hidden">
          <div className="border-b px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="text-sm font-medium text-primary hover:underline"
            >
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4">
            <DialogHeader className="space-y-4 text-center sm:text-center">
              <DialogTitle className="text-2xl font-bold font-playfair">
                Why did you leave this rating?
              </DialogTitle>
              <DialogDescription className="text-base text-foreground font-medium">
                {ratingLabel}
              </DialogDescription>
            </DialogHeader>

            <div
              className="flex justify-center gap-2 my-6"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`Rate ${value} stars`}
                  onMouseEnter={() => setHoverRating(value)}
                  onClick={() => setForm((prev) => ({ ...prev, rating: value }))}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-10 w-10",
                      value <= activeRating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-muted-foreground/40"
                    )}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={form.review}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, review: event.target.value }))
              }
              rows={5}
              placeholder="Optional — tell us about your experience at Hotel Yuvaan."
              className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save and Continue"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingReviewWidget;
