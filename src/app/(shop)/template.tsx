"use client";

import { motion } from "framer-motion";

/** Each navigation re-mounts the template, so pages ease in instead of snapping. */
export default function ShopTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // Opacity only: a transform here would trap the pages' fixed-position sheets and bars.
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
