import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import PromoBar from "@/components/PromoBar";
import { getProductsFromDB } from "@/data/products-server";

export default async function Home() {
  const products = getProductsFromDB();

  return (
    <>
      <Hero />
      <FeaturedProducts products={products} />
      <Categories />
      <PromoBar />
    </>
  );
}
