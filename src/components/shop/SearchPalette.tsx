"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/components/LocaleProvider";
import { finishesOf, formatPrice, minPrice, productHref, searchCatalog, type SearchHit } from "@/lib/catalog";
import { useShop } from "./ShopProvider";
import { startNavigationProgress } from "./NavigationProgress";
import { useOverlay } from "./useOverlay";
import Vitrine from "./Vitrine";

export default function SearchPalette() {
  const t = useTranslations("Search");
  const { locale } = useLocale();
  const router = useRouter();
  const { products, recent, getProduct, searchOpen, setSearchOpen } = useShop();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const close = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
    setActive(0);
  }, [setSearchOpen]);
  useOverlay(searchOpen, close);

  // ⌘K / Ctrl+K anywhere, or "/" when not already typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const sections = useMemo((): { title?: string; hits: SearchHit[] }[] => {
    if (query.trim()) return [{ hits: searchCatalog(products, query).slice(0, 8) }];
    const recentHits = recent.flatMap((id) => {
      const p = getProduct(id);
      return p ? [{ product: p, score: 0 }] : [];
    });
    const rest = products.filter((p) => !recent.includes(p.id)).map((p) => ({ product: p, score: 0 }));
    return [
      ...(recentHits.length ? [{ title: t("recent"), hits: recentHits.slice(0, 3) }] : []),
      { title: t("allModels"), hits: rest.slice(0, recentHits.length ? 5 : 8) },
    ];
  }, [query, products, recent, getProduct, t]);

  const flat = sections.flatMap((s) => s.hits);

  const open = (hit: SearchHit) => {
    startNavigationProgress();
    router.push(productHref(hit.product, hit.variant));
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      open(flat[active]);
    }
  };

  let index = -1;

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center sm:px-4 sm:pt-[10vh]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("placeholder")}
            className="relative flex h-full w-full flex-col overflow-hidden bg-night sm:h-auto sm:max-h-[75vh] sm:max-w-xl sm:rounded-3xl sm:shadow-2xl"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center gap-3 border-b border-edge px-5">
              <Search className="h-5 w-5 shrink-0 text-dim" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={t("placeholder")}
                role="combobox"
                aria-expanded="true"
                aria-controls="search-results"
                aria-activedescendant={flat[active] ? `hit-${active}` : undefined}
                className="h-16 flex-1 bg-transparent text-lg outline-none placeholder:text-dim"
              />
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-panel/[0.06]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div id="search-results" role="listbox" className="flex-1 overflow-y-auto p-2">
              {flat.length === 0 && <p className="px-4 py-10 text-center text-dim">{t("noResults", { query })}</p>}
              {sections.map((section, si) => (
                <div key={si} className="mb-1">
                  {section.title && <p className="px-3 pb-1 pt-3 text-sm font-medium text-dim">{section.title}</p>}
                  {section.hits.map((hit) => {
                    index += 1;
                    const i = index;
                    const finish = hit.variant
                      ? { colorHex: hit.variant.colorHex, image: hit.variant.image }
                      : finishesOf(hit.product)[0];
                    const price = hit.variant?.price ?? minPrice(hit.product);
                    return (
                      <button
                        key={hit.product.id}
                        id={`hit-${i}`}
                        role="option"
                        aria-selected={i === active}
                        type="button"
                        onMouseMove={() => setActive(i)}
                        onClick={() => open(hit)}
                        className={`flex w-full items-center gap-4 rounded-2xl p-2 text-left ${
                          i === active ? "bg-panel" : ""
                        }`}
                      >
                        <Vitrine
                          glow={finish?.colorHex ?? "#ccc"}
                          src={finish?.image ?? hit.product.image}
                          alt=""
                          sizes="56px"
                          className="h-14 w-14 shrink-0 rounded-xl"
                          imageClassName="object-contain p-1.5"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{hit.product.name}</span>
                          <span className="block truncate text-sm text-dim">
                            {hit.variant
                              ? [hit.variant.color, hit.variant.storage].filter(Boolean).join(", ")
                              : hit.product.subtitle}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold tabular-nums">
                          {formatPrice(price, locale)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="hidden border-t border-edge px-5 py-3 text-xs text-dim sm:block">{t("keys")}</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
