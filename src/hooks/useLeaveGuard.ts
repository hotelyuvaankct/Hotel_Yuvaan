import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
  /** Called when user confirms leave (e.g. clear booking session). */
  onConfirmLeave?: () => void;
};

/**
 * Warns on browser close/refresh and intercepts in-app <a> navigations
 * while `when` is true (e.g. booking in progress).
 *
 * Custom dialog for in-app links; native beforeunload only for tab close/refresh.
 * Confirming the custom dialog uses client navigation so the browser prompt
 * does not appear a second time.
 */
export function useLeaveGuard({
  when,
  message = DEFAULT_MESSAGE,
  shouldBlock,
  onConfirmLeave,
}: LeaveGuardOptions) {
  const [pendingLeave, setPendingLeave] = useState(false);
  const pendingHref = useRef<string | null>(null);
  const allowUnloadRef = useRef(false);
  const whenRef = useRef(when);
  const shouldBlockRef = useRef(shouldBlock);
  const router = useRouter();

  whenRef.current = when;
  shouldBlockRef.current = shouldBlock;

  useEffect(() => {
    if (!when) {
      allowUnloadRef.current = false;
    }
  }, [when]);

  // Native prompt only for tab close / refresh — not for in-app Leave anyway.
  useEffect(() => {
    if (!when) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowUnloadRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [when]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!whenRef.current) return;
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

      const currentPathname = window.location.pathname;
      const currentSearch = window.location.search;
      const nextPathname = url.pathname;
      const nextSearch = url.search;

      const block = shouldBlockRef.current
        ? shouldBlockRef.current({
            currentPathname,
            currentSearch,
            nextPathname,
            nextSearch,
          })
        : currentPathname !== nextPathname || currentSearch !== nextSearch;

      if (!block) return;

      event.preventDefault();
      event.stopPropagation();
      pendingHref.current = url.pathname + url.search + url.hash;
      setPendingLeave(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const confirmLeave = useCallback(() => {
    const href = pendingHref.current;
    pendingHref.current = null;
    setPendingLeave(false);
    onConfirmLeave?.();
    // Client navigation does not fire beforeunload — no second browser prompt.
    allowUnloadRef.current = true;
    if (href) {
      router.push(href);
    }
    // Re-arm native guard if we somehow stay on a guarded page.
    window.setTimeout(() => {
      allowUnloadRef.current = false;
    }, 0);
  }, [onConfirmLeave, router]);

  const cancelLeave = useCallback(() => {
    pendingHref.current = null;
    setPendingLeave(false);
    allowUnloadRef.current = false;
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
