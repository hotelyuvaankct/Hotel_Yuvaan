import { useCallback, useEffect, useState } from "react";
import { useBlocker, type Location } from "react-router-dom";

const DEFAULT_MESSAGE =
  "You have an unfinished booking. Are you sure you want to leave this page?";

type LeaveGuardOptions = {
  when: boolean;
  message?: string;
  /** Return true to block this navigation. Defaults to blocking all route changes. */
  shouldBlock?: (args: {
    currentLocation: Location;
    nextLocation: Location;
  }) => boolean;
};

/**
 * Warns on browser close/refresh and blocks in-app navigations
 * while `when` is true (e.g. booking in progress).
 */
export function useLeaveGuard({
  when,
  message = DEFAULT_MESSAGE,
  shouldBlock,
}: LeaveGuardOptions) {
  const [pendingLeave, setPendingLeave] = useState(false);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (!when) return false;
    if (shouldBlock) {
      return shouldBlock({ currentLocation, nextLocation });
    }
    return (
      currentLocation.pathname !== nextLocation.pathname ||
      currentLocation.search !== nextLocation.search
    );
  });

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
    if (blocker.state !== "blocked") {
      setPendingLeave(false);
      return;
    }
    setPendingLeave(true);
  }, [blocker.state]);

  const confirmLeave = useCallback(() => {
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
    setPendingLeave(false);
  }, [blocker]);

  const cancelLeave = useCallback(() => {
    if (blocker.state === "blocked") {
      blocker.reset();
    }
    setPendingLeave(false);
  }, [blocker]);

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
