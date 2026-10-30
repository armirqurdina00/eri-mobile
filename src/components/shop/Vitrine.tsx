"use client";

import Image from "next/image";
import { useCallback, useState, type ReactNode } from "react";

/**
 * A dark stage for a product cut-out. The finish colour shows as light behind the device,
 * so colour comes through without tinting the photo. Until the photo arrives, the stage
 * shimmers and its light breathes; then the device rises into place.
 */
export default function Vitrine({
  src,
  alt,
  sizes,
  glow,
  priority,
  className = "",
  imageClassName = "object-contain p-[12%]",
  children,
}: {
  src: string;
  alt: string;
  sizes: string;
  glow?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
}) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const loaded = loadedSrc === src;

  // A cached image can finish before hydration, when onLoad has already fired; check on mount.
  const ref = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth > 0) setLoadedSrc(src);
    },
    [src]
  );

  return (
    <div className={`case relative overflow-hidden ${loaded ? "" : "skeleton"} ${className}`}>
      {glow && (
        <div
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-[52%] h-[64%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-[background-color,opacity] duration-700 ${
            loaded ? "opacity-40" : "breathe"
          }`}
          style={{ backgroundColor: glow }}
        />
      )}
      {src && (
        <Image
          ref={ref}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setLoadedSrc(src)}
          className={`transition-[opacity,translate,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            loaded ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.96] opacity-0"
          } ${imageClassName}`}
        />
      )}
      {children}
    </div>
  );
}
