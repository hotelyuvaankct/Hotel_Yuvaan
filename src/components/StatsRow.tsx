import { cn } from "@/lib/utils";

export type StatItem = {
  value: string;
  label: string;
};

type StatsRowProps = {
  items: StatItem[];
  className?: string;
};

/** Static stats row (Server Component friendly). */
export default function StatsRow({ items, className }: StatsRowProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-4 min-[380px]:gap-x-6 min-[380px]:gap-y-5 sm:grid-cols-4 sm:gap-x-4",
        className
      )}
    >
      {items.map((stat) => (
        <li key={stat.label} className="min-w-0">
          <p className="font-playfair text-xl min-[380px]:text-2xl font-bold leading-none text-foreground sm:text-[1.75rem]">
            {stat.value}
          </p>
          <span
            className="mt-1.5 mb-1 min-[380px]:mt-2 min-[380px]:mb-1.5 block h-0.5 w-6 min-[380px]:w-8 rounded-full bg-primary"
            aria-hidden
          />
          <p className="text-xs min-[380px]:text-sm text-muted-foreground leading-snug">
            {stat.label}
          </p>
        </li>
      ))}
    </ul>
  );
}
