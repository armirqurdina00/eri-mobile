"use client";

import { Plus, Trash2 } from "lucide-react";

interface Spec {
  label: string;
  value: string;
}

export default function SpecEditor({
  specs,
  onChange,
}: {
  specs: Spec[];
  onChange: (specs: Spec[]) => void;
}) {
  const addSpec = () => {
    onChange([...specs, { label: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    onChange(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: keyof Spec, value: string) => {
    const updated = [...specs];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Specifications
        </label>
        <button
          type="button"
          onClick={addSpec}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
        >
          <Plus className="h-3.5 w-3.5" /> Add Spec
        </button>
      </div>

      {specs.map((spec, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={spec.label}
            onChange={(e) => updateSpec(i, "label", e.target.value)}
            placeholder="Label (e.g. Display)"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            value={spec.value}
            onChange={(e) => updateSpec(i, "value", e.target.value)}
            placeholder="Value (e.g. 6.7&quot; OLED)"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="button"
            onClick={() => removeSpec(i)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {specs.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-600">
          No specifications added yet
        </p>
      )}
    </div>
  );
}
