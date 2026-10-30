import type { Product, ProductVariant } from "@/data/products";

export type Finish = { color: string; colorHex: string; image: string };

export function finishesOf(product: Product): Finish[] {
  const seen = new Map<string, Finish>();
  for (const v of product.variants) {
    if (!seen.has(v.color)) {
      seen.set(v.color, { color: v.color, colorHex: v.colorHex, image: v.image || product.image });
    }
  }
  return [...seen.values()];
}

export function storagesOf(product: Product): string[] {
  return sortStorage([...new Set(product.variants.map((v) => v.storage).filter(Boolean))]);
}

function storageGB(s: string): number {
  const n = parseFloat(s);
  if (Number.isNaN(n)) return 0;
  return /tb/i.test(s) ? n * 1024 : n;
}

export function sortStorage(list: string[]): string[] {
  return [...list].sort((a, b) => storageGB(a) - storageGB(b));
}

export function findVariant(
  product: Product,
  color?: string | null,
  storage?: string | null
): ProductVariant | undefined {
  return (
    product.variants.find((v) => v.color === color && v.storage === storage) ||
    product.variants.find((v) => v.color === color) ||
    product.variants[0]
  );
}

export function minPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.price));
}

export function isOnSale(product: Product): boolean {
  return product.variants.some((v) => v.originalPrice && v.originalPrice > v.price);
}

export function inStock(v: ProductVariant): boolean {
  return v.inStock && v.stock > 0;
}

export function productHref(product: Product, v?: Pick<ProductVariant, "color" | "storage">) {
  if (!v) return `/products/${product.id}`;
  const q = new URLSearchParams({ color: v.color });
  if (v.storage) q.set("storage", v.storage);
  return `/products/${product.id}?${q}`;
}

export function specValue(product: Product, label: string): string | undefined {
  return product.specs.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value;
}

/** Screen diagonal in inches, parsed from the "Display" spec. */
export function screenSize(product: Product): number | undefined {
  const m = specValue(product, "Display")?.match(/(\d+(?:\.\d+)?)\s*(?:"|”|″|inch|in\b)/i);
  return m ? parseFloat(m[1]) : undefined;
}

/**
 * Formatted by hand rather than with Intl: Node and browsers ship different locale
 * data for sq-AL, which makes server and client render different text.
 */
export function formatNumber(value: number, locale: string) {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, locale === "sq" ? "." : ",");
}

export function formatPrice(value: number, locale: string) {
  const digits = formatNumber(value, locale);
  // Non-breaking space so "1.299 €" never wraps the symbol onto its own line.
  return locale === "sq" ? `${digits}\u00a0€` : `€${digits}`;
}

/** Broad colour family for filtering, derived from the variant's hex. */
export type ColorFamily = "dark" | "light" | "blue" | "green" | "warm" | "pink";
export const colorFamilies: { key: ColorFamily; hex: string }[] = [
  { key: "dark", hex: "#2b2b2e" },
  { key: "light", hex: "#e9e7e2" },
  { key: "blue", hex: "#3c6fb4" },
  { key: "green", hex: "#5d9b84" },
  { key: "warm", hex: "#e2753a" },
  { key: "pink", hex: "#f2b8c6" },
];

export function colorFamily(hex: string): ColorFamily {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (s < 0.18 || d < 0.08) return l < 0.45 ? "dark" : "light";
  if (l < 0.18) return "dark";
  let hue = 0;
  if (max === r) hue = ((g - b) / d) % 6;
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  hue = (hue * 60 + 360) % 360;
  if (hue >= 300 || hue < 15) return l > 0.7 ? "pink" : "warm";
  if (hue < 70) return "warm";
  if (hue < 170) return "green";
  if (hue < 260) return "blue";
  return "pink";
}

/** Free-text search across models and their variants, e.g. "16 pro 256 blue". */
export type SearchHit = { product: Product; variant?: ProductVariant; score: number };

export function searchCatalog(products: Product[], query: string): SearchHit[] {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const hits: SearchHit[] = [];
  for (const product of products) {
    const name = `${product.name} ${product.category}`.toLowerCase();
    let best: SearchHit | null = null;
    for (const v of product.variants) {
      const variantText = `${v.color} ${v.storage}`.toLowerCase();
      let score = 0;
      let variantMatched = false;
      let ok = true;
      for (const t of tokens) {
        const tt = t.replace(/gb$/, "");
        if (name.split(/\s+/).some((w) => w === t)) score += 3;
        else if (name.includes(t)) score += 2;
        else if (variantText.includes(tt)) {
          score += 2;
          variantMatched = true;
        } else {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      if (!best || score > best.score) best = { product, variant: variantMatched ? v : undefined, score };
    }
    if (best) hits.push(best);
  }
  return hits.sort((a, b) => b.score - a.score || minPrice(a.product) - minPrice(b.product));
}
