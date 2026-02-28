"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { locale, setLocale } = useLocale();
  const isEN = locale === "en";

  return (
    <div
      className={`flex gap-0.5 rounded-full p-0.5 ring-1 sm:h-9 h-11 w-full sm:w-auto transition-all duration-300 ${
        dark
          ? "ring-white/10"
          : "ring-gray-200"
      }`}
    >
      {/* EN */}
      <button
        onClick={() => setLocale("en")}
        className={`
          relative z-10 flex h-full flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full px-3
          text-xs font-medium transition-all duration-200
          ${isEN
            ? dark
              ? "bg-white/20 text-white shadow-sm ring-1 ring-white/20"
              : "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
            : dark
              ? "text-white/50 opacity-80 hover:text-white/80 active:scale-[0.97]"
              : "text-gray-400 opacity-80 hover:text-gray-500 active:scale-[0.97]"
          }
        `}
      >
        🇬🇧
        <span className="sm:hidden text-sm">English</span>
        <span className="hidden sm:inline">EN</span>
      </button>

      {/* SQ */}
      <button
        onClick={() => setLocale("sq")}
        className={`
          relative z-10 flex h-full flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full px-3
          text-xs font-medium transition-all duration-200
          ${!isEN
            ? dark
              ? "bg-white/20 text-white shadow-sm ring-1 ring-white/20"
              : "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
            : dark
              ? "text-white/50 opacity-80 hover:text-white/80 active:scale-[0.97]"
              : "text-gray-400 opacity-80 hover:text-gray-500 active:scale-[0.97]"
          }
        `}
      >
        🇦🇱
        <span className="sm:hidden text-sm">Shqip</span>
        <span className="hidden sm:inline">SQ</span>
      </button>
    </div>
  );
}
