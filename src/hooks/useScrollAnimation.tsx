"use client";

import { useEffect } from "react";

const SELECTOR =
  ".animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right";

export const useScrollAnimation = (dependencies: unknown[] = []) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "80px 0px",
        threshold: 0.05,
      }
    );

    let animatedElements: NodeListOf<Element> | null = null;

    const attach = () => {
      animatedElements = document.querySelectorAll(SELECTOR);
      animatedElements.forEach((element) => {
        observer.observe(element);
      });
    };

    // Wait for RSC/HTML paint, then observe (and catch late mounts)
    const timer = window.setTimeout(attach, 80);
    const raf = window.requestAnimationFrame(attach);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(raf);
      animatedElements?.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
