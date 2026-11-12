"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useListbox } from "../useListbox";

export type SelectOption = { value: string; label: string };

const sizes = {
  md: { button: "rounded-xl px-4 py-2.5 text-sm", panel: "rounded-xl", option: "rounded-lg px-3 py-2 text-sm" },
  sm: { button: "rounded-lg px-3 py-2 text-xs", panel: "rounded-lg", option: "rounded-md px-2.5 py-1.5 text-xs" },
};

/**
 * Dashboard replacement for a native <select>. Works controlled (`value` + `onChange`)
 * or uncontrolled (`defaultValue`); with `name` it submits through a hidden input,
 * so it drops into FormData-based forms unchanged.
 */
export default function Select({
  options,
  label,
  name,
  value,
  defaultValue,
  onChange,
  size = "md",
  className = "",
}: {
  options: SelectOption[];
  label: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value ?? "");
  const current = value ?? inner;
  const s = sizes[size];

  const { open, active, setActive, root, button, id, toggle, choose, onKeyDown } = useListbox({
    value: current,
    options,
    onChange: (v) => {
      setInner(v);
      onChange?.(v);
    },
  });
  const selected = options.find((o) => o.value === current);

  return (
    <div ref={root} className={`relative ${className}`} onKeyDown={onKeyDown}>
      {name && <input type="hidden" name={name} value={current} />}
      <button
        ref={button}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={label}
        onClick={toggle}
        className={`flex w-full items-center justify-between gap-2 border bg-white text-left text-gray-900 outline-none transition-colors hover:border-gray-300 focus-visible:border-blue-500 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:focus-visible:border-blue-500 ${s.button} ${
          open ? "border-blue-500 dark:border-blue-500" : "border-gray-200 dark:border-gray-700"
        }`}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            aria-activedescendant={`${id}-${active}`}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            className={`absolute left-0 z-50 mt-1.5 max-h-64 min-w-full overflow-y-auto overscroll-contain border border-gray-200 bg-white p-1 shadow-lg shadow-gray-900/10 dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/40 ${s.panel}`}
          >
            {options.map((o, i) => {
              const isSelected = o.value === current;
              return (
                <li
                  key={o.value}
                  id={`${id}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerMove={() => setActive(i)}
                  onClick={() => choose(o.value)}
                  className={`flex cursor-pointer items-center justify-between gap-3 whitespace-nowrap ${s.option} ${
                    i === active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } ${isSelected ? "font-medium text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"}`}
                >
                  {o.label}
                  <Check className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
