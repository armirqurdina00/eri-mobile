"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Starts every new page at the very top. Next.js only scrolls the new page segment into view,
 * which leaves it below the floating header. Back/forward keeps the browser's restored position,
 * and links to an anchor (e.g. /#finder) are left to scroll to their target.
 */
export default function ScrollReset() {
  const pathname = usePathname();
  const fromHistory = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
