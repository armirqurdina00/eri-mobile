"use client";

import { Suspense } from "react";
import { MotionConfig } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import SearchPalette from "./SearchPalette";
import CompareTray from "./CompareTray";
import BottomNav from "./BottomNav";
import NavigationProgress from "./NavigationProgress";
import ScrollReset from "./ScrollReset";

export default function ShopChrome({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <ScrollReset />
      <Header />
      <main className="pb-28 lg:pb-0">{children}</main>
      <Footer />
      <CompareTray />
      <BottomNav />
      <CartDrawer />
      <SearchPalette />
    </MotionConfig>
  );
}
