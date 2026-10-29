import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import LocaleProvider from "@/components/LocaleProvider";
import { resolveLocale } from "@/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Eri Mobile | iPhone në Gjakovë",
    template: "%s | Eri Mobile",
  },
  description:
    "Original iPhones and Apple accessories, delivered across Kosovo. Pay in cash on delivery.",
  icons: {
    icon: "/logo_bg.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = resolveLocale((await cookies()).get("locale")?.value);

  return (
    // data-scroll-behavior lets Next.js turn smooth scrolling off during route changes,
    // so a new page starts at the top instead of gliding there and stopping short.
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
