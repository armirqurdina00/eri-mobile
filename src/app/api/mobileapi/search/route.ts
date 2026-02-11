import { NextRequest, NextResponse } from "next/server";

// Raw shape returned by MobileAPI.dev /devices/search/
interface RawDevice {
  id: number;
  name: string;
  colors?: string;
  storage?: string;
  image_url?: string;
  image_b64?: string;
  hardware?: string;
  camera?: string;
  battery_capacity?: string;
  screen_resolution?: string;
  weight?: string;
  thickness?: string;
  release_date?: string;
  ram?: string;
  os?: string;
}

const COLOR_HEX: Record<string, string> = {
  Black: "#1C1C1E",
  White: "#F5F5F0",
  Silver: "#C7C7CC",
  "Desert Sand": "#D4B896",
  "Sky Blue": "#7BC6E0",
  "Rose Gold": "#E8C4B8",
  "Glacier Blue": "#A8C8D8",
  "Space Black": "#302F2F",
  Titanium: "#8E8E8E",
  "Black Titanium": "#3B3B3B",
  "White Titanium": "#E8E8E0",
  "Natural Titanium": "#B8B8B0",
  "Desert Titanium": "#C4AB8A",
  "Titanium Gray": "#7A7A7A",
  "Gold Titanium": "#C8A96E",
  Gold: "#FFD700",
  "Midnight": "#1A1A2E",
  "Starlight": "#E8E4D8",
  "Product Red": "#CC0000",
  Blue: "#1E6FBF",
  Green: "#3D7A5C",
  Purple: "#6B4C7A",
  Pink: "#E8A0BF",
  Yellow: "#F5C518",
  "Space Gray": "#4A4A4A",
  Graphite: "#4A4A4A",
  "Pacific Blue": "#2A6E8C",
  "Alpine Green": "#4A6741",
  "Sierra Blue": "#5C8FA8",
  "Deep Purple": "#3C2A4A",
  "Midnight Green": "#2D4A3E",
  "Coral": "#FF6B6B",
  "Electric Blue": "#1E90FF",
  "Ultramarine": "#3D5A9A",
  "Teal": "#008080",
};

export interface MobileDevice {
  id: number;
  name: string;
  brand: string;
  subtitle: string;
  category: "Pro" | "Standard" | "Accessories";
  colors: string[];
  storageOptions: string[];
  specs: { label: string; value: string }[];
  variants: {
    color: string;
    colorHex: string;
    image: string;
    storage: string;
    price: number;
    stock: number;
    inStock: boolean;
  }[];
  imageUrl: string;
  releaseDate: string;
  description: string;
}

function inferBrand(name: string): string {
  const known = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Huawei", "Sony", "Nokia", "Motorola", "LG"];
  for (const b of known) {
    if (name.startsWith(b)) return b;
  }
  return name.split(" ")[0];
}

function inferCategory(name: string): "Pro" | "Standard" | "Accessories" {
  return /\b(pro|ultra|max|plus)\b/i.test(name) ? "Pro" : "Standard";
}

function mapDevice(raw: RawDevice): MobileDevice {
  const colors = raw.colors
    ? raw.colors.split(",").map((c) => c.trim()).filter(Boolean)
    : [];
  const storageOptions = raw.storage
    ? raw.storage.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const brand = inferBrand(raw.name);
  const category = inferCategory(raw.name);

  // Build specs from available hardware fields
  const specs: { label: string; value: string }[] = [];
  if (raw.screen_resolution) specs.push({ label: "Display", value: raw.screen_resolution });
  if (raw.hardware) specs.push({ label: "Processor", value: raw.hardware });
  if (raw.ram) specs.push({ label: "RAM", value: raw.ram });
  if (raw.storage) specs.push({ label: "Storage", value: raw.storage.trim() });
  if (raw.os) specs.push({ label: "OS", value: raw.os });
  if (raw.camera) specs.push({ label: "Camera", value: raw.camera });
  if (raw.battery_capacity) specs.push({ label: "Battery", value: raw.battery_capacity });
  if (raw.weight) specs.push({ label: "Weight", value: raw.weight });
  if (raw.thickness) specs.push({ label: "Thickness", value: raw.thickness });

  // Build subtitle from hardware info
  const subtitle = raw.hardware
    ? `${raw.hardware}${raw.battery_capacity ? ` · ${raw.battery_capacity}` : ""}`
    : raw.name;

  // Build description
  const description = [
    `The ${raw.name}`,
    raw.hardware ? `features the ${raw.hardware}` : null,
    raw.screen_resolution ? `and a ${raw.screen_resolution} display` : null,
    raw.camera ? `with a ${raw.camera} camera system` : null,
    raw.battery_capacity ? `and a ${raw.battery_capacity} battery` : null,
  ]
    .filter(Boolean)
    .join(", ")
    .replace(/,$/, ".") + ".";

  // Build variants (color × storage)
  const variants: MobileDevice["variants"] = [];
  const colorList = colors.length > 0 ? colors : [""];
  const storageList = storageOptions.length > 0 ? storageOptions : [""];
  const defaultImage = raw.image_url ?? "";
  for (const color of colorList) {
    for (const storage of storageList) {
      variants.push({
        color,
        colorHex: COLOR_HEX[color] ?? "#888888",
        image: defaultImage,
        storage,
        price: 0,
        stock: 0,
        inStock: false,
      });
    }
  }

  return {
    id: raw.id,
    name: raw.name,
    brand,
    subtitle,
    category,
    colors,
    storageOptions,
    specs,
    variants,
    imageUrl: raw.image_url ?? "",
    releaseDate: raw.release_date ?? "",
    description,
  };
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json([]);

  const apiKey = process.env.MOBILEAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "MobileAPI key not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.mobileapi.dev/devices/search/?name=${encodeURIComponent(q)}&key=${apiKey}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      console.error("MobileAPI search failed:", res.status);
      return NextResponse.json([]);
    }

    const data = await res.json();
    const raw: RawDevice[] = Array.isArray(data) ? data : data.devices ?? [];
    const results = raw.slice(0, 8).map(mapDevice);
    return NextResponse.json(results);
  } catch (err) {
    console.error("MobileAPI search error:", err);
    return NextResponse.json([]);
  }
}
