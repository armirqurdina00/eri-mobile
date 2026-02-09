"use client";

import { NextIntlClientProvider } from "next-intl";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  type Locale,
  getMessages,
  getLocaleFromCookie,
  setLocaleCookie,
} from "@/i18n";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

export default function LocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    setLocaleState(getLocaleFromCookie());
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleCookie(newLocale);
    setLocaleState(newLocale);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={getMessages(locale)}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
