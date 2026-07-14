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
        "grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-4",
        className
      )}
    >
      {items.map((stat) => (
        <li key={stat.label} className="min-w-0">
          <p className="font-playfair text-2xl font-bold leading-none text-foreground sm:text-[1.75rem]">
            {stat.value}
          </p>
          <span
            className="mt-2 mb-1.5 block h-0.5 w-8 rounded-full bg-primary"
            aria-hidden
          />
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </li>
      ))}
    </ul>
  );
}
