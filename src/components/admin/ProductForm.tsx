"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "@/actions/products";
import SpecEditor from "./SpecEditor";
import { Save, Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { AdminProduct, ProductVariant } from "@/types/admin";
import Image from "next/image";

interface ProductFormProps {
  product?: AdminProduct;
  mode: "create" | "edit";
}

const emptyVariant: ProductVariant = {
  color: "",
  colorHex: "#000000",
  image: "",
  storage: "",
  price: 0,
  stock: 0,
  inStock: true,
};

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [specs, setSpecs] = useState(product?.specs || []);
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || [{ ...emptyVariant }]
  );
  const [imagePreview, setImagePreview] = useState(product?.image || "");

  const addVariant = () => {
    // Clone the last variant for convenience
    const last = variants[variants.length - 1];
    setVariants([
      ...variants,
      last
        ? { ...last, storage: "", stock: 0, price: last.price }
        : { ...emptyVariant },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: string | number | boolean
  ) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("specs", JSON.stringify(specs));
    formData.set("variants", JSON.stringify(variants));

    try {
      const result =
        mode === "create"
          ? await createProductAction(formData)
          : await updateProductAction(product!.id, formData);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  // Get unique colors for summary
  const uniqueColors = [
    ...new Map(variants.map((v) => [v.color, v])).values(),
  ];
  const uniqueStorages = [...new Set(variants.map((v) => v.storage).filter(Boolean))];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {mode === "create" ? "Create Product" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product ID
                  </label>
                  <input
                    name="id"
                    defaultValue={product?.id}
                    readOnly={mode === "edit"}
                    required
                    placeholder="e.g. iphone-17-pro"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white read-only:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={product?.category || "Standard"}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Pro">Pro</option>
                    <option value="Standard">Standard</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  name="name"
                  defaultValue={product?.name}
                  required
                  placeholder="iPhone 17 Pro Max"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subtitle
                </label>
                <input
                  name="subtitle"
                  defaultValue={product?.subtitle}
                  required
                  placeholder="The ultimate iPhone."
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={product?.description}
                  required
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Meta
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Badge
                </label>
                <select
                  name="badge"
                  defaultValue={product?.badge || ""}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rating
                </label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  defaultValue={product?.rating ?? 4.5}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reviews
                </label>
                <input
                  name="reviews"
                  type="number"
                  defaultValue={product?.reviews ?? 0}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Variants
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {variants.length} variant{variants.length !== 1 ? "s" : ""} &middot;{" "}
                  {uniqueColors.length} color{uniqueColors.length !== 1 ? "s" : ""} &middot;{" "}
                  {uniqueStorages.length} storage option{uniqueStorages.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50"
              >
                <Plus className="h-3 w-3" /> Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((v, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Variant {i + 1}
                    </span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Color Name
                      </label>
                      <input
                        value={v.color}
                        onChange={(e) =>
                          updateVariant(i, "color", e.target.value)
                        }
                        placeholder="Cosmic Orange"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Color Hex
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="color"
                          value={v.colorHex}
                          onChange={(e) =>
                            updateVariant(i, "colorHex", e.target.value)
                          }
                          className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                        />
                        <input
                          value={v.colorHex}
                          onChange={(e) =>
                            updateVariant(i, "colorHex", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Storage
                      </label>
                      <input
                        value={v.storage}
                        onChange={(e) =>
                          updateVariant(i, "storage", e.target.value)
                        }
                        placeholder="256GB"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Image URL
                      </label>
                      <input
                        value={v.image}
                        onChange={(e) =>
                          updateVariant(i, "image", e.target.value)
                        }
                        placeholder="https://..."
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Price (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={v.price || ""}
                        onChange={(e) =>
                          updateVariant(
                            i,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Original Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={v.originalPrice || ""}
                        onChange={(e) =>
                          updateVariant(
                            i,
                            "originalPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="For sales"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) =>
                          updateVariant(
                            i,
                            "stock",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                        In Stock
                      </label>
                      <select
                        value={v.inStock ? "true" : "false"}
                        onChange={(e) =>
                          updateVariant(
                            i,
                            "inStock",
                            e.target.value === "true"
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <SpecEditor specs={specs} onChange={setSpecs} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Default Image
            </h3>
            <input
              name="image"
              defaultValue={product?.image}
              required
              placeholder="Image URL"
              onChange={(e) => setImagePreview(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {imagePreview && (
              <div className="mt-4 flex justify-center rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="h-48 w-auto object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Variant Summary
            </h3>
            {uniqueColors.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Colors
                </p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {uniqueColors.map((v) => (
                    <div
                      key={v.color}
                      className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1 dark:bg-gray-800"
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-gray-200"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300">
                        {v.color || "Unnamed"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {uniqueStorages.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Storage Options
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {uniqueStorages.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Price Range
              </p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">
                {variants.length > 0
                  ? `€${Math.min(...variants.map((v) => v.price)).toLocaleString()} – €${Math.max(...variants.map((v) => v.price)).toLocaleString()}`
                  : "No variants"}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Total Stock
              </p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">
                {variants.reduce((sum, v) => sum + v.stock, 0)} units
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
