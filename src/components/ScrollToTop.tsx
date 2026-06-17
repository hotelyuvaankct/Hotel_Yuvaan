import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      if (scrollToHash(hash)) return;

      const timeout = window.setTimeout(() => scrollToHash(hash), 100);
      return () => window.clearTimeout(timeout);
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
