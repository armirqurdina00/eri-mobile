import { NextRequest, NextResponse } from "next/server";

export interface ImageResult {
  url: string;
  thumbnail: string;
  title: string;
  source: string;
  width: number;
  height: number;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json([]);

  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Image search not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    engine: "google_images",
    q: `${q} site:bestbuy.com`,
    num: "6",
    safe: "active",
  });

  try {
    const res = await fetch(
      `https://serpapi.com/search.json?${params}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();

    if (!res.ok || !data.images_results) {
      console.error("SerpApi error:", JSON.stringify(data?.error ?? data));
      return NextResponse.json({ error: data?.error ?? "No results" }, { status: res.ok ? 200 : res.status });
    }

    const results: ImageResult[] = data.images_results.slice(0, 6).map(
      (item: {
        original: string;
        thumbnail: string;
        title: string;
        source: string;
        original_width: number;
        original_height: number;
      }) => ({
        url: item.original,
        thumbnail: item.thumbnail,
        title: item.title,
        source: item.source,
        width: item.original_width,
        height: item.original_height,
      })
    );

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
