"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, Smartphone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const isHome = /^\/(en|sq)?$/.test(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          !isHome || scrolled
            ? "bg-white backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.05)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src={!isHome || scrolled ? "/logo.png" : "/logo_white.png"}
                alt="Eri Mobile Shop"
                width={48}
                height={48}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { href: "/", label: t("home") },
                { href: "/products", label: t("products") },
                { href: "/deals", label: t("deals") },
                { href: "/about", label: t("about") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    !isHome || scrolled
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <LanguageSwitcher dark={isHome && !scrolled} />
              </div>

              <button
                className={`hidden md:flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  !isHome || scrolled
                    ? "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  !isHome || scrolled
                    ? "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-[10px] font-bold text-white shadow-lg shadow-blue-500/30"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`flex md:hidden h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  !isHome || scrolled
                    ? "text-gray-500 hover:bg-gray-100"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed inset-x-0 top-16 z-40 border-b duration-500 border-gray-200 ${!isHome || scrolled ? 'bg-white/95' : 'bg-gray-900'} backdrop-blur-xl md:hidden`}
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {[
                { href: "/", label: t("home") },
                { href: "/products", label: t("products") },
                { href: "/deals", label: t("deals") },
                { href: "/about", label: t("about") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-medium  ${!isHome || scrolled ? 'text-gray-700' : 'text-white'} transition-colors hover:bg-gray-100`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Language switcher */}
              <div className="mt-2 px-4">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
