import { Suspense } from "react";
import { Sora } from "next/font/google";
import { getProductsFromDB } from "@/data/products-server";
import { getStoreSettings } from "@/lib/db";
import { ShopProvider } from "@/components/shop/ShopProvider";
import ShopChrome from "@/components/shop/ShopChrome";
import BrandLoader from "@/components/shop/BrandLoader";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  // The catalogue loads behind a Suspense boundary, so the page shell and the loader
  // stream to the browser straight away instead of waiting on the database.
  return (
    <div className={`${sora.variable} shop min-h-dvh`}>
      <Suspense fallback={<BrandLoader />}>
        <Shop>{children}</Shop>
      </Suspense>
    </div>
  );
}

async function Shop({ children }: { children: React.ReactNode }) {
  const [products, settings] = await Promise.all([getProductsFromDB(), getStoreSettings()]);

  const newestFirst = [...products].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

  return (
    <ShopProvider
      products={newestFirst}
      settings={{
        storeName: settings.storeName,
        storeEmail: settings.storeEmail,
        storePhone: settings.storePhone,
        storeAddress: settings.storeAddress,
      }}
    >
      <ShopChrome>{children}</ShopChrome>
    </ShopProvider>
  );
}
