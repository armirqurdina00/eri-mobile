"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option<T extends string> = { value: T; label: string };

/** Open/close, keyboard, type-ahead and outside-click behaviour shared by the custom select components. */
export function useListbox<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T | undefined;
  options: Option<T>[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the keyboard-highlighted option visible in long, scrolling lists.
  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  const openAt = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const toggle = () => (open ? setOpen(false) : openAt());

  const choose = (v: T) => {
    onChange(v);
    setOpen(false);
    button.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openAt();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    } else if (!options.length) {
      return;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === "Enter" || (e.key === " " && !typed.current.text)) {
      e.preventDefault();
      choose(options[active].value);
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      // Type-ahead: jump to the first option starting with what was typed recently.
      e.preventDefault();
      const now = Date.now();
      const text = (now - typed.current.at > 600 ? "" : typed.current.text) + e.key.toLowerCase();
      typed.current = { text, at: now };
      const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(text));
      if (hit >= 0) setActive(hit);
    }
    if (e.key.length !== 1) typed.current.text = "";
  };

  return { open, active, setActive, root, button, id, toggle, choose, onKeyDown };
}
