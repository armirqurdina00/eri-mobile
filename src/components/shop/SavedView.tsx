"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useShop } from "./ShopProvider";
import ModelCard from "./ModelCard";

export default function SavedView() {
  const t = useTranslations("Saved");
  const { saved, getProduct } = useShop();
  const items = saved.flatMap((id) => getProduct(id) ?? []);

  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:pt-16">
      <h1 className="font-semibold leading-none text-[clamp(2.75rem,8vw,6.5rem)]">{t("title")}</h1>
      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-edge px-6 py-20 text-center">
          <p className="text-lg">{t("empty")}</p>
          <Link href="/products" className="rounded-full bg-fg text-night px-6 py-3 text-[15px] font-medium">
            {t("browse")}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
          {items.map((p) => (
            <ModelCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
