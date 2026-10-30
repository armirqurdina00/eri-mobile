"use client";

import { NextIntlClientProvider } from "next-intl";
import { createContext, useContext, useState, useCallback } from "react";
import { type Locale, getMessages, setLocaleCookie } from "@/i18n";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: "sq",
  setLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

export default function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleCookie(newLocale);
    document.documentElement.lang = newLocale;
    setLocaleState(newLocale);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={getMessages(locale)} timeZone="Europe/Belgrade">
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
