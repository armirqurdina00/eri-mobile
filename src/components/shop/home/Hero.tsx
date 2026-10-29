"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { useLocale } from "@/components/LocaleProvider";
import { finishesOf, formatPrice, productHref } from "@/lib/catalog";
import { useSpotlight } from "../useSpotlight";
import Swatches from "../Swatches";

const SLIDE_MS = 7000;

/** The newest models, one at a time, each standing in a lit case. */
export default function Hero({ products }: { products: Product[] }) {
  const t = useTranslations("Hero");
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const spotlight = useSpotlight();
  const section = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [colors, setColors] = useState<Record<string, string>>({});

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const caseY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const caseScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const product = products[index];
  const finishes = finishesOf(product);
  const color = colors[product.id] ?? finishes[0]?.color;
  const finish = finishes.find((f) => f.color === color) ?? finishes[0];
  const forColor = product.variants.filter((v) => v.color === finish?.color);
  const from = Math.min(...forColor.map((v) => v.price));
  const autoplay = !reduce && !paused && products.length > 1;

  return (
    <section
      ref={section}
      onPointerMove={spotlight}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="spotlight relative isolate -mt-[76px] overflow-hidden pt-[76px]"
      aria-roledescription="carousel"
      aria-label={t("newIn")}
    >
      {/* Coloured light from the current finish, washing the room behind the case. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-[5%] -z-10 h-[70vh] w-[70vh] rounded-full opacity-35 blur-[120px]"
        animate={{ backgroundColor: finish?.colorHex }}
        transition={{ duration: 1 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />

      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 pb-8 pt-8 sm:px-6 lg:min-h-[calc(100dvh-76px-120px)] lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12 lg:pb-12">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="order-2 lg:order-1">
          <p className="inline-flex items-center gap-2 rounded-full border border-edge bg-white/[0.04] px-3 py-1.5 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-70 motion-reduce:hidden" />
              <span className="relative h-2 w-2 rounded-full bg-brand" />
            </span>
            {t("newIn")}
          </p>

          <h1 key={product.id} className="mt-6 text-[clamp(2.6rem,6.2vw,5.5rem)] font-semibold leading-[0.98]">
            {splitName(product.name).map((line, li) => (
              <span key={li} className="block whitespace-nowrap">
                {line.split(" ").map((word, wi) => (
                  <span
                    key={wi}
                    className="inline-block pr-[0.22em] motion-safe:[animation:rise_0.7s_cubic-bezier(0.22,1,0.36,1)_both]"
                    style={{ animationDelay: `${(li * 2 + wi) * 70}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-md text-lg text-dim">{product.subtitle}</p>

          <div className="mt-8">
            <p className="text-[15px]">
              <span className="text-dim">{t("finish")}</span> <span className="font-semibold">{finish?.color}</span>
            </p>
            <Swatches
              finishes={finishes}
              value={finish?.color}
              onChange={(c) => setColors((prev) => ({ ...prev, [product.id]: c }))}
              size="lg"
              label={t("finish")}
              className="mt-3"
            />
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={productHref(product, forColor[0])}
              className="group relative inline-flex h-14 items-center overflow-hidden rounded-full bg-brand px-7 text-base font-semibold text-white shadow-[0_10px_40px_-10px] shadow-brand/70 transition-transform active:scale-[0.97]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">{t("shopThis")}</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex h-14 items-center rounded-full border border-edge bg-white/[0.04] px-6 text-base font-medium transition-colors hover:bg-white/[0.08]"
            >
              {t("seeAll")}
            </Link>
          </div>
          <div className="mt-6 h-8 overflow-hidden text-xl font-semibold tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={`${product.id}-${from}`}
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -28, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              >
                {t("from", { price: formatPrice(from, locale) })}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div style={{ y: caseY, scale: caseScale }} className="relative order-1 mx-auto w-[86%] max-w-[440px] lg:order-2 lg:w-full lg:max-w-[480px]">
          <div className="case relative aspect-[4/5] overflow-hidden rounded-[36px] shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] sm:rounded-[44px]">
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
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 1.04 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={finish?.image ?? product.image}
                  alt={`${product.name}, ${finish?.color}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-contain p-[11%]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {products.length > 1 && (
        <div className="mx-auto max-w-[1240px] px-4 pb-6 sm:px-6">
          <div role="tablist" className="grid grid-cols-3 gap-2 sm:gap-4">
            {products.map((p, i) => {
              const on = i === index;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setIndex(i)}
                  className={`group text-left transition-opacity ${on ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
                >
                  <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/10">
                    {on && (
                      <motion.span
                        key={`${p.id}-${autoplay}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-fg"
                        initial={{ width: autoplay ? "0%" : "100%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: autoplay ? SLIDE_MS / 1000 : 0, ease: "linear" }}
                        onAnimationComplete={() => autoplay && setIndex((i + 1) % products.length)}
                      />
                    )}
                  </span>
                  <span className="mt-3 block truncate text-sm font-semibold sm:text-[15px]">{p.name}</span>
                  <span className="hidden truncate text-sm text-dim sm:block">{p.subtitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

/** "iPhone 17 Pro Max" → ["iPhone 17", "Pro Max"], so the line breaks at the model number. */
function splitName(name: string): string[] {
  const m = name.match(/^(\S+\s+\d+\w*)\s+(.+)$/);
  return m ? [m[1], m[2]] : [name];
}
