"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const REVEAL_SELECTOR = [
  "#main-content section",
  "#main-content article",
  "#main-content form",
  "#main-content aside",
  "#main-content [role='tablist']",
  "#main-content .contact-links > a",
].join(",");

/** Adds progressive, one-time reveals without turning page content into Client Components. */
export function MotionOrchestrator() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("#main-content");
    if (!main) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    main.classList.remove("route-enter");
    if (!reduceMotion) {
      // Restart the lightweight page transition after Next.js swaps route content.
      void main.offsetWidth;
      main.classList.add("route-enter");
    }

    const reveal = (element: Element, index: number) => {
      if (!(element instanceof HTMLElement) || element.dataset.motionBound) return;
      element.dataset.motionBound = "true";
      element.style.setProperty("--reveal-order", String(index % 6));

      if (reduceMotion) {
        element.classList.add("is-revealed");
        return;
      }

      element.classList.add("motion-reveal");
      observer.observe(element);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );

    const bindContent = (root: ParentNode = main) => {
      root.querySelectorAll(REVEAL_SELECTOR).forEach(reveal);
    };

    bindContent();
    const mutations = new MutationObserver((records) => {
      records.forEach((record) =>
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches(REVEAL_SELECTOR)) reveal(node, 0);
            bindContent(node);
          }
        }),
      );
    });
    mutations.observe(main, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      main.classList.remove("route-enter");
    };
  }, [pathname]);

  return null;
}
