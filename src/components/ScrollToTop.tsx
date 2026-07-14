"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToHash(hash: string): boolean {
  const id = hash.replace("#", "");
  if (!id) return false;

  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    return true;
  }
  return false;
}

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash) {
      if (scrollToHash(hash)) return;

      const timeout = window.setTimeout(() => scrollToHash(hash), 100);
      return () => window.clearTimeout(timeout);
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
