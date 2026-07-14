"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_MESSAGE =
  "You have an unfinished booking. Are you sure you want to leave this page?";

type LeaveGuardOptions = {
  when: boolean;
  message?: string;
  /** Return true to block this navigation. Defaults to blocking all route changes. */
  shouldBlock?: (args: {
    currentPathname: string;
    currentSearch: string;
    nextPathname: string;
    nextSearch: string;
  }) => boolean;
};

/**
 * Warns on browser close/refresh and intercepts in-app <a> navigations
 * while `when` is true (e.g. booking in progress).
 */
export function useLeaveGuard({
  when,
  message = DEFAULT_MESSAGE,
  shouldBlock,
}: LeaveGuardOptions) {
  const [pendingLeave, setPendingLeave] = useState(false);
  const pendingHref = useRef<string | null>(null);
  const pathname = usePathname();
  const search =
    typeof window !== "undefined" ? window.location.search : "";

  useEffect(() => {
    if (!when) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [when, message]);

  useEffect(() => {
    if (!when) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const nextPathname = url.pathname;
      const nextSearch = url.search;
      const block = shouldBlock
        ? shouldBlock({
            currentPathname: pathname,
            currentSearch: search,
            nextPathname,
            nextSearch,
          })
        : pathname !== nextPathname || search !== nextSearch;

      if (!block) return;

      event.preventDefault();
      event.stopPropagation();
      pendingHref.current = url.pathname + url.search + url.hash;
      setPendingLeave(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [when, pathname, search, shouldBlock]);

  const confirmLeave = useCallback(() => {
    const href = pendingHref.current;
    pendingHref.current = null;
    setPendingLeave(false);
    if (href) {
      window.location.href = href;
    }
  }, []);

  const cancelLeave = useCallback(() => {
    pendingHref.current = null;
    setPendingLeave(false);
  }, []);

  return {
    pendingLeave,
    confirmLeave,
    cancelLeave,
    message,
  };
}

/** Paths that count as continuing the booking flow (no leave dialog). */
export function isBookingFlowPath(pathname: string): boolean {
  return (
    pathname === "/book" ||
    pathname.startsWith("/book/") ||
    pathname.startsWith("/booking/")
  );
}
