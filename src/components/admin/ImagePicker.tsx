"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Loader2, X, Check } from "lucide-react";
import Image from "next/image";
import type { ImageResult } from "@/app/api/images/search/route";

interface ImagePickerProps {
  defaultQuery: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function ImagePicker({ defaultQuery, onSelect, onClose }: ImagePickerProps) {
  const [query, setQuery] = useState(defaultQuery);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function search(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`/api/images/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  // Auto-search on mount
  useEffect(() => {
    search(defaultQuery);
    inputRef.current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleConfirm() {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Search Images
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 border-b border-gray-100 p-3 dark:border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search(query)}
            placeholder="Search for an image…"
            className="w-full rounded-lg border border-gray-200 py-2 pl-8 pr-3 text-xs outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button
          type="button"
          onClick={() => search(query)}
          disabled={loading}
          className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Search"}
        </button>
      </div>

      {/* Results grid */}
      <div className="p-3">
        {loading && (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {!loading && results.length === 0 && (
          <p className="py-6 text-center text-xs text-gray-400">
            No results — try a different search term
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {results.map((img) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setSelected(img.url === selected ? null : img.url)}
                className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                  selected === img.url
                    ? "border-blue-500 shadow-md shadow-blue-500/20"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={img.thumbnail}
                  alt={img.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {selected === img.url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                    <div className="rounded-full bg-blue-500 p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-[10px] text-white">{img.source}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2 dark:bg-blue-950/30">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <Image src={selected} alt="selected" fill className="object-cover" unoptimized />
              </div>
              <span className="max-w-[200px] truncate text-xs text-blue-700 dark:text-blue-300">
                {selected}
              </span>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Use this image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
