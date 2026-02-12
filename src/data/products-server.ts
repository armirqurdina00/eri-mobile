import type { Product } from "@/data/products";
import { getProducts } from "@/lib/db";

export async function getProductsFromDB(): Promise<Product[]> {
  const dbProducts = await getProducts();

  return dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    image: p.image,
    badge: p.badge,
    rating: p.rating,
    reviews: p.reviews,
    specs: p.specs,
    description: p.description,
    category: p.category,
    variants: p.variants,
    createdAt: p.createdAt,
  }));
}
