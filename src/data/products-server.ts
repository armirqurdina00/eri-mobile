import type { Product } from "@/data/products";
import { products as hardcodedProducts } from "@/data/products";

export function getProductsFromDB(): Product[] {
  try {
    // Dynamic require to read the JSON file at runtime
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(process.cwd(), "data", "products.json");

    if (!fs.existsSync(filePath)) {
      return hardcodedProducts;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const dbProducts = JSON.parse(raw);

    // Map AdminProduct back to Product shape (strip admin-only fields)
    return dbProducts.map(
      (p: Record<string, unknown>): Product => ({
        id: p.id as string,
        name: p.name as string,
        subtitle: p.subtitle as string,
        image: p.image as string,
        badge: p.badge as string | undefined,
        rating: p.rating as number,
        reviews: p.reviews as number,
        specs: p.specs as Product["specs"],
        description: p.description as string,
        category: p.category as string,
        variants: p.variants as Product["variants"],
      })
    );
  } catch {
    return hardcodedProducts;
  }
}
