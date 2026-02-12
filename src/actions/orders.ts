"use server";

import { revalidatePath } from "next/cache";
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "@/lib/db";
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

export async function placeOrderAction(orderData: {
  items: Order["items"];
  customer: Order["customer"];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  const order = await createOrder({
    ...orderData,
    status: "pending",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { success: true, orderId: order.id };
}
