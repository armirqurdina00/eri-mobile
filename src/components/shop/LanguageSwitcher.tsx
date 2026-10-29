"use client";

import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/components/LocaleProvider";
import type { Locale } from "@/i18n";
import Dropdown from "./Dropdown";

export default function LanguageSwitcher() {
  const t = useTranslations("Nav");
  const { locale, setLocale } = useLocale();

  return (
    <Dropdown<Locale>
      value={locale}
      onChange={setLocale}
      label={t("language")}
      align="right"
      options={[
        { value: "sq", label: t("albanian") },
        { value: "en", label: t("english") },
      ]}
      buttonClassName="!h-10 !w-auto !gap-1.5 !border-transparent !bg-transparent !px-3 hover:!bg-white/[0.06]"
      renderButton={() => (
        <span className="flex items-center gap-1.5 text-sm font-semibold uppercase">
          <Globe className="h-4 w-4" />
          {locale}
        </span>
      )}
    />
  );
}
