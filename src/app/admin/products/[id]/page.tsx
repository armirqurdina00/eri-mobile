import { getProductAction } from "@/actions/products";
import { getCurrentUser } from "@/actions/auth";
import { notFound } from "next/navigation";
import EditProductClient from "./EditProductClient";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, user] = await Promise.all([
    getProductAction(id),
    getCurrentUser(),
  ]);

  if (!product) {
    notFound();
  }

  return <EditProductClient product={product} userName={user?.name} />;
}
