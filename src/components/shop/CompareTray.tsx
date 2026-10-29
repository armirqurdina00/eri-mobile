"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { finishesOf } from "@/lib/catalog";
import { useShop } from "./ShopProvider";
import Vitrine from "./Vitrine";

export default function CompareTray() {
  const t = useTranslations("Compare");
  const pathname = usePathname();
  const { compare, getProduct, toggleCompare, clearCompare } = useShop();
  const visible = compare.length > 0 && !pathname.startsWith("/compare") && !pathname.startsWith("/checkout");
  // Product pages have their own sticky buy bar on phones.
  const onProduct = pathname.startsWith("/products/");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
          className={`fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-30 justify-center px-4 lg:bottom-6 lg:flex ${onProduct ? "hidden" : "flex"}`}
        >
          <div className="glass flex items-center gap-2 rounded-full border border-edge p-2 pl-3 shadow-2xl shadow-black/60">
            <div className="flex -space-x-2">
              {compare.map((id) => {
                const p = getProduct(id);
                if (!p) return null;
                const f = finishesOf(p)[0];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleCompare(id)}
                    aria-label={`${t("remove")} ${p.name}`}
                    className="group relative rounded-full ring-2 ring-panel"
                  >
                    <Vitrine glow={f?.colorHex ?? "#ccc"} src={f?.image ?? p.image} alt="" sizes="40px" className="h-10 w-10 rounded-full" imageClassName="object-contain p-1" />
                    <span className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/60 group-hover:flex">
                      <X className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>
            <Link href="/compare" className="rounded-full bg-fg px-4 py-2.5 text-sm font-semibold text-night">
              {t("tray", { count: compare.length })}
            </Link>
            <button
              type="button"
              onClick={clearCompare}
              aria-label={t("clear")}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-panel/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
