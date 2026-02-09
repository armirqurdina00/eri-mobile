"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Eri Mobile Shop"
                width={128}
                height={128}
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              {t("description")}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">{t("shop")}</h3>
            <ul className="mt-4 space-y-3">
              {["iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone Air", "Accessories"].map((item) => (
                <li key={item}>
                  <Link href="/products" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">{t("support")}</h3>
            <ul className="mt-4 space-y-3">
              {[
                { key: "shippingInfo", label: t("shippingInfo") },
                { key: "returns", label: t("returns") },
                { key: "warranty", label: t("warranty") },
                { key: "faq", label: t("faq") },
                { key: "contactUs", label: t("contactUs") },
              ].map((item) => (
                <li key={item.key}>
                  <Link href="/about" className="text-sm text-gray-500 transition-colors hover:text-gray-900">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">{t("contact")}</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" /> hello@erimobile.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4" /> +383 44 123 456
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" /> Gjakovë, Kosovë
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
