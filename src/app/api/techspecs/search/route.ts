import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const CACHE_PATH = join(process.cwd(), "..", "data", "techspecs-phones.json");

function loadCache() {
  try {
    return JSON.parse(readFileSync(CACHE_PATH, "utf-8")) as TechspecsPhone[];
  } catch {
    return [];
  }
}

export interface TechspecsPhone {
  techspecsId: string;
  brand: string;
  name: string;
  subtitle: string;
  category: string;
  badge: string;
  rating: number;
  reviews: number;
  description: string;
  specs: { label: string; value: string }[];
  colors: string[];
  storageOptions: string[];
  variants: {
    color: string;
    colorHex: string;
    image: string;
    storage: string;
    price: number;
    stock: number;
    inStock: boolean;
  }[];
  releaseDate: string;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";

  if (!q) return NextResponse.json([]);

  const cache = loadCache();
  const results = cache.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
  );

  return NextResponse.json(results.slice(0, 8));
}
