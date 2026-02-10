"use client";

import { Plus, Trash2 } from "lucide-react";

interface ColorVariant {
  name: string;
  hex: string;
  image: string;
}

export default function ColorEditor({
  colors,
  onChange,
}: {
  colors: ColorVariant[];
  onChange: (colors: ColorVariant[]) => void;
}) {
  const addColor = () => {
    onChange([...colors, { name: "", hex: "#000000", image: "" }]);
  };

  const removeColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, field: keyof ColorVariant, value: string) => {
    const updated = [...colors];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Color Variants
        </label>
        <button
          type="button"
          onClick={addColor}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
        >
          <Plus className="h-3.5 w-3.5" /> Add Color
        </button>
      </div>

      {colors.map((color, i) => (
        <div
          key={i}
          className="flex gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-800"
        >
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={color.name}
                onChange={(e) => updateColor(i, "name", e.target.value)}
                placeholder="Color name"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => updateColor(i, "hex", e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border border-gray-200 dark:border-gray-700"
                />
                <input
                  type="text"
                  value={color.hex}
                  onChange={(e) => updateColor(i, "hex", e.target.value)}
                  className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <input
              type="text"
              value={color.image}
              onChange={(e) => updateColor(i, "image", e.target.value)}
              placeholder="Image URL"
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <button
            type="button"
            onClick={() => removeColor(i)}
            className="self-start rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {colors.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-600">
          No color variants added yet
        </p>
      )}
    </div>
  );
}
