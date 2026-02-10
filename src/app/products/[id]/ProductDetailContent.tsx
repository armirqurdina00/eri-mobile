"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  ChevronLeft,
  Check,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailContent({
  product,
  allProducts,
}: {
  product?: Product;
  allProducts: Product[];
}) {
  const { addToCart } = useCart();

  const firstVariant = product?.variants[0];

  const [selectedColor, setSelectedColor] = useState(firstVariant?.color || "");
  const [selectedStorage, setSelectedStorage] = useState(
    firstVariant?.storage || ""
  );
  const [added, setAdded] = useState(false);

  // Derive unique colors and storages from variants
  const uniqueColors = useMemo(() => {
    if (!product) return [];
    const seen = new Map<
      string,
      { color: string; colorHex: string; image: string }
    >();
    product.variants.forEach((v) => {
      if (!seen.has(v.color)) {
        seen.set(v.color, {
          color: v.color,
          colorHex: v.colorHex,
          image: v.image,
        });
      }
    });
    return [...seen.values()];
  }, [product]);

  const uniqueStorages = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.map((v) => v.storage).filter(Boolean))];
  }, [product]);

  // Find the active variant based on selection
  const activeVariant = useMemo(() => {
    if (!product) return null;
    // Try exact match first
    const exact = product.variants.find(
      (v) => v.color === selectedColor && v.storage === selectedStorage
    );
    if (exact) return exact;
    // Fallback to first variant of selected color
    const colorMatch = product.variants.find(
      (v) => v.color === selectedColor
    );
    if (colorMatch) return colorMatch;
    return product.variants[0] || null;
  }, [product, selectedColor, selectedStorage]);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Product not found
          </h1>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedStorage);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const displayPrice = activeVariant?.price ?? product.variants[0]?.price ?? 0;
  const displayOriginalPrice = activeVariant?.originalPrice;
  const displayImage =
    uniqueColors.find((c) => c.color === selectedColor)?.image ||
    product.image;

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex items-start justify-center rounded-3xl bg-gradient-to-b from-gray-50 to-white p-8 lg:p-12"
          >
            {product.badge && (
              <span
                className={`absolute left-6 top-6 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                  product.badge === "New" ? "bg-blue-600" : "bg-red-500"
                }`}
              >
                {product.badge}
              </span>
            )}
            <Image
              src={displayImage}
              alt={`${product.name} - ${selectedColor}`}
              width={450}
              height={450}
              className="h-auto max-h-[500px] w-auto object-contain"
              priority
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-1 text-lg text-gray-500">{product.subtitle}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-red-500">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {product.rating}
              </span>
              <span className="text-sm text-gray-400">
                ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                €{displayPrice.toLocaleString()}
              </span>
              {displayOriginalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    €{displayOriginalPrice.toLocaleString()}
                  </span>
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                    Save €
                    {(displayOriginalPrice - displayPrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Stock info */}
            {activeVariant && (
              <div className="mt-2">
                {activeVariant.inStock ? (
                  <span className="text-sm text-green-600">
                    In Stock ({activeVariant.stock} available)
                  </span>
                ) : (
                  <span className="text-sm text-red-500">Out of Stock</span>
                )}
              </div>
            )}

            {/* Description */}
            <p className="mt-6 text-base leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* Color Picker */}
            {uniqueColors.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900">
                  Color —{" "}
                  <span className="font-normal text-gray-500">
                    {selectedColor}
                  </span>
                </h3>
                <div className="mt-3 flex gap-3">
                  {uniqueColors.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setSelectedColor(c.color)}
                      className={`relative h-9 w-9 rounded-full border-2 transition-all ${
                        selectedColor === c.color
                          ? "border-blue-600 ring-2 ring-blue-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ backgroundColor: c.colorHex }}
                      title={c.color}
                    >
                      {selectedColor === c.color && (
                        <Check
                          className={`absolute inset-0 m-auto h-4 w-4 ${
                            c.colorHex === "#F5F5F0" ||
                            c.colorHex === "#F2F1ED" ||
                            c.colorHex === "#C2BCB2"
                              ? "text-gray-900"
                              : "text-white"
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Picker */}
            {uniqueStorages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900">Storage</h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {uniqueStorages.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedStorage(s)}
                      className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
                        selectedStorage === s
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={activeVariant ? !activeVariant.inStock : false}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all ${
                  added
                    ? "bg-green-600 shadow-green-500/25"
                    : "bg-gradient-to-r from-blue-600 to-violet-600 shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 hover:brightness-110"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: RotateCcw, label: "30-Day Returns" },
                { icon: Shield, label: "1-Year Warranty" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-gray-50 p-4 text-center"
                >
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="text-xs font-medium text-gray-600">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Specs */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-900">
                Key Specifications
              </h3>
              <div className="mt-3 divide-y divide-gray-100 rounded-2xl border border-gray-100">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <span className="text-sm text-gray-500">{spec.label}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-gray-900">
              You Might Also Like
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
