"use client";

import { useState, useMemo } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { FolderOpen, Package } from "lucide-react";
import Link from "next/link";
import type { AdminProduct } from "@/types/admin";
import { motion } from "framer-motion";

export default function CategoriesClient({
  products,
  userName,
}: {
  products: AdminProduct[];
  userName?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = useMemo(() => {
    const map = new Map<
      string,
      { count: number; totalStock: number; avgPrice: number }
    >();
    products.forEach((p) => {
      const existing = map.get(p.category) || {
        count: 0,
        totalStock: 0,
        avgPrice: 0,
      };
      existing.count++;
      existing.totalStock += p.variants.reduce((s, v) => s + v.stock, 0);
      const minPrice = Math.min(...p.variants.map((v) => v.price));
      existing.avgPrice =
        (existing.avgPrice * (existing.count - 1) + minPrice) / existing.count;
      map.set(p.category, existing);
    });
    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
        />

        <div className="p-4 lg:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Categories
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {categories.length} categories derived from products
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
                    <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cat.count} products
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Stock
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {cat.totalStock}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Avg. Price
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      €{Math.round(cat.avgPrice).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/admin/products?category=${cat.name}`}
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Package className="h-3.5 w-3.5" /> View Products
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
