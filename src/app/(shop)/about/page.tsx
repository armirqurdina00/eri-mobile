import type { Metadata } from "next";
import AboutView from "@/components/shop/AboutView";

export const metadata: Metadata = { title: "Dyqani" };

export default function AboutPage() {
  return <AboutView />;
}
