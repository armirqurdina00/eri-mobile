"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import type { ProductWithVariant } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function ProductCard({
  item,
  index = 0,
}: {
  item: ProductWithVariant;
  index?: number;
}) {
  const { addToCart } = useCart();
  const { product, variant } = item;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 sm:rounded-3xl"
    >
      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs ${
            product.badge === "New"
              ? "bg-blue-600 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {product.badge}
        </div>
      )}

      {/* Image */}
      <Link href={`/products/${product.id}?color=${encodeURIComponent(variant.color)}&storage=${encodeURIComponent(variant.storage)}`} className="relative mx-auto flex h-40 w-full items-center justify-center bg-gradient-to-b from-gray-50 to-white p-3 sm:h-64 sm:p-6">
        <Image
          src={variant.image}
          alt={`${product.name} - ${variant.color}`}
          width={200}
          height={200}
          className="h-full w-auto max-w-[120px] object-contain transition-transform duration-500 group-hover:scale-105 sm:max-w-[180px]"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3 pt-2 sm:p-5 sm:pt-3">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <Link href={`/products/${product.id}?color=${encodeURIComponent(variant.color)}&storage=${encodeURIComponent(variant.storage)}`}>
              <h3 className="truncate text-xs font-semibold text-gray-900 transition-colors hover:text-blue-600 sm:text-base">
                {product.name}
              </h3>
            </Link>
            <p className="mt-0.5 hidden text-sm text-gray-500 sm:block">{product.subtitle}</p>
          </div>
        </div>

        {/* Color & Storage */}
        <div className="mt-2 flex flex-wrap items-center gap-1 sm:mt-3 sm:gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full border border-gray-200 shadow-sm sm:h-3 sm:w-3"
              style={{ backgroundColor: variant.colorHex }}
            />
            {variant.color}
          </span>
          {variant.storage && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700 sm:px-2.5 sm:py-1 sm:text-xs">
              {variant.storage}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1 sm:mt-3 sm:gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium text-gray-500 sm:text-xs">
            ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-auto flex items-center justify-between pt-1 sm:pt-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span className="font-bold text-sm border border-gray-300 px-2 sm:px-4 rounded-full text-gray-900 sm:text-xl">
              €{variant.price.toLocaleString()}
            </span>
            {variant.originalPrice && (
              <span className="text-xs text-gray-400 line-through sm:text-sm">
                €{variant.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, variant.color, variant.storage, variant.price, variant.image);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all hover:bg-blue-600 hover:scale-110 active:scale-95 sm:h-10 sm:w-10"
          >
            <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
