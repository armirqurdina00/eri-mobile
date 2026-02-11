"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Loader2, Smartphone, X } from "lucide-react";
import Image from "next/image";
import type { MobileDevice } from "@/app/api/mobileapi/search/route";
import type { MobileDeviceDetail } from "@/app/api/mobileapi/device/route";

interface MobileApiSearchProps {
  onSelect: (device: MobileDeviceDetail) => void;
}

export default function MobileApiSearch({ onSelect }: MobileApiSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MobileDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/mobileapi/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      const list: MobileDevice[] = Array.isArray(data) ? data : [];
      setResults(list);
      setOpen(list.length > 0);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    setSelected(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 350);
  }

  async function handleSelect(device: MobileDevice) {
    setSelected(device.name);
    setQuery("");
    setOpen(false);
    setResults([]);
    setFetching(true);
    try {
      const res = await fetch(`/api/mobileapi/device?id=${device.id}`);
      const detail: MobileDeviceDetail = await res.json();
      onSelect(detail);
    } catch {
      // Fallback: use search data with cleared variant images so SerpApi fills them
      const fallback = {
        ...device,
        variants: device.variants.map((v) => ({ ...v, image: "" })),
      } as unknown as MobileDeviceDetail;
      onSelect(fallback);
    } finally {
      setFetching(false);
    }
  }

  function handleClear() {
    setSelected(null);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
      <div className="mb-3 flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Auto-fill from MobileAPI
        </span>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          Live
        </span>
      </div>
      <p className="mb-3 text-xs text-blue-700 dark:text-blue-400">
        Search any device to auto-populate specs, colors, and storage options.
        You&apos;ll only need to add prices and stock.
      </p>

      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="Search e.g. iPhone 16 Pro, Galaxy S25…"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-10 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {(loading || fetching) && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
          )}
        </div>

        {open && results.length > 0 && (
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
            {results.map((device) => (
              <button
                key={device.id}
                type="button"
                onClick={() => handleSelect(device)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {/* Thumbnail */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  {device.imageUrl ? (
                    <Image
                      src={device.imageUrl}
                      alt={device.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  ) : (
                    <Smartphone className="m-auto h-5 w-5 text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {device.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                    {device.colors.slice(0, 3).join(", ")}
                    {device.colors.length > 3 && ` +${device.colors.length - 3}`}
                    {device.storageOptions.length > 0 && (
                      <> &middot; {device.storageOptions.join(", ")}</>
                    )}
                  </p>
                </div>

                {/* Year badge */}
                {device.releaseDate && (
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {device.releaseDate.slice(0, 4)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 dark:bg-green-950/30">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="flex-1 text-xs font-medium text-green-800 dark:text-green-300">
            {fetching ? "Loading device details…" : `Form populated from: ${selected}`}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-green-600 hover:text-green-800 dark:text-green-400"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
