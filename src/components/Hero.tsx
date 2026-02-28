"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-fit overflow-hidden bg-[#07070C] py-20 sm:py-24 lg:h-[100dvh] lg:py-0">
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-[10%] h-[500px] w-[500px] rounded-full bg-blue-600/[0.12] blur-[120px] sm:h-[700px] sm:w-[700px] sm:blur-[150px]" />
        <div className="absolute bottom-[10%] -left-32 h-[400px] w-[400px] rounded-full bg-violet-700/[0.08] blur-[100px] sm:h-[500px] sm:w-[500px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-indigo-800/[0.10] blur-[80px]" />
      </div>

      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-5 gap-4 sm:px-8 lg:items-start lg:px-10 lg:pt-0">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium text-blue-300 backdrop-blur-md sm:mb-4 sm:text-xs lg:max-w-[50%]"
        >
          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-full w-full rounded-full bg-blue-400" />
          </span>
          {t("badge")}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-[2rem] font-black leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:max-w-[50%] lg:text-left lg:text-[3.5rem] xl:text-7xl"
        >
          {t("titleLine1")}
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            {t("titleLine2")}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-2.5 max-w-xs text-center text-[13px] leading-relaxed text-gray-400 sm:mt-3 sm:max-w-sm sm:text-sm lg:max-w-md lg:text-left lg:text-base"
        >
          {t("description")}
        </motion.p>

        {/* ── iPhone image (in-flow on mobile, absolute on desktop) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative my-4 flex w-full shrink-0 items-center justify-center sm:my-5 lg:absolute lg:right-6 lg:top-1/2 lg:my-0 lg:w-[46%] lg:-translate-y-1/2 xl:right-10"
        >
          {/* Glow */}
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500/25 via-violet-500/10 to-transparent blur-[80px]" />

          {/* Phone */}
          <div className="relative aspect-square w-[50%] max-w-[180px] sm:max-w-[220px] md:max-w-[250px] lg:w-[85%] lg:max-w-[440px] xl:max-w-[500px]">
            <Image
              src="/1-iPhone-17-pro-max-cosmic-orange-front-back.png"
              alt="iPhone 17 Pro Max"
              fill
              className="object-contain drop-shadow-[0_0_60px_rgba(99,102,241,0.12)]"
              priority
            />
          </div>

          {/* Floating badge — Price */}
          {/* <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
            className="absolute bottom-[15%] left-[8%] hidden rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 backdrop-blur-xl sm:block lg:left-0"
          >
            <p className="text-[11px] font-bold text-white sm:text-xs">{t("startingAt")}</p>
            <p className="mt-0.5 text-[10px] text-emerald-400/80">{t("freeShipping")}</p>
          </motion.div> */}

          {/* Floating badge — Rating */}
          {/* <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 1 }}
            className="absolute right-[8%] top-[15%] hidden rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 backdrop-blur-xl sm:block lg:right-0"
          >
            <div className="mb-0.5 flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-2 w-2 fill-amber-400 text-amber-400 sm:h-2.5 sm:w-2.5" />
              ))}
            </div>
            <p className="text-[10px] text-gray-400">{t("reviewsLabel")}</p>
          </motion.div> */}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="flex w-full max-w-xs flex-col gap-2.5 sm:w-auto sm:max-w-none sm:flex-row sm:gap-3 lg:max-w-[50%]"
        >
          <Link
            href="/products"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-blue-500/40 sm:px-8 sm:py-3"
          >
            {t("shopNow")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.08] sm:px-8 sm:py-3"
          >
            {t("viewAllModels")}
          </Link>
        </motion.div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:mt-5 lg:max-w-[50%] lg:justify-start"
        >
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400 sm:h-3 sm:w-3" />
              ))}
            </div>
            <span className="text-[11px] font-medium text-gray-400 sm:text-xs">4.9/5</span>
          </div>
          <span className="h-3 w-px bg-white/10" />
          <span className="text-[11px] text-gray-500 sm:text-xs">{t("trustedCustomers")}</span>
          <span className="hidden h-3 w-px bg-white/10 sm:inline" />
          <span className="hidden text-[11px] text-gray-500 sm:inline sm:text-xs">{t("freeShipping")}</span>
        </motion.div>
      </div>
    </section>
  );
}
