"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { useLocale } from "@/components/LocaleProvider";
import { finishesOf, formatPrice, inStock, minPrice, productHref, screenSize, specValue } from "@/lib/catalog";
import Vitrine from "../Vitrine";

type Budget = "low" | "mid" | "high";
type Size = "compact" | "standard" | "large";
type Priority = "camera" | "battery" | "value";
type Answers = { budget?: Budget; size?: Size; priority?: Priority };

function score(p: Product, a: Answers): number {
  const price = minPrice(p);
  const inches = screenSize(p) ?? 6.1;
  const isPro = p.category === "Pro";
  const isBig = /max|plus/i.test(p.name) || inches >= 6.6;
  let s = 0;

  if (a.budget === "low") s += price <= 800 ? 4 : -(price - 800) / 60;
  if (a.budget === "mid") s += price > 800 && price <= 1100 ? 4 : price <= 800 ? 1.5 : -(price - 1100) / 60;
  if (a.budget === "high") s += price / 400;

  if (a.size === "compact") s += inches <= 6.2 ? 3 : inches <= 6.3 ? 1.5 : -2;
  if (a.size === "standard") s += inches >= 6.1 && inches <= 6.5 ? 2.5 : 0;
  if (a.size === "large") s += isBig ? 3 : -1;

  if (a.priority === "camera") s += (isPro ? 3 : 0) + (/tele|5x|zoom/i.test(specValue(p, "Camera") ?? "") ? 1 : 0);
  if (a.priority === "battery") {
    const hours = parseFloat(specValue(p, "Battery")?.match(/(\d+)\s*h/i)?.[1] ?? "") || 0;
    s += (isBig ? 2.5 : 0) + hours / 15;
  }
  if (a.priority === "value") s += (1500 - price) / 250;

  // Newer releases break ties.
  return s + new Date(p.createdAt ?? 0).getTime() / 1e14;
}

export default function Finder({ products }: { products: Product[] }) {
  const t = useTranslations("Finder");
  const { locale } = useLocale();
  const [answers, setAnswers] = useState<Answers>({});
  const complete = !!(answers.budget && answers.size && answers.priority);

  const ranked = useMemo(() => {
    if (!complete) return [];
    return products
      .filter((p) => p.category !== "Accessories" && p.variants.some(inStock))
      .map((p) => ({ p, s: score(p, answers) }))
      .sort((a, b) => b.s - a.s)
      .map((x) => x.p);
  }, [products, answers, complete]);

  const questions: { key: keyof Answers; title: string; options: { value: string; label: string }[] }[] = [
    {
      key: "budget",
      title: t("budget"),
      options: [
        { value: "low", label: t("budgetLow") },
        { value: "mid", label: t("budgetMid") },
        { value: "high", label: t("budgetHigh") },
      ],
    },
    {
      key: "size",
      title: t("size"),
      options: [
        { value: "compact", label: t("sizeCompact") },
        { value: "standard", label: t("sizeStandard") },
        { value: "large", label: t("sizeLarge") },
      ],
    },
    {
      key: "priority",
      title: t("priority"),
      options: [
        { value: "camera", label: t("priorityCamera") },
        { value: "battery", label: t("priorityBattery") },
        { value: "value", label: t("priorityValue") },
      ],
    },
  ];

  const [best, ...others] = ranked;
  const bestFinish = best ? finishesOf(best)[0] : undefined;

  return (
    <section id="finder" className="mx-auto mt-28 max-w-[1240px] scroll-mt-28 px-4 sm:px-6" aria-labelledby="finder-title">
      <div className="relative grid gap-10 overflow-hidden rounded-[32px] border border-edge bg-panel p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:p-14">
        <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-[100px]" />
        <div>
          <h2 id="finder-title" className="relative text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-none">
            {t("title")}
          </h2>
          <p className="relative mt-4 text-lg text-dim">{t("subtitle")}</p>

          <ol className="relative mt-10 space-y-8">
            {questions.map((q, qi) => (
              <li key={q.key}>
                <fieldset>
                  <legend className="flex items-baseline gap-3 text-lg font-semibold">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm tabular-nums ${
                        answers[q.key] ? "bg-brand text-white" : "border border-edge text-dim"
                      }`}
                    >
                      {qi + 1}
                    </span>
                    {q.title}
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2 pl-10">
                    {q.options.map((o) => {
                      const on = answers[q.key] === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setAnswers((a) => ({ ...a, [q.key]: o.value }))}
                          className={`rounded-full border px-4 py-2.5 text-[15px] font-medium transition-colors ${
                            on ? "border-fg bg-fg text-night" : "border-edge hover:border-white/30"
                          }`}
                        >
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>
        </div>

        <div aria-live="polite" className="relative min-h-[360px]">
          <AnimatePresence mode="wait">
            {best && bestFinish ? (
              <motion.div
                key={best.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-[15px] font-medium text-dim">{t("bestMatch")}</p>
                <Link href={productHref(best)} className="group mt-3 block">
                  <Vitrine
                    glow={bestFinish.colorHex}
                    src={bestFinish.image}
                    alt={best.name}
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="aspect-[16/11] rounded-[24px]"
                    imageClassName="object-contain p-[8%] group-hover:scale-[1.03]"
                  />
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="text-2xl font-semibold sm:text-3xl">{best.name}</h3>
                    <p className="shrink-0 font-semibold tabular-nums">{formatPrice(minPrice(best), locale)}</p>
                  </div>
                  <p className="mt-1 text-dim">{best.subtitle}</p>
                </Link>

                {others.length > 0 && (
                  <div className="mt-6 border-t border-edge pt-4">
                    <p className="text-sm text-dim">{t("alsoConsider")}</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {others.slice(0, 2).map((p) => (
                        <li key={p.id}>
                          <Link
                            href={productHref(p)}
                            className="inline-flex rounded-full border border-edge px-4 py-2 text-[15px] font-medium transition-colors hover:border-white/30"
                          >
                            {p.name}, {formatPrice(minPrice(p), locale)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setAnswers({})}
                  className="mt-6 text-[15px] font-medium underline underline-offset-4"
                >
                  {t("startOver")}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[360px] items-center justify-center rounded-[24px] border border-dashed border-white/15 p-8 text-center text-dim"
              >
                {t("pick")}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
