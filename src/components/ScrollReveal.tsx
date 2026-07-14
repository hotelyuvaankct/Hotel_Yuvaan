"use client";

import { usePathname } from "next/navigation";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/** Observes `.animate-on-scroll*` and reveals them as they enter the viewport. */
export default function ScrollReveal() {
  const pathname = usePathname();
  useScrollAnimation([pathname]);
  return null;
}
