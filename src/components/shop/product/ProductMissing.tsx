"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ProductMissing() {
  const t = useTranslations("Product");
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-32 text-center">
      <p className="text-lg">{t("notFound")}</p>
      <Link href="/products" className="rounded-full bg-fg text-night px-6 py-3 text-[15px] font-medium">
        {t("backToShop")}
      </Link>
    </div>
  );
}
