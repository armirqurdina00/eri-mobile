"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const START_EVENT = "eri:navigate";

/** Lets code that navigates with router.push show the progress bar too. */
export function startNavigationProgress() {
  window.dispatchEvent(new Event(START_EVENT));
}

/**
 * A brand-red bar along the top of the window: it starts the moment a shopper clicks an
 * internal link, creeps forward while the page loads, and completes when the route changes.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");

  // Finish when the URL changes.
  const route = `${pathname}?${search}`;
  const [lastRoute, setLastRoute] = useState(route);
  if (route !== lastRoute) {
    setLastRoute(route);
    if (phase === "loading") setPhase("done");
  }

  useEffect(() => {
    const start = () => setPhase("loading");
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      // Same page (or only a #hash change): nothing will load.
      if (url.pathname === location.pathname && url.search === location.search) return;
      start();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", start);
    window.addEventListener(START_EVENT, start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", start);
      window.removeEventListener(START_EVENT, start);
    };
  }, []);

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => setPhase("idle"), 450);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
        >
          <motion.div
            className="h-full origin-left bg-brand shadow-[0_0_12px_2px] shadow-brand/70"
            initial={{ scaleX: 0 }}
            animate={
              phase === "loading"
                ? { scaleX: 0.85, transition: { duration: 8, ease: [0.08, 0.7, 0.2, 1] } }
                : { scaleX: 1, transition: { duration: 0.25, ease: "easeOut" } }
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
