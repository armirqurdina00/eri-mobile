"use server";

import { revalidatePath } from "next/cache";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/db";
import type { AdminProduct, ProductVariant } from "@/types/admin";

export async function getProductsAction() {
  return getProducts();
}

export async function getProductAction(id: string) {
  return getProductById(id) || null;
}

export async function createProductAction(formData: FormData) {
  const data = parseProductFormData(formData);

  const existing = getProductById(data.id);
  if (existing) {
    return { error: "A product with this ID already exists" };
  }

  createProduct(data);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function updateProductAction(id: string, formData: FormData) {
  const data = parseProductFormData(formData);

  const updated = updateProduct(id, data);
  if (!updated) {
    return { error: "Product not found" };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/");
  revalidatePath("/deals");
  return { success: true };
}

export async function deleteProductAction(id: string) {
  const deleted = deleteProduct(id);
  if (!deleted) {
    return { error: "Product not found" };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/deals");
  return { success: true };
}

function parseProductFormData(
  formData: FormData
): Omit<AdminProduct, "createdAt" | "updatedAt"> {
  const specsRaw = formData.get("specs") as string;
  const variantsRaw = formData.get("variants") as string;

  let specs: AdminProduct["specs"] = [];
  let variants: ProductVariant[] = [];

  try {
    specs = JSON.parse(specsRaw || "[]");
  } catch {
    specs = [];
  }
  try {
    variants = JSON.parse(variantsRaw || "[]");
  } catch {
    variants = [];
  }

  return {
    id: (formData.get("id") as string) || "",
    name: (formData.get("name") as string) || "",
    subtitle: (formData.get("subtitle") as string) || "",
    image: (formData.get("image") as string) || "",
    badge: (formData.get("badge") as string) || undefined,
    rating: parseFloat(formData.get("rating") as string) || 0,
    reviews: parseInt(formData.get("reviews") as string) || 0,
    specs,
    description: (formData.get("description") as string) || "",
    category: (formData.get("category") as string) || "",
    variants,
  };
}
