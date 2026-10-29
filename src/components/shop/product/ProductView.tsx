"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Check, GitCompareArrows, Heart, ShieldCheck, Star, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { useLocale } from "@/components/LocaleProvider";
import { finishesOf, findVariant, formatNumber, formatPrice, inStock, storagesOf } from "@/lib/catalog";
import { useShop } from "../ShopProvider";
import ModelCard from "../ModelCard";
import Swatches from "../Swatches";
import { flyToBag } from "../flyToBag";
import { startNavigationProgress } from "../NavigationProgress";

export default function ProductView({ product }: { product: Product }) {
  const t = useTranslations("Product");
  const card = useTranslations("Card");
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { products, addToCart, saved, toggleSaved, compare, toggleCompare, markViewed } = useShop();

  const finishes = finishesOf(product);
  const storages = storagesOf(product);
  const [color, setColor] = useState(
    finishes.some((f) => f.color === params.get("color")) ? params.get("color")! : finishes[0]?.color
  );
  const [storage, setStorage] = useState(
    storages.includes(params.get("storage") ?? "") ? params.get("storage")! : storages[0] ?? ""
  );
  const [added, setAdded] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const caseRef = useRef<HTMLDivElement>(null);
  const [buyVisible, setBuyVisible] = useState(true);

  const finish = finishes.find((f) => f.color === color) ?? finishes[0];
  const variant = findVariant(product, color, storage);
  const available = variant ? inStock(variant) : false;
  const price = variant?.price ?? 0;
  const was = variant?.originalPrice && variant.originalPrice > price ? variant.originalPrice : undefined;

  useEffect(() => markViewed(product.id), [product.id, markViewed]);

  // Keep the URL on the exact configuration, so it can be shared or reloaded.
  useEffect(() => {
    const q = new URLSearchParams();
    if (color) q.set("color", color);
    if (storage) q.set("storage", storage);
    router.replace(`${pathname}?${q}`, { scroll: false });
  }, [color, storage, pathname, router]);

  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    // Only once the button has scrolled up out of view, not while it's still below.
    const io = new IntersectionObserver(([e]) => setBuyVisible(e.isIntersecting || e.boundingClientRect.top > 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = (openBag = false) => {
    if (!variant || !available) return;
    if (!openBag) flyToBag(caseRef.current, finish?.image ?? product.image);
    addToCart({
      productId: product.id,
      name: product.name,
      color: variant.color,
      colorHex: variant.colorHex,
      storage: variant.storage,
      image: finish?.image ?? product.image,
      price: variant.price,
    }, { openBag });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const buyNow = () => {
    if (!variant || !available) return;
    addToCart(
      {
        productId: product.id,
        name: product.name,
        color: variant.color,
        colorHex: variant.colorHex,
        storage: variant.storage,
        image: finish?.image ?? product.image,
        price: variant.price,
      },
      { openBag: false }
    );
    startNavigationProgress();
    router.push("/checkout");
  };

  const similar = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const isSaved = saved.includes(product.id);
  const isComparing = compare.includes(product.id);

  return (
    <>
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 py-4 text-sm text-dim">
          <Link href="/products" className="hover:text-fg">
            {t("backToShop")}
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          {/* Stage */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div ref={caseRef} className="relative">
            <div className="case relative aspect-square overflow-hidden rounded-[32px] shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] sm:rounded-[40px]">
            {/* The finish colour as light behind the device. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[52%] h-[64%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-[70px] transition-colors duration-700"
              style={{ backgroundColor: finish?.colorHex }}
            />
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={finish?.image}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={finish?.image ?? product.image}
                    alt={`${product.name}, ${finish?.color}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-contain p-[10%]"
                  />
                </motion.div>
              </AnimatePresence>
              <p className="absolute bottom-5 left-6 rounded-full bg-night/80 px-3 py-1.5 text-sm font-semibold text-fg backdrop-blur">
                {finish?.color}
              </p>
            </div>
            </div>
          </div>

          {/* Buy box */}
          <div className="pb-10">
            <h1 className="font-semibold leading-none text-[clamp(2.75rem,6vw,5.25rem)]">{product.name}</h1>
            <p className="mt-4 text-lg text-dim">{product.subtitle}</p>
            {product.reviews > 0 && (
              <p className="mt-3 flex items-center gap-1.5 text-[15px]">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{product.rating.toFixed(1)}</span>
                <span className="text-dim">{t("reviews", { count: product.reviews, formatted: formatNumber(product.reviews, locale) })}</span>
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="relative inline-flex h-10 overflow-hidden text-3xl font-semibold tabular-nums">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={price}
                    initial={{ y: 36, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -36, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  >
                    {formatPrice(price, locale)}
                  </motion.span>
                </AnimatePresence>
              </span>
              {was && (
                <>
                  <s className="text-lg text-dim tabular-nums">{formatPrice(was, locale)}</s>
                  <span className="rounded-full bg-brand px-2.5 py-1 text-sm font-semibold text-white">
                    {t("youSave", { amount: formatPrice(was - price, locale) })}
                  </span>
                </>
              )}
            </div>

            <div className="mt-8">
              <p className="text-[15px]">
                <span className="text-dim">{t("finish")}</span> <span className="font-semibold">{finish?.color}</span>
              </p>
              <Swatches finishes={finishes} value={finish?.color} onChange={setColor} size="md" label={t("finish")} className="mt-3" />
            </div>

            {storages.length > 0 && (
              <fieldset className="mt-8">
                <legend className="text-[15px] text-dim">{t("storage")}</legend>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {storages.map((s) => {
                    const v = product.variants.find((x) => x.color === color && x.storage === s);
                    const on = s === storage;
                    const out = !v || !inStock(v);
                    return (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setStorage(s)}
                        className={`relative flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition-colors ${
                          on ? "border-transparent" : "border-edge hover:border-white/30"
                        } ${out ? "opacity-50" : ""}`}
                      >
                        {on && (
                          <motion.span
                            layoutId="storage-on"
                            className="absolute inset-0 rounded-2xl bg-white/[0.08] ring-[1.5px] ring-fg"
                            transition={{ type: "spring", stiffness: 500, damping: 38 }}
                          />
                        )}
                        <span className="relative text-lg font-semibold">{s}</span>
                        <span className="relative text-sm tabular-nums text-dim">
                          {v ? (out ? card("soldOut") : formatPrice(v.price, locale)) : "—"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <p className={`mt-6 flex items-center gap-2 text-[15px] font-medium ${available ? "text-ok" : "text-brand"}`}>
              <span className={`h-2 w-2 rounded-full ${available ? "bg-ok" : "bg-brand"}`} />
              {!available
                ? t("soldOut")
                : variant && variant.stock <= 3
                  ? t("lowStock", { count: variant.stock })
                  : t("inStock")}
            </p>

            <div ref={buyRef} className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                onClick={() => add()}
                disabled={!available}
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-brand text-base font-semibold text-white shadow-[0_10px_40px_-12px] shadow-brand/70 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-raise disabled:text-dim"
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" /> {t("added")}
                  </>
                ) : (
                  t("addToBag")
                )}
              </button>
              <button
                type="button"
                onClick={buyNow}
                disabled={!available}
                className="h-14 rounded-full border border-edge bg-white/[0.05] px-7 text-base font-semibold transition-colors hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:text-dim"
              >
                {t("buyNow")}
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                aria-pressed={isSaved}
                onClick={() => toggleSaved(product.id)}
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[15px] font-medium hover:bg-panel/[0.06]"
              >
                <Heart className={`h-[18px] w-[18px] ${isSaved ? "fill-brand text-brand" : ""}`} />
                {isSaved ? card("saved") : card("save")}
              </button>
              <button
                type="button"
                aria-pressed={isComparing}
                onClick={() => toggleCompare(product.id)}
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[15px] font-medium hover:bg-panel/[0.06]"
              >
                <GitCompareArrows className="h-[18px] w-[18px]" />
                {isComparing ? card("comparing") : card("compare")}
              </button>
            </div>

            <ul className="mt-8 space-y-3 border-t border-edge pt-6 text-[15px]">
              <li className="flex gap-3">
                <Truck className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                {t("delivery")}
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                {t("warranty")}
              </li>
            </ul>

            {product.description && (
              <section className="mt-10">
                <h2 className="text-lg font-semibold">{t("about")}</h2>
                <p className="mt-2 max-w-prose leading-relaxed text-dim">{product.description}</p>
              </section>
            )}

            {product.specs.length > 0 && (
              <section className="mt-10">
                <h2 className="text-lg font-semibold">{t("specs")}</h2>
                <dl className="mt-3 divide-y divide-edge border-y border-edge">
                  {product.specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 text-[15px]">
                      <dt className="text-dim">{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="font-semibold text-3xl sm:text-4xl">{t("similar")}</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 xl:gap-x-6">
              {similar.map((p) => (
                <ModelCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile buy bar, shown once the main button scrolls away. */}
      <AnimatePresence>
        {!buyVisible && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            className="glass fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-30 rounded-[22px] border border-edge p-2.5 pl-3 shadow-2xl shadow-black/60 lg:hidden"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-8 w-8 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
                style={{ background: finish?.colorHex }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-dim">{[color, storage].filter(Boolean).join(", ")}</p>
                <p className="font-semibold tabular-nums">{formatPrice(price, locale)}</p>
              </div>
              <button
                type="button"
                onClick={() => add()}
                disabled={!available}
                className="h-12 rounded-full bg-brand px-6 text-[15px] font-semibold text-white disabled:bg-raise disabled:text-dim"
              >
                {added ? t("added") : t("addToBag")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
