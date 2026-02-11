import { NextRequest, NextResponse } from "next/server";

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
  Midnight: "#1A1A2E",
  Starlight: "#E8E4D8",
  "Product Red": "#CC0000",
  Blue: "#1E6FBF",
  "Blue Titanium": "#4A6A8A",
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
  Coral: "#FF6B6B",
  "Electric Blue": "#1E90FF",
  Ultramarine: "#3D5A9A",
  Teal: "#008080",
  "Cosmic Orange": "#E8602A",
  "Deep Blue": "#1B3A6B",
};

interface RawDeviceDetail {
  id: number;
  name: string;
  brand?: { id: number; name: string };
  main_image_b64?: string;
  screen_resolution?: string;
  camera?: string;
  hardware?: string;
  battery_capacity?: string;
  storage?: string;
  weight?: string;
  thickness?: string;
  release_date?: string;
  colors?: string;
  ram?: string;
  os?: string;
  image_url?: string;
}

export interface MobileDeviceDetail {
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

function inferCategory(name: string): "Pro" | "Standard" | "Accessories" {
  return /\b(pro|ultra|max|plus)\b/i.test(name) ? "Pro" : "Standard";
}

function mapDetail(raw: RawDeviceDetail): MobileDeviceDetail {
  const colors = raw.colors
    ? raw.colors.split(",").map((c) => c.trim()).filter(Boolean)
    : [];
  const storageOptions = raw.storage
    ? raw.storage.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const brand = raw.brand?.name ?? raw.name.split(" ")[0];
  const category = inferCategory(raw.name);

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

  const subtitle = raw.hardware
    ? `${raw.hardware}${raw.battery_capacity ? ` · ${raw.battery_capacity}` : ""}`
    : raw.name;

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

  // Use base64 image as data URL if available
  const imageUrl = raw.main_image_b64
    ? `data:image/png;base64,${raw.main_image_b64}`
    : raw.image_url ?? "";

  const variants: MobileDeviceDetail["variants"] = [];
  const colorList = colors.length > 0 ? colors : [""];
  const storageList = storageOptions.length > 0 ? storageOptions : [""];
  for (const color of colorList) {
    for (const storage of storageList) {
      variants.push({
        color,
        colorHex: COLOR_HEX[color] ?? "#888888",
        image: "",
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
    imageUrl,
    releaseDate: raw.release_date ?? "",
    description,
  };
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  const apiKey = process.env.MOBILEAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "MobileAPI key not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.mobileapi.dev/devices/${id}/?key=${apiKey}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      console.error("MobileAPI device fetch failed:", res.status);
      return NextResponse.json({ error: "Device not found" }, { status: res.status });
    }

    const raw: RawDeviceDetail = await res.json();
    return NextResponse.json(mapDetail(raw));
  } catch (err) {
    console.error("MobileAPI device error:", err);
    return NextResponse.json({ error: "Failed to fetch device" }, { status: 500 });
  }
}
