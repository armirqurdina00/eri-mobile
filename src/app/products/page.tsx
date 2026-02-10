import { getProductsFromDB } from "@/data/products-server";
import ProductsContent from "./ProductsContent";
import { Suspense } from "react";

export default async function ProductsPage() {
  const products = getProductsFromDB();

  return (
    <Suspense>
      <ProductsContent products={products} />
    </Suspense>
  );
}
