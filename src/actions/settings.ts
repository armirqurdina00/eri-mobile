"use server";

import { revalidatePath } from "next/cache";
import { getStoreSettings, updateStoreSettings } from "@/lib/db";
import type { StoreSettings } from "@/types/admin";

export async function getSettingsAction(): Promise<StoreSettings> {
  return getStoreSettings();
}

export async function updateSettingsAction(formData: FormData) {
  const updates: Partial<StoreSettings> = {
    storeName: (formData.get("storeName") as string) || undefined,
    storeEmail: (formData.get("storeEmail") as string) || undefined,
    storePhone: (formData.get("storePhone") as string) || undefined,
    storeAddress: (formData.get("storeAddress") as string) || undefined,
    currency: (formData.get("currency") as string) || undefined,
    taxRate: parseFloat(formData.get("taxRate") as string) || undefined,
    freeShippingThreshold:
      parseFloat(formData.get("freeShippingThreshold") as string) ?? undefined,
  };

  // Remove undefined values
  Object.keys(updates).forEach((key) => {
    if (updates[key as keyof StoreSettings] === undefined) {
      delete updates[key as keyof StoreSettings];
    }
  });

  updateStoreSettings(updates);
  revalidatePath("/admin/settings");
  return { success: true };
}
