import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type StatItem = {
  value: string;
  label: string;
};

type StatsRowProps = {
  items: StatItem[];
  className?: string;
};

function parseStatValue(raw: string): {
  target: number;
  prefix: string;
  suffix: string;
  isNumeric: boolean;
} {
  const match = raw.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { target: 0, prefix: "", suffix: raw, isNumeric: false };
  }
  return {
    target: Number(match[2]),
    prefix: match[1] ?? "",
    suffix: match[3] ?? "",
    isNumeric: true,
  };
}

function useCountUp(target: number, enabled: boolean, durationMs = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setValue(0);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, durationMs]);

  return value;
}

const StatNumber = ({
  raw,
  active,
  delayMs,
}: {
  raw: string;
  active: boolean;
  delayMs: number;
}) => {
  const parsed = parseStatValue(raw);
  const [started, setStarted] = useState(false);
  const count = useCountUp(parsed.target, started && parsed.isNumeric);

  useEffect(() => {
    if (!active) {
      setStarted(false);
      return;
    }
    const timer = window.setTimeout(() => setStarted(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [active, delayMs]);

  if (!parsed.isNumeric) {
    return <>{raw}</>;
  }

  return (
    <>
      {parsed.prefix}
      {started ? count : 0}
      {parsed.suffix}
    </>
  );
};

/**
 * Editorial stats with count-up when scrolled into view.
 */
const StatsRow = ({ items, className }: StatsRowProps) => {
  const rootRef = useRef<HTMLUListElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <ul
      ref={rootRef}
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-4",
        className
      )}
    >
      {items.map((stat, index) => (
        <li
          key={stat.label}
          className={cn(
            "min-w-0 transition-all duration-700",
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          )}
          style={{ transitionDelay: `${index * 80}ms` }}
        >
          <p className="font-playfair text-2xl font-bold leading-none text-foreground sm:text-[1.75rem]">
            <StatNumber
              raw={stat.value}
              active={inView}
              delayMs={index * 80}
            />
          </p>
          <span
            className={cn(
              "mt-2 mb-1.5 block h-0.5 w-8 rounded-full bg-primary transition-transform duration-700 origin-left",
              inView ? "scale-x-100" : "scale-x-0"
            )}
            style={{ transitionDelay: `${index * 80 + 120}ms` }}
            aria-hidden
          />
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </li>
      ))}
    </ul>
  );
};

export default StatsRow;
