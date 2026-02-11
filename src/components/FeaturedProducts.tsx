"use client";

import type { Product, ProductWithVariant } from "@/data/products";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export default function FeaturedProducts({
  products,
}: {
  products?: Product[];
}) {
  const t = useTranslations("FeaturedProducts");

  const allProducts = products || [];
  const featured: ProductWithVariant[] = useMemo(() => {
    const sorted = [...allProducts]
      .filter((p) => p.category !== "Accessories")
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
    return sorted
      .flatMap((product) =>
        product.variants.map((variant) => ({ product, variant }))
      )
      .slice(0, 4);
  }, [allProducts]);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              {t("subtitle")}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("title")}
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-semibold text-gray-600 transition-colors hover:text-blue-600 sm:flex"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item, i) => (
            <ProductCard key={`${item.product.id}-${item.variant.color}-${item.variant.storage}`} item={item} index={i} />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200"
          >
            {t("viewAllProducts")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
