"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Smartphone, Headphones, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Categories() {
  const t = useTranslations("Categories");

  const categories = [
    {
      nameKey: "iphone17ProMax",
      descriptionKey: "iphone17ProMaxDesc",
      icon: Crown,
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      href: "/products?category=Pro",
    },
    {
      nameKey: "iphone17Pro",
      descriptionKey: "iphone17ProDesc",
      icon: Smartphone,
      gradient: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50",
      href: "/products?category=Pro",
    },
    {
      nameKey: "accessories",
      descriptionKey: "accessoriesDesc",
      icon: Headphones,
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      href: "/products?category=Accessories",
    },
    {
      nameKey: "deals",
      descriptionKey: "dealsDesc",
      icon: Sparkles,
      gradient: "from-red-500 to-pink-600",
      bg: "bg-red-50",
      href: "/deals",
    },
  ];

  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            {t("subtitle")}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("title")}
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={cat.href}
                className={`group flex flex-col items-center rounded-3xl ${cat.bg} p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-lg`}
                >
                  <cat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{t(cat.nameKey)}</h3>
                <p className="mt-1 text-sm text-gray-500">{t(cat.descriptionKey)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
