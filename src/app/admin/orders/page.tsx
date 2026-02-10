import { getOrdersAction } from "@/actions/orders";
import { getCurrentUser } from "@/actions/auth";
import OrdersListClient from "./OrdersListClient";

export default async function AdminOrdersPage() {
  const [orders, user] = await Promise.all([
    getOrdersAction(),
    getCurrentUser(),
  ]);

  return <OrdersListClient orders={orders} userName={user?.name} />;
}
