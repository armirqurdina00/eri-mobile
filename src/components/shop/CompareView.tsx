"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { useLocale } from "@/components/LocaleProvider";
import { finishesOf, formatPrice, minPrice, productHref, storagesOf } from "@/lib/catalog";
import { MAX_COMPARE, useShop } from "./ShopProvider";
import Vitrine from "./Vitrine";

export default function CompareView() {
  const t = useTranslations("Compare");
  const { locale } = useLocale();
  const { products, compare, getProduct, toggleCompare, clearCompare } = useShop();
  const chosen = compare.flatMap((id) => getProduct(id) ?? []);
  const addable = products.filter((p) => !compare.includes(p.id));
  const slots = chosen.length + (chosen.length < MAX_COMPARE ? 1 : 0);

  const specLabels = [...new Set(chosen.flatMap((p) => p.specs.map((s) => s.label)))];
  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    { label: t("price"), render: (p) => <span className="font-semibold tabular-nums">{formatPrice(minPrice(p), locale)}</span> },
    {
      label: t("finishes"),
      render: (p) => (
        <span className="flex flex-wrap gap-1">
          {finishesOf(p).map((f) => (
            <span key={f.color} title={f.color} className="h-5 w-5 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]" style={{ background: f.colorHex }} />
          ))}
        </span>
      ),
    },
    { label: t("storage"), render: (p) => storagesOf(p).join(", ") || "—" },
    { label: t("rating"), render: (p) => (p.reviews ? `${p.rating.toFixed(1)} / 5` : "—") },
    ...specLabels.map((label) => ({
      label,
      render: (p: Product) => p.specs.find((s) => s.label === label)?.value ?? "—",
    })),
  ];

  const cols = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" }[Math.max(1, slots) as 1 | 2 | 3];

  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-semibold leading-none text-[clamp(2.75rem,8vw,6.5rem)]">{t("title")}</h1>
          <p className="mt-3 text-dim">{t("subtitle")}</p>
        </div>
        {chosen.length > 0 && (
          <button type="button" onClick={clearCompare} className="mb-1 text-[15px] font-medium underline underline-offset-4">
            {t("clear")}
          </button>
        )}
      </div>

      {chosen.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-edge px-6 py-20 text-center">
          <p className="text-lg">{t("empty")}</p>
          <Link href="/products" className="rounded-full bg-fg text-night px-6 py-3 text-[15px] font-medium">
            {t("browse")}
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <div className={`sticky top-16 z-10 grid ${cols} gap-3 bg-night pb-4 pt-2 sm:gap-6 lg:top-[72px] lg:grid-cols-[200px_repeat(3,1fr)]`}>
            <div className="hidden lg:block" />
            {chosen.map((p) => {
              const f = finishesOf(p)[0];
              return (
                <div key={p.id} className="relative min-w-0">
                  <Link href={productHref(p)} className="block">
                    <Vitrine glow={f?.colorHex ?? "#ccc"} src={f?.image ?? p.image} alt="" sizes="30vw" className="aspect-square rounded-[20px]" imageClassName="object-contain p-[12%]" />
                    <p className="font-semibold mt-3 text-base sm:text-xl">{p.name}</p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleCompare(p.id)}
                    aria-label={`${t("remove")} ${p.name}`}
                    className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-night/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
            {chosen.length < MAX_COMPARE && (
              <label className="flex aspect-square flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-edge p-3 text-center">
                <span className="text-sm font-medium sm:text-[15px]">{t("add")}</span>
                <select
                  value=""
                  onChange={(e) => e.target.value && toggleCompare(e.target.value)}
                  className="w-full max-w-[200px] rounded-full border border-edge bg-panel px-3 py-2 text-sm"
                >
                  <option value="">—</option>
                  {addable.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <dl className="divide-y divide-edge border-t border-edge">
            {rows.map((row) => (
              <div key={row.label} className="py-4 lg:grid lg:grid-cols-[200px_repeat(3,1fr)] lg:gap-6">
                <dt className="mb-2 text-sm font-medium text-dim lg:mb-0">{row.label}</dt>
                <div className={`grid ${cols} gap-3 text-sm sm:gap-6 sm:text-[15px] lg:contents`}>
                  {chosen.map((p) => (
                    <dd key={p.id} className="min-w-0 break-words">
                      {row.render(p)}
                    </dd>
                  ))}
                </div>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
