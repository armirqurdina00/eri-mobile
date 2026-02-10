"use client";

import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const breadcrumbLabels: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "New Product",
  "/admin/orders": "Orders",
  "/admin/categories": "Categories",
  "/admin/settings": "Settings",
};

export default function AdminHeader({
  onMenuClick,
  userName,
}: {
  onMenuClick: () => void;
  userName?: string;
}) {
  const pathname = usePathname();

  const getBreadcrumb = () => {
    // Handle dynamic routes like /admin/products/[id] or /admin/orders/[id]
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 3 && parts[1] === "products" && parts[2] !== "new") {
      return "Edit Product";
    }
    if (parts.length === 3 && parts[1] === "orders") {
      return "Order Details";
    }
    return breadcrumbLabels[pathname] || "Admin";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-900"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {getBreadcrumb()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-40 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-xs font-bold text-white">
            {userName?.charAt(0).toUpperCase() || "A"}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:inline dark:text-gray-300">
            {userName || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
