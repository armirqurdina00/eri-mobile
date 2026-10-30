"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Home, LayoutGrid, Search, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useShop } from "./ShopProvider";

/** Thumb-reach navigation on phones; hidden on desktop where the header carries these. */
export default function BottomNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { cartCount, saved, setCartOpen, setSearchOpen } = useShop();

  if (pathname.startsWith("/checkout")) return null;

  const active = pathname === "/" ? "home" : pathname.startsWith("/products") ? "shop" : pathname === "/saved" ? "saved" : "";
  const item = "relative flex flex-1 flex-col items-center justify-center gap-1 rounded-full text-[11px] font-medium";
  const indicator = (key: string) =>
    active === key && (
      <motion.span
        layoutId="tab-active"
        className="absolute inset-1 rounded-full bg-white/[0.09]"
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
      />
    );

  return (
    <nav className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden">
      <div className="glass flex h-16 rounded-full border border-edge p-1 shadow-2xl shadow-black/60">
        <Link href="/" className={`${item} ${active === "home" ? "text-fg" : "text-dim"}`}>
          {indicator("home")}
          <Home className="relative h-5 w-5" />
          <span className="relative">{t("home")}</span>
        </Link>
        <Link href="/products" className={`${item} ${active === "shop" ? "text-fg" : "text-dim"}`}>
          {indicator("shop")}
          <LayoutGrid className="relative h-5 w-5" />
          <span className="relative">{t("shop")}</span>
        </Link>
        <button type="button" onClick={() => setSearchOpen(true)} className={`${item} text-dim`}>
          <Search className="h-5 w-5" />
          {t("search")}
        </button>
        <Link href="/saved" className={`${item} ${active === "saved" ? "text-fg" : "text-dim"}`}>
          {indicator("saved")}
          <Heart className="relative h-5 w-5" />
          <span className="relative">{t("saved")}</span>
          {saved.length > 0 && <Dot n={saved.length} />}
        </Link>
        <button type="button" data-bag-target onClick={() => setCartOpen(true)} className={`${item} text-fg`}>
          <ShoppingBag className="h-5 w-5" />
          {t("bag")}
          {cartCount > 0 && <Dot n={cartCount} />}
        </button>
      </div>
    </nav>
  );
}

function Dot({ n }: { n: number }) {
  return (
    <motion.span
      key={n}
      initial={{ scale: 0.4 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 600, damping: 15 }}
      className="absolute left-1/2 top-1.5 ml-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold tabular-nums text-white"
    >
      {n}
    </motion.span>
  );
}
