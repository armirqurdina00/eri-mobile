"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { placeOrderAction } from "@/actions/orders";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CreditCard,
  Lock,
  Truck,
  ShoppingBag,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  if (orderId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50"
        >
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </motion.div>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your order <span className="font-medium text-gray-900">{orderId}</span> has been received.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-16">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
          <ShoppingBag className="h-8 w-8 text-gray-300" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          {t("emptyTitle")}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {t("emptySubtitle")}
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          {t("browseProducts")}
        </Link>
      </div>
    );
  }

  const shipping = 0;
  const tax = Math.round(totalPrice * 0.08);
  const total = totalPrice + shipping + tax;

  async function handlePlaceOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const firstName = (form.get("firstName") as string).trim();
    const lastName = (form.get("lastName") as string).trim();
    const email = (form.get("email") as string).trim();
    const address = (form.get("address") as string).trim();
    const city = (form.get("city") as string).trim();
    const state = (form.get("state") as string).trim();
    const zipCode = (form.get("zipCode") as string).trim();

    if (!firstName || !lastName || !email || !address || !city || !state || !zipCode) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const result = await placeOrderAction({
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.variants.find(v => v.color === item.selectedColor && v.storage === item.selectedStorage)?.price ?? item.product.variants[0]?.price ?? 0,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedStorage: item.selectedStorage,
          image: item.product.image,
        })),
        customer: { firstName, lastName, email, address, city, state, zipCode },
        subtotal: totalPrice,
        shipping,
        tax,
        total,
      });

      if (result.success && result.orderId) {
        clearCart();
        setOrderId(result.orderId);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("continueShopping")}
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">{t("title")}</h1>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Contact */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("contactInfo")}
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("firstName")}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("lastName")}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("shippingAddress")}
                </h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("address")}
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("city")}
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("state")}
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("zipCode")}
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <CreditCard className="h-5 w-5" />
                  {t("payment")}
                </h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("cardNumber")}
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("expiry")}
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        required
                        className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {t("cvc")}
                      </label>
                      <input
                        type="text"
                        name="cvc"
                        required
                        className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("orderSummary")}
                </h2>

                <div className="mt-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-xl bg-gray-50 p-1">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-1 justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t("qty", { quantity: item.quantity })}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          €{((item.product.variants.find(v => v.color === item.selectedColor && v.storage === item.selectedStorage)?.price ?? item.product.variants[0]?.price ?? 0) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t("subtotal")}</span>
                    <span className="text-gray-900">
                      €{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Truck className="h-3.5 w-3.5" /> {t("shipping")}
                    </span>
                    <span className="font-medium text-green-600">{t("free")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t("tax")}</span>
                    <span className="text-gray-900">€{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
                    <span className="text-gray-900">{t("total")}</span>
                    <span className="text-gray-900">
                      €{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:brightness-110 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      {t("placeOrder", { amount: total.toLocaleString() })}
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-gray-400">
                  {t("secureCheckout")}
                </p>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
