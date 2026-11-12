"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useListbox } from "../useListbox";

export type DropdownOption<T extends string> = { value: T; label: string; hint?: ReactNode };

/** An accessible single-select listbox with keyboard support and an animated panel. */
export default function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
  placeholder,
  renderButton,
  align = "left",
  className = "",
  buttonClassName = "",
}: {
  /** Pass `undefined` for "nothing chosen" to show the placeholder. */
  value: T | undefined;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  label: string;
  placeholder?: string;
  renderButton?: (selected: DropdownOption<T> | undefined) => ReactNode;
  align?: "left" | "right";
  className?: string;
  buttonClassName?: string;
}) {
  const { open, active, setActive, root, button, id, toggle, choose, onKeyDown } = useListbox({ value, options, onChange });
  const selected = options.find((o) => o.value === value);

  return (
    <div ref={root} className={`relative ${className}`} onKeyDown={onKeyDown}>
      <button
        ref={button}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={label}
        onClick={toggle}
        className={`inline-flex h-11 w-full items-center justify-between gap-2 rounded-full border border-edge bg-panel px-4 text-[15px] font-medium transition-colors hover:border-white/25 ${buttonClassName}`}
      >
        {renderButton ? (
          renderButton(selected)
        ) : (
          <span className={`truncate ${selected ? "" : "text-dim"}`}>{selected?.label ?? placeholder}</span>
        )}
        <ChevronDown className={`h-4 w-4 shrink-0 text-dim transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            aria-activedescendant={`${id}-${active}`}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: align === "right" ? "top right" : "top left" }}
            className={`absolute z-50 mt-2 max-h-[min(20rem,60vh)] min-w-full max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain rounded-2xl border border-edge bg-raise/[0.97] p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {options.map((o, i) => {
              const isSelected = o.value === value;
              return (
                <li
                  key={o.value}
                  id={`${id}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerMove={() => setActive(i)}
                  onClick={() => choose(o.value)}
                  className="relative flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-[15px]"
                >
                  {i === active && (
                    <motion.span
                      layoutId={`${id}-hover`}
                      className="absolute inset-0 rounded-xl bg-white/[0.08]"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative flex-1 truncate">{o.label}</span>
                  {o.hint && <span className="relative text-sm text-dim">{o.hint}</span>}
                  <Check className={`relative h-4 w-4 shrink-0 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
