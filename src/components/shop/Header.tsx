"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, GitCompareArrows, Heart, Search, ShoppingBag, Sparkles, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { useLocale } from "@/components/LocaleProvider";
import { finishesOf, formatPrice, minPrice, productHref } from "@/lib/catalog";
import { useShop } from "./ShopProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import Vitrine from "./Vitrine";

export default function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { cartCount, saved, setCartOpen, setSearchOpen } = useShop();
  const [hovered, setHovered] = useState<string | null>(null);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Close the menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMegaOpen(false);
  }

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMegaSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };

  const links = [
    { href: "/products?category=Accessories", label: t("accessories") },
    { href: "/products?sale=1", label: t("deals") },
    { href: "/compare", label: t("compare") },
    { href: "/about", label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div
        className="glass relative mx-auto flex h-14 max-w-[1240px] items-center gap-2 rounded-full border border-edge pl-4 pr-2 shadow-xl shadow-black/30 lg:h-16 lg:pl-5"
        onMouseLeave={closeMegaSoon}
      >
        <Link href="/" className="flex shrink-0 items-center" aria-label="Eri Mobile">
          <Image src="/logo_white.png" alt="" width={40} height={40} priority className="h-9 w-9 lg:h-10 lg:w-10" />
        </Link>

        <nav className="ml-4 hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
          <button
            type="button"
            aria-expanded={megaOpen}
            aria-label={t("openMenu")}
            // Hover already opened it for mouse users, so a click shouldn't close it again;
            // keyboard activation (detail 0) toggles.
            onClick={(e) => (e.detail === 0 && megaOpen ? setMegaOpen(false) : openMega())}
            onMouseEnter={() => {
              setHovered("iphone");
              openMega();
            }}
            className="relative flex h-10 items-center gap-1 rounded-full px-4 text-[15px] font-medium"
          >
            {hovered === "iphone" && <HoverPill />}
            <span className="relative">{t("iphone")}</span>
            <ChevronDown className={`relative h-4 w-4 text-dim transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
          </button>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onMouseEnter={() => {
                setHovered(l.href);
                closeMegaSoon();
              }}
              className="relative flex h-10 items-center rounded-full px-4 text-[15px] font-medium text-fg/85 hover:text-fg"
            >
              {hovered === l.href && <HoverPill />}
              <span className="relative">{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 items-center gap-2 rounded-full px-3 text-dim transition-colors hover:bg-white/[0.06] hover:text-fg"
            aria-label={t("search")}
          >
            <Search className="h-[18px] w-[18px]" />
            <kbd className="hidden rounded-md border border-edge px-1.5 py-0.5 font-sans text-xs xl:inline">⌘K</kbd>
          </button>
          <LanguageSwitcher />
          <Link
            href="/saved"
            aria-label={`${t("saved")} (${saved.length})`}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full hover:bg-white/[0.06] lg:flex"
          >
            <Heart className="h-[18px] w-[18px]" />
            {saved.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand" aria-hidden />
            )}
          </Link>
          <button
            type="button"
            data-bag-target
            onClick={() => setCartOpen(true)}
            aria-label={`${t("bag")} (${cartCount})`}
            className="relative ml-1 hidden h-11 items-center gap-2 rounded-full bg-fg pl-4 pr-3 text-[15px] font-semibold text-night transition-transform active:scale-95 lg:flex"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {t("bag")}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={cartCount}
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs tabular-nums ${
                  cartCount ? "bg-brand text-white" : "bg-night/10"
                }`}
              >
                {cartCount}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence>
          {megaOpen && <MegaMenu onEnter={openMega} onClose={() => setMegaOpen(false)} />}
        </AnimatePresence>
      </div>
    </header>
  );
}

function HoverPill() {
  return (
    <motion.span
      layoutId="nav-hover"
      className="absolute inset-0 rounded-full bg-white/[0.08]"
      transition={{ type: "spring", stiffness: 500, damping: 38 }}
    />
  );
}

function MegaMenu({ onEnter, onClose }: { onEnter: () => void; onClose: () => void }) {
  const t = useTranslations("Nav");
  const s = useTranslations("Shop");
  const h = useTranslations("Hero");
  const { locale } = useLocale();
  const { products } = useShop();
  const phones = products.filter((p) => p.category !== "Accessories");
  const [featured, setFeatured] = useState<Product | undefined>(phones[0]);
  const series = [...new Set(phones.map((p) => p.category))];
  const f = featured ? finishesOf(featured)[0] : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const quick = [
    { href: "/#finder", icon: Sparkles, title: t("helpChoose"), desc: t("helpChooseDesc") },
    { href: "/compare", icon: GitCompareArrows, title: t("compare"), desc: t("compareDesc") },
    { href: "/products?sale=1", icon: Tag, title: t("deals"), desc: t("dealsDesc") },
  ];

  // Opaque: a backdrop blur nested inside the header's own blur can't reach the page behind it.
  return (
    <motion.div
      onMouseEnter={onEnter}
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "top center" }}
      className="absolute inset-x-0 top-full mt-3 hidden overflow-hidden rounded-[28px] border border-edge bg-panel shadow-2xl shadow-black/70 lg:block"
    >
      <div className="grid grid-cols-[1fr_1fr_340px] gap-2 p-3">
        {series.map((cat, ci) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + ci * 0.05 }}
            className="p-3"
          >
            <p className="px-2 text-sm font-medium text-dim">{s.has(cat) ? s(cat) : cat}</p>
            <ul className="mt-2 space-y-0.5">
              {phones
                .filter((p) => p.category === cat)
                .map((p) => {
                  const pf = finishesOf(p)[0];
                  return (
                    <li key={p.id}>
                      <Link
                        href={productHref(p)}
                        onMouseEnter={() => setFeatured(p)}
                        onFocus={() => setFeatured(p)}
                        className={`flex items-center gap-3 rounded-2xl p-2 transition-colors ${
                          featured?.id === p.id ? "bg-white/[0.07]" : "hover:bg-white/[0.05]"
                        }`}
                      >
                        <Vitrine
                          src={pf?.image ?? p.image}
                          alt=""
                          sizes="44px"
                          className="h-11 w-11 shrink-0 rounded-xl"
                          imageClassName="object-contain p-1"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-medium">{p.name}</span>
                          <span className="block text-sm tabular-nums text-dim">
                            {h("from", { price: formatPrice(minPrice(p), locale) })}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </motion.div>
        ))}

        {featured && (
          <div className="rounded-[22px] bg-white/[0.04] p-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={featured.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
              >
                <Link href={productHref(featured)} className="block">
                  <Vitrine
                    src={f?.image ?? featured.image}
                    alt={featured.name}
                    sizes="320px"
                    glow={f?.colorHex}
                    className="aspect-[4/3] rounded-[18px]"
                    imageClassName="object-contain p-[10%]"
                  />
                  <p className="font-display mt-4 text-xl font-semibold">{featured.name}</p>
                  <p className="mt-0.5 text-sm text-dim">{featured.subtitle}</p>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-edge bg-black/20 p-3">
        {quick.map(({ href, icon: Icon, title, desc }) => (
          <Link key={href} href={href} className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-white/[0.05]">
            <Icon className="mt-0.5 h-5 w-5 text-brand" strokeWidth={1.75} />
            <span>
              <span className="block text-[15px] font-medium">{title}</span>
              <span className="block text-sm text-dim">{desc}</span>
            </span>
          </Link>
        ))}
        <Link
          href="/products"
          className="flex items-center justify-center rounded-2xl bg-fg p-3 text-[15px] font-semibold text-night transition-transform active:scale-[0.98]"
        >
          {t("allIphones")}
        </Link>
      </div>
    </motion.div>
  );
}
