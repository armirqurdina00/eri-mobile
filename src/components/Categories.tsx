"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, Smartphone, Headphones, Tag, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Categories() {
  const t = useTranslations("Categories");

  const categories = [
    {
      nameKey: "proSeries",
      descKey: "proSeriesDesc",
      tagKey: "proSeriesTag",
      icon: Cpu,
      gradient: "from-blue-600 to-violet-600",
      iconBg: "bg-blue-500/10",
      accent: "text-blue-600",
      tagColor: "bg-blue-50 text-blue-600 ring-blue-500/20",
      href: "/products?category=Pro",
    },
    {
      nameKey: "standardSeries",
      descKey: "standardSeriesDesc",
      tagKey: "standardSeriesTag",
      icon: Smartphone,
      gradient: "from-gray-800 to-gray-900",
      iconBg: "bg-gray-500/10",
      accent: "text-gray-900",
      tagColor: "bg-gray-100 text-gray-600 ring-gray-500/20",
      href: "/products?category=Standard",
    },
    {
      nameKey: "accessories",
      descKey: "accessoriesDesc",
      tagKey: "accessoriesTag",
      icon: Headphones,
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-500/10",
      accent: "text-violet-600",
      tagColor: "bg-violet-50 text-violet-600 ring-violet-500/20",
      href: "/products?category=Accessories",
    },
    {
      nameKey: "deals",
      descKey: "dealsDesc",
      tagKey: "dealsTag",
      icon: Tag,
      gradient: "from-rose-500 to-orange-500",
      iconBg: "bg-rose-500/10",
      accent: "text-rose-600",
      tagColor: "bg-rose-50 text-rose-600 ring-rose-500/20",
      href: "/deals",
    },
  ];

  return (
    <section className="bg-gray-50/80 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600 ring-1 ring-blue-100">
            {t("subtitle")}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("title")}
          </h2>
        </motion.div>

        {/* Grid — 2 cols mobile, 4 cols desktop */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.nameKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                href={cat.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-gray-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60 sm:rounded-3xl sm:p-6"
              >
                {/* Background gradient orb */}
                <div
                  className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${cat.gradient} opacity-[0.06] blur-2xl transition-all duration-500 group-hover:opacity-[0.12] group-hover:scale-150 sm:-right-8 sm:-top-8 sm:h-40 sm:w-40`}
                />

                {/* Icon + Tag row */}
                <div className="relative flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${cat.iconBg} sm:h-12 sm:w-12 sm:rounded-2xl`}
                  >
                    <cat.icon className={`h-5 w-5 ${cat.accent} sm:h-6 sm:w-6`} />
                  </div>
                  <span
                    className={`hidden rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 sm:inline-flex sm:text-xs ${cat.tagColor}`}
                  >
                    {t(cat.tagKey)}
                  </span>
                </div>

                {/* Text */}
                <div className="relative mt-4 flex-1 sm:mt-5">
                  <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                    {t(cat.nameKey)}
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-400 line-clamp-2 sm:text-sm sm:text-gray-500">
                    {t(cat.descKey)}
                  </p>
                </div>

                {/* Arrow */}
                <div className="relative mt-4 sm:mt-5">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${cat.accent} sm:text-sm`}>
                    {t("explore")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:h-4 sm:w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
