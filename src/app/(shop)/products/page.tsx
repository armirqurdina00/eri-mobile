import type { Metadata } from "next";
import { Suspense } from "react";
import ShopView from "@/components/shop/catalog/ShopView";

export const metadata: Metadata = { title: "iPhone" };

export default function ProductsPage() {
  return (
    <Suspense>
      <ShopView />
    </Suspense>
  );
}
