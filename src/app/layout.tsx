import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSlider from "@/components/CartSlider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eri Mobile Shop | Premium iPhones & Accessories",
  description:
    "Your trusted destination for the latest iPhones and Apple accessories. Premium devices, competitive prices, and exceptional service.",
  icons: {
    icon: "/logo_bg.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <CartProvider>
          <Navbar />
          <CartSlider />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
