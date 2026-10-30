"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import type { Finish } from "@/lib/catalog";

export default function Swatches({
  finishes,
  value,
  onChange,
  size = "md",
  label,
  className = "",
}: {
  finishes: Finish[];
  value?: string;
  onChange: (color: string) => void;
  size?: "sm" | "md" | "lg";
  label: string;
  className?: string;
}) {
  const id = useId();
  const dims = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-10 w-10" }[size];

  return (
    <div role="radiogroup" aria-label={label} className={`flex flex-wrap items-center gap-1 ${className}`}>
      {finishes.map((f) => {
        const selected = f.color === value;
        return (
          <button
            key={f.color}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={f.color}
            title={f.color}
            onClick={() => onChange(f.color)}
            onPointerEnter={(e) => e.pointerType === "mouse" && size === "sm" && onChange(f.color)}
            className="relative flex items-center justify-center rounded-full p-[3px]"
          >
            {selected && (
              <motion.span
                layoutId={`${id}-ring`}
                className="absolute inset-0 rounded-full ring-[1.5px] ring-fg"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span
              className={`${dims} block rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]`}
              style={{ background: f.colorHex }}
            />
          </button>
        );
      })}
    </div>
  );
}
