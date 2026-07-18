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
    let ticking = false;

    const applyHash = (id: string) => {
      if (id === currentId) return;
      currentId = id;

      const nextUrl = id === "home" ? "/" : `/#${id}`;
      const current =
        window.location.pathname + window.location.hash;
      if (current === nextUrl || (id === "home" && current === "/")) {
        window.dispatchEvent(
          new CustomEvent("section-hash", { detail: id })
        );
        return;
      }

      window.history.replaceState(null, "", nextUrl);
      window.dispatchEvent(new CustomEvent("section-hash", { detail: id }));
    };

    const pickActiveSection = () => {
      const marker = window.innerHeight * 0.28;
      let active: HTMLElement | null = null;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom > marker) {
          active = el;
          break;
        }
      }

      if (!active) {
        // Fallback: last section whose top is above the marker
        for (let i = elements.length - 1; i >= 0; i--) {
          if (elements[i].getBoundingClientRect().top <= marker) {
            active = elements[i];
            break;
          }
        }
      }

      if (active?.id) applyHash(active.id);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        pickActiveSection();
        ticking = false;
      });
    };

    pickActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
