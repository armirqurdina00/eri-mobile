import { getProductsFromDB } from "@/data/products-server";
import ProductDetailContent from "./ProductDetailContent";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = getProductsFromDB();
  const product = products.find((p) => p.id === id);

  return <ProductDetailContent product={product} allProducts={products} />;
}
