"use server";

import { getProducts, getOrders } from "@/lib/db";
import type { DashboardStats, OrderStatus } from "@/types/admin";

export async function getDashboardStats(): Promise<DashboardStats> {
  const products = await getProducts();
  const orders = await getOrders();

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockProducts = products.filter((p) => {
    const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
    return totalStock > 0 && totalStock <= 5;
  }).length;

  const ordersByStatus: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orders.forEach((o) => {
    ordersByStatus[o.status]++;
  });

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    lowStockProducts,
    recentOrders: orders.slice(0, 5),
    ordersByStatus,
  };
}
