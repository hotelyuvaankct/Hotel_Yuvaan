
import { useEffect } from 'react';

export const useScrollAnimation = (dependencies: any[] = []) => {
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    let animatedElements: NodeListOf<Element>;

    // Delay to ensure React has fully committed and painted the DOM elements
    const timer = setTimeout(() => {
      animatedElements = document.querySelectorAll(
        '.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right'
      );

      animatedElements.forEach((element) => {
        observer.observe(element);
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      if (animatedElements) {
        animatedElements.forEach((element) => {
          observer.unobserve(element);
        });
      }
      observer.disconnect();
    };
  }, dependencies);
};
