"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useShop } from "./ShopProvider";

export default function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const shop = useTranslations("Shop");
  const { settings } = useShop();
  const link = "text-dim transition-colors hover:text-fg";

  return (
    <footer className="relative mt-32 overflow-hidden border-t border-edge">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand/70 to-transparent" />
      <div className="mx-auto max-w-[1240px] px-4 pb-32 pt-16 sm:px-6 lg:pb-12">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Image src="/logo_white.png" alt="Eri Mobile" width={64} height={64} className="h-16 w-16" />
            <p className="mt-4 max-w-xs text-dim">{t("tagline")}</p>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold">{t("shop")}</h3>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li><Link className={link} href="/products">{shop("all")}</Link></li>
              <li><Link className={link} href="/products?category=Pro">{shop("Pro")}</Link></li>
              <li><Link className={link} href="/products?category=Standard">{shop("Standard")}</Link></li>
              <li><Link className={link} href="/products?sale=1">{shop("onlySale")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold">{t("help")}</h3>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li><Link className={link} href="/#finder">{nav("helpChoose")}</Link></li>
              <li><Link className={link} href="/compare">{nav("compare")}</Link></li>
              <li><Link className={link} href="/saved">{nav("saved")}</Link></li>
              <li><Link className={link} href="/about">{nav("about")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold">{t("store")}</h3>
            <address className="mt-4 space-y-2.5 text-[15px] not-italic">
              <p className="text-dim">{settings.storeAddress}</p>
              <p><a className={link} href={`tel:${settings.storePhone.replace(/\s/g, "")}`}>{settings.storePhone}</a></p>
              <p><a className={link} href={`mailto:${settings.storeEmail}`}>{settings.storeEmail}</a></p>
            </address>
          </div>
        </div>

        <p
          aria-hidden
          className="font-display mt-20 select-none bg-gradient-to-b from-white/[0.14] to-transparent bg-clip-text text-center text-[clamp(4rem,17vw,15rem)] font-semibold leading-[0.8] tracking-[-0.05em] text-transparent"
        >
          Eri Mobile
        </p>

        <p className="mt-6 border-t border-edge pt-6 text-sm text-dim">
          © {new Date().getFullYear()} {settings.storeName}. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
