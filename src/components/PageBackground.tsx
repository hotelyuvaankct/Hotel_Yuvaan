import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageBackgroundProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Single place that defines the site page canvas color.
 * Change `--page-bg` in `src/index.css` (or styles below) — do not set
 * background colors on individual sections.
 */
const PageBackground = ({ children, className }: PageBackgroundProps) => {
  return (
    <div className={cn("page-background min-h-screen", className)}>
      {children}
    </div>
  );
};

export default PageBackground;
