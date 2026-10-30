"use server";

import { revalidatePath } from "next/cache";
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder, getProducts } from "@/lib/db";
import type { Order, OrderStatus } from "@/types/admin";

export async function getOrdersAction() {
  return await getOrders();
}

export async function getOrderAction(id: string) {
  return (await getOrderById(id)) || null;
}

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  const updated = await updateOrder(id, { status });
  if (!updated) {
    return { error: "Order not found" };
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteOrderAction(id: string) {
  const deleted = await deleteOrder(id);
  if (!deleted) {
    return { error: "Order not found" };
  }
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true };
}

export type PlaceOrderInput = {
  items: { productId: string; color: string; storage: string; quantity: number }[];
  customer: Order["customer"];
};

export type PlaceOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: "invalid" | "changed" };

/**
 * Prices and stock are looked up here rather than trusted from the browser,
 * so a stale or edited cart can't place an order at the wrong price.
 */
export async function placeOrderAction(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const c = input.customer;
  const required = [c.firstName, c.lastName, c.phone, c.email, c.address, c.city];
  if (!input.items.length || required.some((v) => !v?.trim())) {
    return { success: false, error: "invalid" };
  }

  const products = await getProducts();
  const items: Order["items"] = [];
  for (const line of input.items) {
    const product = products.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.color === line.color && v.storage === line.storage);
    const quantity = Math.floor(line.quantity);
    if (!product || !variant || !variant.inStock || variant.stock < quantity || quantity < 1) {
      return { success: false, error: "changed" };
    }
    items.push({
      productId: product.id,
      productName: product.name,
      price: variant.price,
      quantity,
      selectedColor: variant.color,
      selectedStorage: variant.storage,
      image: variant.image || product.image,
    });
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const order = await createOrder({
    items,
    customer: {
      firstName: c.firstName.trim(),
      lastName: c.lastName.trim(),
      phone: c.phone?.trim(),
      email: c.email.trim(),
      address: c.address.trim(),
      city: c.city.trim(),
      state: c.state?.trim() ?? "",
      zipCode: c.zipCode?.trim() ?? "",
    },
    status: "pending",
    subtotal,
    shipping: 0,
    tax: 0,
    total: subtotal,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { success: true, orderId: order.id };
}
