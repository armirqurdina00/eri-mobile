"use client";

import Link from "next/link";
import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/components/LocaleProvider";
import { formatPrice } from "@/lib/catalog";
import { useShop } from "./ShopProvider";
import { useOverlay } from "./useOverlay";
import Vitrine from "./Vitrine";

export default function CartDrawer() {
  const t = useTranslations("Cart");
  const { locale } = useLocale();
  const { cart, cartTotal, cartOpen, setCartOpen, setQuantity } = useShop();
  const close = useCallback(() => setCartOpen(false), [setCartOpen]);
  useOverlay(cartOpen, close);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-edge bg-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="flex h-16 items-center justify-between border-b border-edge px-5">
              <h2 className="font-semibold text-xl">{t("title")}</h2>
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                autoFocus
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-panel/[0.06]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <p className="text-lg text-dim">{t("empty")}</p>
                <Link
                  href="/products"
                  onClick={close}
                  className="rounded-full bg-fg text-night px-6 py-3 text-[15px] font-medium"
                >
                  {t("emptyCta")}
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-edge overflow-y-auto px-5">
                  {cart.map((line) => (
                    <li key={`${line.productId}-${line.color}-${line.storage}`} className="flex gap-4 py-5">
                      <Vitrine
                        glow={line.colorHex}
                        src={line.image}
                        alt=""
                        sizes="96px"
                        className="h-24 w-24 shrink-0 rounded-2xl"
                        imageClassName="object-contain p-2"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link
                          href={`/products/${line.productId}`}
                          onClick={close}
                          className="truncate text-base font-semibold hover:underline"
                        >
                          {line.name}
                        </Link>
                        <p className="text-sm text-dim">
                          {[line.color, line.storage].filter(Boolean).join(", ")}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-edge">
                            <button
                              type="button"
                              aria-label={t("decrease")}
                              onClick={() => setQuantity(line, line.quantity - 1)}
                              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-panel/[0.06]"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold tabular-nums">{line.quantity}</span>
                            <button
                              type="button"
                              aria-label={t("increase")}
                              onClick={() => setQuantity(line, line.quantity + 1)}
                              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-panel/[0.06]"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-semibold tabular-nums">
                            {formatPrice(line.price * line.quantity, locale)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuantity(line, 0)}
                          className="mt-2 self-start text-sm text-dim underline-offset-2 hover:text-fg hover:underline"
                        >
                          {t("remove")}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-edge px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
                  <dl className="space-y-1.5 text-[15px]">
                    <div className="flex justify-between">
                      <dt className="text-dim">{t("subtotal")}</dt>
                      <dd className="tabular-nums">{formatPrice(cartTotal, locale)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-dim">{t("delivery")}</dt>
                      <dd className="text-ok">{t("free")}</dd>
                    </div>
                  </dl>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="mt-4 flex h-14 items-center justify-between rounded-full bg-brand px-6 text-base font-semibold text-white shadow-[0_10px_40px_-12px] shadow-brand/70 transition-transform active:scale-[0.98]"
                  >
                    <span>{t("checkout")}</span>
                    <span className="tabular-nums">{formatPrice(cartTotal, locale)}</span>
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
