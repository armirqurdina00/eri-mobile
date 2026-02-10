import { getProductsFromDB } from "@/data/products-server";
import DealsContent from "./DealsContent";

export default async function DealsPage() {
  const products = getProductsFromDB();
  const deals = products.filter((p) => p.variants.some((v) => v.originalPrice));

  return <DealsContent deals={deals} />;
}
