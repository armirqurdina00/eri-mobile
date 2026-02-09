import en from "./messages/en.json";
import sq from "./messages/sq.json";

export const locales = ["en", "sq"] as const;
export type Locale = (typeof locales)[number];

const messages: Record<Locale, typeof en> = { en, sq };

export function getMessages(locale: Locale) {
  return messages[locale];
}

export function getLocaleFromCookie(): Locale {
  if (typeof document === "undefined") return "sq";
  const match = document.cookie.match(/(?:^|; )locale=(\w+)/);
  return match && locales.includes(match[1] as Locale)
    ? (match[1] as Locale)
    : "sq";
}

export function setLocaleCookie(locale: Locale) {
  document.cookie = `locale=${locale};path=/;max-age=${60 * 60 * 24 * 365}`;
}
