"use client";

import { useState } from "react";
import { Plus, Trash2, Cpu, Monitor, HardDrive, MemoryStick, Smartphone, BatteryMedium, Weight, Camera, Ruler, RotateCcw } from "lucide-react";

interface Spec {
  label: string;
  value: string;
}

const DEFAULT_SPECS: { label: string; placeholder: string; icon: typeof Cpu }[] = [
  { label: "Display", placeholder: '6.7" Super Retina XDR OLED, 2796x1290', icon: Monitor },
  { label: "Processor", placeholder: "A18 Pro / Snapdragon 8 Gen 3", icon: Cpu },
  { label: "RAM", placeholder: "8 GB", icon: MemoryStick },
  { label: "Storage", placeholder: "128 GB, 256 GB, 512 GB, 1 TB", icon: HardDrive },
  { label: "OS", placeholder: "iOS 18 / Android 15", icon: Smartphone },
  { label: "Camera", placeholder: "48 MP + 12 MP + 12 MP", icon: Camera },
  { label: "Battery", placeholder: "4685 mAh", icon: BatteryMedium },
  { label: "Weight", placeholder: "187 g", icon: Weight },
  { label: "Dimensions", placeholder: "159.9 x 76.7 x 8.25 mm", icon: Ruler },
];

export default function SpecEditor({
  specs,
  onChange,
}: {
  specs: Spec[];
  onChange: (specs: Spec[]) => void;
}) {
  const [hiddenDefaults, setHiddenDefaults] = useState<Set<string>>(new Set());

  // Merge default specs with current specs — keep order of defaults, preserve values
  const specMap = new Map(specs.map((s) => [s.label, s.value]));
  const visibleDefaults = DEFAULT_SPECS.filter((d) => !hiddenDefaults.has(d.label));
  const defaultLabels = new Set(DEFAULT_SPECS.map((d) => d.label));
  const customSpecs = specs.filter((s) => !defaultLabels.has(s.label));

  function updateByLabel(label: string, value: string) {
    const exists = specs.find((s) => s.label === label);
    if (exists) {
      onChange(specs.map((s) => (s.label === label ? { ...s, value } : s)));
    } else {
      onChange([...specs, { label, value }]);
    }
  }

  function removeByLabel(label: string) {
    onChange(specs.filter((s) => s.label !== label));
  }

  function addCustom() {
    onChange([...specs, { label: "", value: "" }]);
  }

  function updateCustom(index: number, field: keyof Spec, value: string) {
    // index is relative to customSpecs
    const customIndex = specs.findIndex((s) => s === customSpecs[index]);
    if (customIndex === -1) return;
    const updated = [...specs];
    updated[customIndex] = { ...updated[customIndex], [field]: value };
    onChange(updated);
  }

  function removeCustom(index: number) {
    const customIndex = specs.findIndex((s) => s === customSpecs[index]);
    if (customIndex === -1) return;
    onChange(specs.filter((_, i) => i !== customIndex));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          Specifications
        </label>
        <button
          type="button"
          onClick={addCustom}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
        >
          <Plus className="h-3.5 w-3.5" /> Add Custom
        </button>
      </div>

      {/* Default specs */}
      <div className="space-y-2">
        {visibleDefaults.map((def) => {
          const Icon = def.icon;
          const value = specMap.get(def.label) ?? "";
          return (
            <div key={def.label} className="flex items-center gap-2">
              <div className="flex w-28 shrink-0 items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {def.label}
                </span>
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => updateByLabel(def.label, e.target.value)}
                placeholder={def.placeholder}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => {
                  removeByLabel(def.label);
                  setHiddenDefaults((prev) => new Set([...prev, def.label]));
                }}
                className="shrink-0 rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-600 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom specs */}
      {customSpecs.length > 0 && (
        <div className="space-y-2 border-t border-gray-100 pt-3 dark:border-gray-800">
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Custom Specs
          </p>
          {customSpecs.map((spec, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => updateCustom(i, "label", e.target.value)}
                placeholder="Label"
                className="w-28 shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium outline-none transition-colors placeholder:text-gray-300 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-600"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateCustom(i, "value", e.target.value)}
                placeholder="Value"
                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-300 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => removeCustom(i)}
                className="shrink-0 rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-600 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Restore removed defaults */}
      {hiddenDefaults.size > 0 && (
        <button
          type="button"
          onClick={() => setHiddenDefaults(new Set())}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
        >
          <RotateCcw className="h-3 w-3" />
          Restore {hiddenDefaults.size} removed spec{hiddenDefaults.size !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
