"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fafafa]">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-100 to-violet-100 opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-violet-100 to-blue-50 opacity-40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col-reverse items-center justify-center gap-12 px-4 pb-20 pt-32 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 lg:pt-20">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-100"
          >
            <Zap className="h-3.5 w-3.5" />
            {t("badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
          >
            {t("titlePart1")}{" "}
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>{" "}
            {t("titlePart2")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-6 text-lg leading-relaxed text-gray-500 sm:text-xl"
          >
            {t("description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:brightness-110"
            >
              {t("shopNow")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-4 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              {t("viewAllModels")}
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center gap-6 lg:gap-8"
          >
            {[
              { icon: Truck, label: t("freeShipping") },
              { icon: Shield, label: t("warranty") },
              { icon: Zap, label: t("sameDayDelivery") },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-500">
                <Icon className="h-4 w-4 text-blue-600" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-violet-400/20 blur-3xl" />
          <div className="relative h-[250px] w-[500px] sm:h-[300px] sm:w-[580px] lg:h-[350px] lg:w-[640px]">
            <Image
              src="https://www.pngall.com/wp-content/uploads/20/iPhone-17-Pro-Max-Concept-PNG.png"
              alt="iPhone 17 Pro Max"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Floating Badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -left-4 top-1/4 rounded-2xl bg-white/90 px-4 py-3 shadow-xl backdrop-blur-sm sm:left-0 lg:-left-8"
          >
            <p className="text-xs font-semibold text-gray-900">{t("a18ProChip")}</p>
            <p className="text-xs text-gray-500">{t("fastestEver")}</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="absolute -right-4 bottom-1/3 rounded-2xl bg-white/90 px-4 py-3 shadow-xl backdrop-blur-sm sm:right-0 lg:-right-8"
          >
            <p className="text-xs font-semibold text-gray-900">48MP Camera</p>
            <p className="text-xs text-gray-500">Pro-level photos</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
