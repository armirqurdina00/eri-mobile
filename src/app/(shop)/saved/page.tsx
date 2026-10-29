import type { Metadata } from "next";
import SavedView from "@/components/shop/SavedView";

export const metadata: Metadata = { title: "Saved" };

export default function SavedPage() {
  return <SavedView />;
}
