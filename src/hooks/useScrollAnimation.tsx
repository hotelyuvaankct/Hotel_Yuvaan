import { useEffect } from "react";

const SELECTOR =
  ".animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right, .animate-on-scroll-eyebrow, .animate-on-scroll-rule";

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
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      }
    );

    const attach = () => {
      document.querySelectorAll(SELECTOR).forEach((element) => {
        if (element.classList.contains("animate")) return;
        observer.observe(element);
      });
    };

    attach();
    const timer = window.setTimeout(attach, 100);
    const raf = window.requestAnimationFrame(attach);

    const mutation = new MutationObserver(() => attach());
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(raf);
      mutation.disconnect();
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
