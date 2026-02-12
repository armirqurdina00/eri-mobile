import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import PromoBar from "@/components/PromoBar";
import { getProductsFromDB } from "@/data/products-server";

export default async function Home() {
  const products = await getProductsFromDB();

  const sorted = [...products].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

  return (
    <>
      <Hero />
      <FeaturedProducts products={sorted} />
      <Categories />
      <PromoBar />
    </>
  );
}
