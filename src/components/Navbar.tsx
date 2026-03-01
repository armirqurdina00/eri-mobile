"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
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
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.05)]"
            : isHome
              ? "bg-transparent"
              : "bg-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo.png"
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
                  className="relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              <button
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
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
                  mobileMenuOpen
                    ? "text-gray-900"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white md:hidden"
          >
            <div className="flex flex-col justify-between h-full pt-20 pb-10 px-6">
              {/* Nav Links */}
              <nav className="flex flex-col gap-1">
                {[
                  { href: "/", label: t("home") },
                  { href: "/products", label: t("products") },
                  { href: "/deals", label: t("deals") },
                  { href: "/about", label: t("about") },
                ].map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-2xl px-4 py-4 text-2xl font-semibold transition-colors ${
                        pathname === link.href ||
                        (link.href !== "/" && pathname.startsWith(link.href))
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-900 active:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div className="h-px bg-gray-100" />
                <LanguageSwitcher />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
