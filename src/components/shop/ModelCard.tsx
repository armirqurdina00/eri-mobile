"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, GitCompareArrows, Heart, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { useLocale } from "@/components/LocaleProvider";
import { finishesOf, formatPrice, inStock, isOnSale, minPrice, productHref, sortStorage } from "@/lib/catalog";
import { useShop } from "./ShopProvider";
import { useSpotlight } from "./useSpotlight";
import { flyToBag } from "./flyToBag";
import Vitrine from "./Vitrine";
import Swatches from "./Swatches";

export default function ModelCard({
  product,
  initialColor,
  priority,
}: {
  product: Product;
  /** Lead with this finish, e.g. the colour a shopper filtered by. */
  initialColor?: string;
  priority?: boolean;
}) {
  const t = useTranslations("Card");
  const p = useTranslations("Product");
  const { locale } = useLocale();
  const { saved, toggleSaved, compare, toggleCompare, addToCart } = useShop();
  const spotlight = useSpotlight();
  const caseRef = useRef<HTMLDivElement>(null);
  const finishes = finishesOf(product);
  const [color, setColor] = useState(initialColor ?? finishes[0]?.color);
  const [justAdded, setJustAdded] = useState(false);
  const finish = finishes.find((f) => f.color === color) ?? finishes[0];

  // Quick add takes the smallest storage that's in stock for the chosen finish.
  const forColor = product.variants.filter((v) => v.color === finish?.color && inStock(v));
  const quickVariant = sortStorage(forColor.map((v) => v.storage))
    .map((s) => forColor.find((v) => v.storage === s)!)
    .at(0);

  const isSaved = saved.includes(product.id);
  const isComparing = compare.includes(product.id);
  const soldOut = !product.variants.some(inStock);
  const sale = isOnSale(product);
  const from = minPrice(product);
  const was = product.variants.find((v) => v.price === from)?.originalPrice;
  const href = productHref(product, forColor[0] ?? product.variants.find((v) => v.color === finish?.color));
  const badge = soldOut ? t("soldOut") : sale ? t("sale") : product.badge === "New" ? t("new") : product.badge;

  const quickAdd = () => {
    if (!quickVariant || !finish) return;
    flyToBag(caseRef.current, finish.image);
    addToCart(
      {
        productId: product.id,
        name: product.name,
        color: quickVariant.color,
        colorHex: quickVariant.colorHex,
        storage: quickVariant.storage,
        image: finish.image,
        price: quickVariant.price,
      },
      { openBag: false }
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article
      onPointerMove={spotlight}
      className="spotlight group relative flex h-full flex-col rounded-[26px] border border-edge bg-panel p-2 transition-colors duration-300 hover:border-white/20"
    >
      <div className="relative" ref={caseRef}>
        <Link href={href} aria-label={product.name} className="block">
          <Vitrine
            src={finish?.image ?? product.image}
            alt={`${product.name}, ${finish?.color ?? ""}`}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
            glow={finish?.colorHex}
            priority={priority}
            className="aspect-[4/5] rounded-[20px]"
            imageClassName="object-contain p-[14%] group-hover:-translate-y-1.5 group-hover:scale-[1.05]"
          />
        </Link>
        {badge && (
          <span
            className={`pointer-events-none absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              soldOut ? "bg-night/80 text-dim" : sale ? "bg-brand text-white" : "bg-night text-fg"
            }`}
          >
            {badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleSaved(product.id)}
          aria-pressed={isSaved}
          aria-label={isSaved ? t("saved") : t("save")}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-night/80 text-fg backdrop-blur transition-transform active:scale-90"
        >
          <motion.span key={String(isSaved)} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 14 }}>
            <Heart className={`h-4 w-4 ${isSaved ? "fill-brand text-brand" : ""}`} />
          </motion.span>
        </button>
        {quickVariant && (
          <button
            type="button"
            onClick={quickAdd}
            aria-label={`${p("addToBag")}: ${product.name}, ${quickVariant.color}, ${quickVariant.storage}`}
            className="absolute bottom-2.5 right-2.5 flex h-10 items-center gap-1.5 overflow-hidden rounded-full bg-night px-3 text-sm font-semibold text-fg shadow-lg transition-all duration-300 hover:bg-brand sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus-visible:translate-y-0 sm:focus-visible:opacity-100"
          >
            <AnimatePresence mode="wait" initial={false}>
              {justAdded ? (
                <motion.span key="ok" initial={{ y: 12 }} animate={{ y: 0 }} exit={{ y: -12 }}>
                  <Check className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ y: 12 }} animate={{ y: 0 }} exit={{ y: -12 }}>
                  <Plus className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
            <span className="hidden tabular-nums sm:inline">{quickVariant.storage}</span>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-2 pt-4">
        <Link href={href}>
          <h3 className="text-[17px] font-semibold sm:text-xl">{product.name}</h3>
        </Link>
        <Swatches
          finishes={finishes}
          value={finish?.color}
          onChange={setColor}
          size="sm"
          className="mt-2.5"
          label={t("finishes", { count: finishes.length })}
        />
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 pt-4">
          <p className="text-[15px]">
            <span className="font-semibold tabular-nums">{t("from", { price: formatPrice(from, locale) })}</span>
            {was && was > from && <s className="ml-2 text-sm text-dim tabular-nums">{formatPrice(was, locale)}</s>}
          </p>
          <button
            type="button"
            onClick={() => toggleCompare(product.id)}
            aria-pressed={isComparing}
            className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:inline-flex ${
              isComparing ? "border-fg bg-fg text-night" : "border-edge text-dim hover:border-white/30 hover:text-fg"
            }`}
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
            {isComparing ? t("comparing") : t("compare")}
          </button>
        </div>
      </div>
    </article>
  );
}
