import { NextRequest, NextResponse } from "next/server";

export interface MobileImageResult {
  url: string;
  thumbnail: string;
  title: string;
  source: string;
}

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (res.status === 429) {
      if (attempt < retries) {
        // Wait 2 seconds then retry
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
    }
    return res;
  }
  throw new Error("Rate limit exceeded after retries");
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json([]);

  const apiKey = process.env.MOBILEAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "MobileAPI key not configured" }, { status: 500 });
  }

  try {
    // Step 1: Search for the device to get its ID
    const searchRes = await fetchWithRetry(
      `https://api.mobileapi.dev/devices/search/?name=${encodeURIComponent(q)}&key=${apiKey}`
    );

    if (!searchRes.ok) {
      const err = await searchRes.json().catch(() => ({}));
      console.error("MobileAPI search error:", searchRes.status, err);
      return NextResponse.json([]);
    }

    const searchData = await searchRes.json();
    const devices: Array<{ id: number; name: string; image_url?: string }> = Array.isArray(searchData)
      ? searchData
      : searchData.results ?? [];

    if (devices.length === 0) return NextResponse.json([]);

    // Step 2: Fetch images for the best matching device
    const device = devices[0];
    const imagesRes = await fetchWithRetry(
      `https://api.mobileapi.dev/devices/${device.id}/images/?key=${apiKey}`
    );

    if (!imagesRes.ok) {
      // Fall back to the search thumbnail if images endpoint fails
      if (device.image_url) {
        return NextResponse.json([
          {
            url: device.image_url,
            thumbnail: device.image_url,
            title: device.name,
            source: "mobileapi.dev",
          } satisfies MobileImageResult,
        ]);
      }
      return NextResponse.json([]);
    }

    const imagesData = await imagesRes.json();
    // MobileAPI returns { images: string[] } or string[]
    const imageUrls: string[] = Array.isArray(imagesData)
      ? imagesData
      : imagesData.images ?? [];

    const results: MobileImageResult[] = imageUrls
      .filter((url) => typeof url === "string" && url.startsWith("http"))
      .map((url) => ({
        url,
        thumbnail: url,
        title: device.name,
        source: "mobileapi.dev",
      }));

    // Also add the search thumbnail if it's not already included
    if (device.image_url && !imageUrls.includes(device.image_url)) {
      results.unshift({
        url: device.image_url,
        thumbnail: device.image_url,
        title: device.name,
        source: "mobileapi.dev",
      });
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error("MobileAPI error:", err);
    return NextResponse.json({ error: "Image search failed" }, { status: 500 });
  }
}
