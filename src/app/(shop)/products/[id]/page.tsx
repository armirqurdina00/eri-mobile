import type { Metadata } from "next";
import { Suspense } from "react";
import { getProductById } from "@/lib/db";
import ProductView from "@/components/shop/product/ProductView";
import ProductMissing from "@/components/shop/product/ProductMissing";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductById((await params).id);
  if (!product) return {};
  const image = product.variants[0]?.image || product.image;
  return {
    title: product.name,
    description: product.subtitle || product.description,
    openGraph: { title: product.name, description: product.subtitle, images: image ? [image] : [] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return <ProductMissing />;

  return (
    <Suspense>
      <ProductView key={product.id} product={product} />
    </Suspense>
  );
}
