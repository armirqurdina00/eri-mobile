import { getProductsAction } from "@/actions/products";
import { getCurrentUser } from "@/actions/auth";
import ProductsListClient from "./ProductsListClient";

export default async function AdminProductsPage() {
  const [products, user] = await Promise.all([
    getProductsAction(),
    getCurrentUser(),
  ]);

  const sorted = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <ProductsListClient products={sorted} userName={user?.name} />;
}
