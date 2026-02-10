import { getOrderAction } from "@/actions/orders";
import { getCurrentUser } from "@/actions/auth";
import { notFound } from "next/navigation";
import OrderDetailClient from "./OrderDetailClient";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order, user] = await Promise.all([
    getOrderAction(id),
    getCurrentUser(),
  ]);

  if (!order) {
    notFound();
  }

  return <OrderDetailClient order={order} userName={user?.name} />;
}
