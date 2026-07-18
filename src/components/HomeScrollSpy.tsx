"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Home page section ids, top → bottom */
export const HOME_SECTION_IDS = [
  "home",
  "about",
  "rooms",
  "restaurant",
  "facilities",
  "gallery",
  "offers",
  "contact",
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

/**
 * Updates the URL hash as the user scrolls the homepage
 * (e.g. `/#facilities`) without adding history entries.
 * Uses IntersectionObserver to avoid forced layout thrashing.
 */
export default function HomeScrollSpy() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const elements = HOME_SECTION_IDS.map((id) =>
      document.getElementById(id)
    ).filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    let currentId: string | null = null;
    const ratios = new Map<string, number>();

    const applyHash = (id: string) => {
      if (id === currentId) return;
      currentId = id;

      const nextUrl = id === "home" ? "/" : `/#${id}`;
      const current = window.location.pathname + window.location.hash;
      if (current === nextUrl || (id === "home" && current === "/")) {
        window.dispatchEvent(
          new CustomEvent("section-hash", { detail: id })
        );
        return;
      }

      window.history.replaceState(null, "", nextUrl);
      window.dispatchEvent(new CustomEvent("section-hash", { detail: id }));
    };

    const pickFromRatios = () => {
      let bestId = "home";
      let bestRatio = -1;
      for (const id of HOME_SECTION_IDS) {
        const ratio = ratios.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }
      if (bestRatio > 0 || bestId === "home") applyHash(bestId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        }
        pickFromRatios();
      },
      {
        // Active band near upper third of the viewport
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
