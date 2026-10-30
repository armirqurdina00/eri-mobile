"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * Shown while the catalogue streams in on a first visit. All motion is CSS, so it
 * animates as soon as the HTML arrives, before any JavaScript has loaded.
 */
export default function BrandLoader() {
  const t = useTranslations("Loading");

  return (
    <div role="status" aria-live="polite" className="fixed inset-0 z-[60] flex items-center justify-center bg-night">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_center,black_10%,transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(232_37_46/0.18),transparent_45%)]"
      />
      <div className="loader-in relative flex flex-col items-center">
        <div className="relative flex h-60 w-60 items-center justify-center sm:h-72 sm:w-72">
          <div aria-hidden className="loader-glow absolute inset-10 rounded-full bg-brand/50 blur-[60px]" />
          {/* A blurred twin of the ring makes it glow. The blur sits on a wrapper because
              CSS applies an element's own filter before its mask. */}
          <div aria-hidden className="absolute inset-0 opacity-90 blur-md">
            <div className="loader-ring h-full w-full rounded-full" />
          </div>
          <div aria-hidden className="loader-ring absolute inset-0 rounded-full" />
          <div aria-hidden className="loader-ring-slow absolute inset-5 rounded-full" />
          <Image src="/logo_white.png" alt="Eri Mobile" width={140} height={140} priority className="relative h-32 w-32 sm:h-36 sm:w-36" />
        </div>
        <div aria-hidden className="mt-12 h-[3px] w-64 overflow-hidden rounded-full bg-white/10">
          <div className="loader-bar h-full w-full origin-left rounded-full bg-gradient-to-r from-transparent via-brand to-transparent shadow-[0_0_12px_2px] shadow-brand/60" />
        </div>
        <p className="mt-5 text-[15px] font-medium tracking-wide text-dim">{t("label")}</p>
      </div>
    </div>
  );
}
