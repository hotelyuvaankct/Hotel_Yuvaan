import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  /** Main title text (before the gold highlight) */
  title: ReactNode;
  /** Optional gold-gradient word(s), e.g. "Us" in "Contact Us" */
  highlight?: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Extra wrapper scroll class when parent does not already animate */
  animate?: boolean;
};

/**
 * Shared section header — scroll motion via CSS classes (server-safe markup).
 */
const SectionHeader = ({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  as: Heading = "h2",
  className,
  animate = true,
}: SectionHeaderProps) => {
  const Tag = Heading as ElementType;

  return (
    <div
      className={cn(
        align === "center" ? "text-center" : "text-left",
        "mb-12 md:mb-16",
        animate && "animate-on-scroll",
        className
      )}
    >
      {eyebrow ? (
        <div
          className={cn(
            "mb-4 flex flex-col gap-3 animate-on-scroll-eyebrow",
            align === "center" ? "items-center" : "items-start"
          )}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
          <span
            className="block h-0.5 w-12 rounded-full bg-primary animate-on-scroll-rule"
            aria-hidden
          />
        </div>
      ) : null}

      <Tag
        className={cn(
          "mb-6 font-playfair text-3xl font-bold md:text-4xl lg:text-5xl animate-on-scroll-left scroll-delay-1",
          align === "center" ? "" : "text-foreground"
        )}
      >
        {title}
        {highlight != null && highlight !== "" ? (
          <>
            {" "}
            <span className="text-gradient">{highlight}</span>
          </>
        ) : null}
      </Tag>

      {description ? (
        <div
          className={cn(
            "animate-on-scroll scroll-delay-2",
            align === "left" && "border-l-2 border-primary pl-4 md:pl-5",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          <p
            className={cn(
              "text-sm leading-relaxed text-muted-foreground md:text-base",
              align === "center" && "text-center"
            )}
          >
            {description}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SectionHeader;
