"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Product, ProductVariant } from "@/data/products";
import { useLocale } from "@/components/LocaleProvider";
import {
  colorFamilies,
  colorFamily,
  formatPrice,
  inStock,
  sortStorage,
  type ColorFamily,
} from "@/lib/catalog";
import { useShop } from "../ShopProvider";
import { useOverlay } from "../useOverlay";
import ModelCard from "../ModelCard";
import Dropdown from "../Dropdown";

type Filters = {
  category: string;
  max?: number;
  storage: string[];
  color: ColorFamily[];
  sale: boolean;
  stock: boolean;
  sort: "newest" | "price-asc" | "price-desc" | "rating";
};

function parse(params: URLSearchParams): Filters {
  const list = (k: string) => params.get(k)?.split(",").filter(Boolean) ?? [];
  const sort = params.get("sort");
  return {
    category: params.get("category") ?? "all",
    max: Number(params.get("max")) || undefined,
    storage: list("storage"),
    color: list("color") as ColorFamily[],
    sale: params.get("sale") === "1",
    stock: params.get("stock") === "1",
    sort: sort === "price-asc" || sort === "price-desc" || sort === "rating" ? sort : "newest",
  };
}

function serialize(f: Filters): string {
  const q = new URLSearchParams();
  if (f.category !== "all") q.set("category", f.category);
  if (f.max) q.set("max", String(f.max));
  if (f.storage.length) q.set("storage", f.storage.join(","));
  if (f.color.length) q.set("color", f.color.join(","));
  if (f.sale) q.set("sale", "1");
  if (f.stock) q.set("stock", "1");
  if (f.sort !== "newest") q.set("sort", f.sort);
  return q.toString();
}

function variantMatches(v: ProductVariant, f: Filters) {
  return (
    (!f.max || v.price <= f.max) &&
    (!f.storage.length || f.storage.includes(v.storage)) &&
    (!f.color.length || f.color.includes(colorFamily(v.colorHex))) &&
    (!f.sale || (!!v.originalPrice && v.originalPrice > v.price)) &&
    (!f.stock || inStock(v))
  );
}

export default function ShopView() {
  const t = useTranslations("Shop");
  const { locale } = useLocale();
  const { products } = useShop();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const filters = useMemo(() => parse(params), [params]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  useOverlay(sheetOpen, closeSheet);

  const update = (patch: Partial<Filters>) => {
    const q = serialize({ ...filters, ...patch });
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const facets = useMemo(() => {
    const prices = products.flatMap((p) => p.variants.map((v) => v.price));
    const families = new Set(products.flatMap((p) => p.variants.map((v) => colorFamily(v.colorHex))));
    return {
      categories: ["all", ...new Set(products.map((p) => p.category))],
      storages: sortStorage([...new Set(products.flatMap((p) => p.variants.map((v) => v.storage)).filter(Boolean))]),
      colors: colorFamilies.filter((c) => families.has(c.key)),
      minPrice: Math.floor(Math.min(...prices) / 100) * 100,
      maxPrice: Math.ceil(Math.max(...prices) / 100) * 100,
    };
  }, [products]);

  const results = useMemo(() => {
    const matched: { product: Product; variants: ProductVariant[] }[] = [];
    for (const product of products) {
      if (filters.category !== "all" && product.category !== filters.category) continue;
      const variants = product.variants.filter((v) => variantMatches(v, filters));
      if (variants.length) matched.push({ product, variants });
    }
    const low = (m: (typeof matched)[number]) => Math.min(...m.variants.map((v) => v.price));
    if (filters.sort === "price-asc") matched.sort((a, b) => low(a) - low(b));
    if (filters.sort === "price-desc") matched.sort((a, b) => low(b) - low(a));
    if (filters.sort === "rating") matched.sort((a, b) => b.product.rating - a.product.rating);
    return matched;
  }, [products, filters]);

  const activeCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.max ? 1 : 0) +
    filters.storage.length +
    filters.color.length +
    (filters.sale ? 1 : 0) +
    (filters.stock ? 1 : 0);

  const clear = () => update({ category: "all", max: undefined, storage: [], color: [], sale: false, stock: false });
  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

  const chip = (on: boolean) =>
    `rounded-full border px-3.5 py-2 text-[15px] font-medium transition-colors ${
      on ? "border-fg bg-fg text-night" : "border-edge bg-panel/[0.04] hover:border-white/30"
    }`;

  const panel = (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 font-semibold">{t("category")}</legend>
        <div className="flex flex-wrap gap-2">
          {facets.categories.map((c) => (
            <button key={c} type="button" aria-pressed={filters.category === c} onClick={() => update({ category: c })} className={chip(filters.category === c)}>
              {t.has(c) ? t(c) : c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 flex w-full items-baseline justify-between font-semibold">
          {t("price")}
          <span className="text-[15px] font-normal tabular-nums text-dim">
            {filters.max ? formatPrice(filters.max, locale) : t("anyPrice")}
          </span>
        </legend>
        <input
          type="range"
          min={facets.minPrice}
          max={facets.maxPrice}
          step={50}
          value={filters.max ?? facets.maxPrice}
          onChange={(e) => {
            const v = Number(e.target.value);
            update({ max: v >= facets.maxPrice ? undefined : v });
          }}
          aria-label={t("price")}
          className="w-full accent-[#e8252e]"
        />
      </fieldset>

      {facets.storages.length > 0 && (
        <fieldset>
          <legend className="mb-3 font-semibold">{t("storage")}</legend>
          <div className="flex flex-wrap gap-2">
            {facets.storages.map((s) => (
              <button key={s} type="button" aria-pressed={filters.storage.includes(s)} onClick={() => update({ storage: toggle(filters.storage, s) })} className={chip(filters.storage.includes(s))}>
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-3 font-semibold">{t("color")}</legend>
        <div className="grid gap-1">
          {facets.colors.map((c) => {
            const on = filters.color.includes(c.key);
            return (
              <button
                key={c.key}
                type="button"
                aria-pressed={on}
                onClick={() => update({ color: toggle(filters.color, c.key) })}
                className={`flex items-center gap-3 rounded-xl px-2 py-2 text-left text-[15px] ${on ? "bg-white/[0.08] font-semibold" : "hover:bg-white/[0.04]"}`}
              >
                <span className={`h-6 w-6 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] ${on ? "ring-2 ring-fg ring-offset-2 ring-offset-night" : ""}`} style={{ background: c.hex }} />
                {t(c.key)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={filters.sale} onClick={() => update({ sale: !filters.sale })} className={chip(filters.sale)}>
          {t("onlySale")}
        </button>
        <button type="button" aria-pressed={filters.stock} onClick={() => update({ stock: !filters.stock })} className={chip(filters.stock)}>
          {t("onlyStock")}
        </button>
      </div>

      {activeCount > 0 && (
        <button type="button" onClick={clear} className="text-[15px] font-medium underline underline-offset-4">
          {t("clear")}
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-semibold leading-none text-[clamp(2.75rem,8vw,6.5rem)]">{t("title")}</h1>
          <p className="mt-3 text-dim" aria-live="polite">
            {t("count", { count: results.length })}
          </p>
        </div>
        <div className="hidden items-center gap-3 text-[15px] lg:flex">
          <span className="text-dim">{t("sort")}</span>
          <SortSelect value={filters.sort} onChange={(sort) => update({ sort })} />
        </div>
      </div>

      {/* Mobile toolbar */}
      <div className="glass sticky top-[72px] z-20 -mx-4 mt-6 flex items-center gap-2 border-b border-edge px-4 py-3 sm:-mx-6 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-fg text-night px-4 text-[15px] font-medium"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t("filters")}
          {activeCount > 0 && <span className="tabular-nums opacity-70">{activeCount}</span>}
        </button>
        <SortSelect value={filters.sort} onChange={(sort) => update({ sort })} label={t("sort")} />
      </div>

      <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-[26px] border border-edge bg-panel p-5">{panel}</div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-edge px-6 py-20 text-center">
              <p className="text-lg">{t("empty")}</p>
              <button type="button" onClick={clear} className="rounded-full bg-fg text-night px-6 py-3 text-[15px] font-medium">
                {t("clear")}
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map(({ product, variants }, i) => {
                  // Lead with a finish that matches the filters, so a "blue" search shows blue phones.
                  const lead = filters.color.length ? variants[0]?.color : undefined;
                  return (
                    <motion.div
                      key={`${product.id}-${lead ?? ""}`}
                      layout
                      className="h-full"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ModelCard product={product} initialColor={lead} priority={i < 2} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {sheetOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSheet} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("filters")}
              className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[28px] border-t border-edge bg-panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="flex items-center justify-between px-5 pb-2 pt-4">
                <h2 className="font-semibold text-xl">{t("filters")}</h2>
                <button type="button" onClick={closeSheet} aria-label={t("showResults", { count: results.length })} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-panel/[0.06]">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2">{panel}</div>
              <div className="border-t border-edge px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                <button type="button" onClick={closeSheet} className="h-14 w-full rounded-full bg-brand text-base font-semibold text-white shadow-[0_10px_40px_-12px] shadow-brand/70">
                  {t("showResults", { count: results.length })}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SortSelect({
  value,
  onChange,
  label,
}: {
  value: Filters["sort"];
  onChange: (v: Filters["sort"]) => void;
  label?: string;
}) {
  const t = useTranslations("Shop");
  return (
    <Dropdown<Filters["sort"]>
      value={value}
      onChange={onChange}
      label={label ?? t("sort")}
      align="right"
      className="min-w-0 flex-1 lg:w-60 lg:flex-none"
      options={[
        { value: "newest", label: t("sortNewest") },
        { value: "price-asc", label: t("sortPriceLow") },
        { value: "price-desc", label: t("sortPriceHigh") },
        { value: "rating", label: t("sortRating") },
      ]}
    />
  );
}
