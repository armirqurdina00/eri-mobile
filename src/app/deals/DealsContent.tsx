"use client";

import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DealsContent({ deals }: { deals: Product[] }) {
  const t = useTranslations("Deals");

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/25">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            {t("subtitle")}
          </p>

          {/* Urgency Banner */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 ring-1 ring-red-100">
            <Clock className="h-4 w-4" />
            {t("urgency")}
          </div>
        </motion.div>

        {/* Deals Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Trade-in Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-center text-white sm:p-12"
        >
          <h2 className="text-3xl font-bold">{t("tradeInTitle")}</h2>
          <p className="mt-3 text-lg text-gray-300">
            {t("tradeInDescription")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            {["iPhone 15 Pro Max → $350", "iPhone 14 Pro → $250", "iPhone 13 → $150"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
