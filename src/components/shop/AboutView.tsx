"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useShop } from "./ShopProvider";

export default function AboutView() {
  const t = useTranslations("About");
  const { settings } = useShop();

  const contact = [
    { icon: MapPin, label: t("visit"), value: settings.storeAddress, href: `https://maps.google.com/?q=${encodeURIComponent(`${settings.storeName}, ${settings.storeAddress}`)}` },
    { icon: Phone, label: t("call"), value: settings.storePhone, href: `tel:${settings.storePhone.replace(/\s/g, "")}` },
    { icon: Mail, label: t("write"), value: settings.storeEmail, href: `mailto:${settings.storeEmail}` },
  ];
  const promises = [
    { title: t("original"), desc: t("originalDesc") },
    { title: t("fast"), desc: t("fastDesc") },
    { title: t("returns"), desc: t("returnsDesc") },
    { title: t("warranty"), desc: t("warrantyDesc") },
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:pt-16">
      <h1 className="font-semibold leading-none max-w-5xl text-[clamp(2.75rem,8vw,7rem)]">{t("title")}</h1>
      <p className="mt-6 max-w-2xl text-xl leading-relaxed">{t("body")}</p>

      <ul className="mt-14 grid gap-3 md:grid-cols-3">
        {contact.map(({ icon: Icon, label, value, href }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex h-full flex-col gap-6 rounded-[28px] bg-panel p-6 transition-colors hover:bg-raise"
            >
              <Icon className="h-6 w-6" strokeWidth={1.75} />
              <span>
                <span className="block text-[15px] opacity-60">{label}</span>
                <span className="mt-1 block text-xl font-semibold">{value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <section className="mt-24">
        <h2 className="font-semibold text-3xl sm:text-4xl">{t("promisesTitle")}</h2>
        <dl className="mt-8 grid gap-x-10 gap-y-8 border-t border-edge pt-8 sm:grid-cols-2">
          {promises.map((p) => (
            <div key={p.title}>
              <dt className="text-lg font-semibold">{p.title}</dt>
              <dd className="mt-1 max-w-md text-dim">{p.desc}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
