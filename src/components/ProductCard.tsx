"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0}}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
    >
      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold ${
            product.badge === "New"
              ? "bg-blue-600 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {product.badge}
        </div>
      )}

      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative mx-auto flex h-64 w-full items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="h-full w-auto max-w-[180px] object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/products/${product.id}`}>
              <h3 className="text-base font-semibold text-gray-900 transition-colors hover:text-blue-600">
                {product.name}
              </h3>
            </Link>
            <p className="mt-0.5 text-sm text-gray-500">{product.subtitle}</p>
          </div>
        </div>

        {/* Colors */}
        <div className="mt-3 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              className="h-4 w-4 rounded-full border border-gray-200 shadow-sm"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
          )}
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-500">
            ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              €{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                €{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, product.color, product.storage[0] || "");
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all hover:bg-blue-600 hover:scale-110 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
