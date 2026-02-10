import { getProductsAction } from "@/actions/products";
import { getCurrentUser } from "@/actions/auth";
import CategoriesClient from "./CategoriesClient";

export default async function AdminCategoriesPage() {
  const [products, user] = await Promise.all([
    getProductsAction(),
    getCurrentUser(),
  ]);

  return <CategoriesClient products={products} userName={user?.name} />;
}
