import type { Metadata } from "next";
import ThemeProvider from "@/components/admin/ThemeProvider";

export const metadata: Metadata = {
  title: "Admin Panel | Eri Mobile Shop",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
