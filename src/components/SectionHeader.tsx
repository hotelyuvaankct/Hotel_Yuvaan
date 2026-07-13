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
  /** Skip animate-on-scroll when parent already animates */
  animate?: boolean;
};

/**
 * Shared section header — eyebrow + Playfair title + optional gold highlight + description.
 * Use this on every marketing section for consistent typography.
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
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      ) : null}

      <Tag
        className={cn(
          "mb-6 font-playfair text-3xl font-bold md:text-4xl lg:text-5xl",
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
        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground md:text-base",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default SectionHeader;
