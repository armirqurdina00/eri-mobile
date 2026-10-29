"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Banknote, Clock, ShieldCheck, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useShop } from "../ShopProvider";
import ModelCard from "../ModelCard";
import Hero from "./Hero";
import Finder from "./Finder";

const RANGES = ["all", "Pro", "Standard", "Accessories"] as const;

export default function HomeView() {
  const t = useTranslations("Home");
  const s = useTranslations("Shop");
  const { products, recent, getProduct } = useShop();
  const [range, setRange] = useState<(typeof RANGES)[number]>("all");

  const phones = products.filter((p) => p.category !== "Accessories");
  const ranges = RANGES.filter((r) => r === "all" || products.some((p) => p.category === r));
  const lineup = products.filter((p) => range === "all" || p.category === range).slice(0, 8);
  const recentProducts = recent.flatMap((id) => getProduct(id) ?? []).slice(0, 4);

  const promises = [
    { icon: Truck, title: t("promiseDelivery"), desc: t("promiseDeliveryDesc") },
    { icon: Banknote, title: t("promiseCash"), desc: t("promiseCashDesc") },
    { icon: Clock, title: t("promiseDispatch"), desc: t("promiseDispatchDesc") },
    { icon: ShieldCheck, title: t("promiseWarranty"), desc: t("promiseWarrantyDesc") },
  ];

  return (
    <>
      {phones.length > 0 && <Hero products={phones.slice(0, 3)} />}

      {/* Store promises, as a slow ticker. Duplicated once so the loop is seamless. */}
      <div className="relative overflow-hidden border-y border-edge bg-panel/60 py-5 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <ul className="marquee flex w-max gap-14 hover:[animation-play-state:paused]">
          {[...promises, ...promises].map(({ icon: Icon, title, desc }, i) => (
            <li key={i} aria-hidden={i >= promises.length} className="flex shrink-0 items-center gap-3">
              <Icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
              <span className="font-semibold">{title}</span>
              <span className="text-dim">{desc}</span>
            </li>
          ))}
        </ul>
      </div>

      {recentProducts.length > 0 && (
        <section className="mx-auto mt-20 max-w-[1240px] px-4 sm:px-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">{t("recentTitle")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
            {recentProducts.map((p) => (
              <ModelCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-24 max-w-[1240px] px-4 sm:px-6" aria-labelledby="lineup-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="lineup-title" className="text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-none">
              {t("lineupTitle")}
            </h2>
            <p className="mt-3 text-lg text-dim">{t("lineupSub")}</p>
          </div>
          <div className="no-scrollbar -mx-4 flex max-w-[100vw] gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="flex rounded-full border border-edge bg-panel p-1">
              {ranges.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={range === r}
                  onClick={() => setRange(r)}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                    range === r ? "text-night" : "text-dim hover:text-fg"
                  }`}
                >
                  {range === r && (
                    <motion.span
                      layoutId="range-pill"
                      className="absolute inset-0 rounded-full bg-fg"
                      transition={{ type: "spring", stiffness: 450, damping: 36 }}
                    />
                  )}
                  <span className="relative">{s(r)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div layout className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {lineup.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                className="h-full"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
              >
                <ModelCard product={p} priority={i < 2} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="inline-flex h-12 items-center rounded-full border border-edge bg-white/[0.04] px-6 text-[15px] font-medium transition-colors hover:bg-white/[0.08]"
          >
            {t("lineupLink")}
          </Link>
        </div>
      </section>

      <Finder products={products} />
    </>
  );
}
