"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CartSlider() {
  const t = useTranslations("CartSlider");
  const { items, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } =
    useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Slider */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-gray-900" />
                <h2 className="text-lg font-semibold text-gray-900">{t("yourCart")}</h2>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  {items.length} {items.length === 1 ? t("item") : t("items")}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                    <ShoppingBag className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-900">{t("emptyTitle")}</p>
                  <p className="mt-1 text-sm text-gray-500">{t("emptySubtitle")}</p>
                  <Link
                    href="/products"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    {t("browseProducts")}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 rounded-2xl bg-gray-50 p-4"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 rounded-xl bg-white p-1">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {item.product.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {item.selectedColor}
                              {item.selectedStorage && ` · ${item.selectedStorage}`}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="h-6 w-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 rounded-full bg-white border border-gray-200 px-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:text-gray-900"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 hover:text-gray-900"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            ${(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{t("subtotal")}</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="mb-4 text-xs text-gray-400">{t("shippingNote")}</p>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-110"
                >
                  {t("checkout")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
