import type { Metadata } from "next";
import CompareView from "@/components/shop/CompareView";

export const metadata: Metadata = { title: "Compare" };

export default function ComparePage() {
  return <CompareView />;
}
