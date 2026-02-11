import { getProductsFromDB } from "@/data/products-server";
import ProductsContent from "./ProductsContent";
import { Suspense } from "react";
import type { ProductWithVariant } from "@/data/products";

export default async function ProductsPage() {
  const products = getProductsFromDB();

  const sorted = [...products].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

  const items: ProductWithVariant[] = sorted.flatMap((product) =>
    product.variants.map((variant) => ({ product, variant }))
  );

  return (
    <Suspense>
      <ProductsContent items={items} />
    </Suspense>
  );
}
