"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { ProductWithVariant } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ProductsContent({ items }: { items: ProductWithVariant[] }) {
  const t = useTranslations("Products");
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "All"
  );
  const [sortBy, setSortBy] = useState<string>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const sortRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 16;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { key: "all", label: t("all") },
    { key: "pro", label: t("pro") },
    { key: "standard", label: t("standard") },
    { key: "accessories", label: t("accessories") },
  ];

  const filtered = useMemo(() => {
    let result =
      selectedCategory === "All"
        ? items
        : items.filter((item) => item.product.category === selectedCategory);

    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.variant.price - b.variant.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.variant.price - a.variant.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.product.rating - a.product.rating);
        break;
      default:
        break;
    }

    return result;
  }, [selectedCategory, sortBy, items]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters/sort change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key === "all" ? "All" : cat.key === "pro" ? "Pro" : cat.key === "standard" ? "Standard" : "Accessories")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${selectedCategory === (cat.key === "all" ? "All" : cat.key === "pro" ? "Pro" : cat.key === "standard" ? "Standard" : "Accessories")
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
            >
              {
                [
                  { value: "featured", label: t("featured") },
                  { value: "price-low", label: t("priceLowHigh") },
                  { value: "price-high", label: t("priceHighLow") },
                  { value: "rating", label: t("topRated") },
                ].find((o) => o.value === sortBy)?.label
              }
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                >
                  {[
                    { value: "featured", label: t("featured") },
                    { value: "price-low", label: t("priceLowHigh") },
                    { value: "price-high", label: t("priceHighLow") },
                    { value: "rating", label: t("topRated") },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        sortBy === option.value
                          ? "bg-gray-50 font-semibold text-gray-900"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                      {sortBy === option.value && (
                        <Check className="h-4 w-4 text-gray-900" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results count */}
        <p className="mt-6 text-sm text-gray-400">
          {filtered.length === 1
            ? t("productCount", { count: filtered.length })
            : t("productsCount", { count: filtered.length })
          }
        </p>

        {/* Product Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((item, i) => (
            <ProductCard
              key={`${item.product.id}-${item.variant.color}-${item.variant.storage}`}
              item={item}
              index={i}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                  p === currentPage
                    ? "bg-gray-900 text-white shadow-lg"
                    : "border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
