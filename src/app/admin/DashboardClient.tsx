"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCard from "@/components/admin/StatsCard";
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import type { DashboardStats, OrderStatus } from "@/types/admin";
import Link from "next/link";
import { motion } from "framer-motion";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function DashboardClient({
  stats,
  userName,
}: {
  stats: DashboardStats;
  userName?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
        />

        <div className="p-4 lg:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package}
              color="blue"
              index={0}
            />
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingCart}
              color="green"
              index={1}
            />
            <StatsCard
              title="Revenue"
              value={`€${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="violet"
              index={2}
            />
            <StatsCard
              title="Low Stock"
              value={stats.lowStockProducts}
              icon={AlertTriangle}
              color={stats.lowStockProducts > 0 ? "orange" : "green"}
              trend={
                stats.lowStockProducts > 0
                  ? "Products need restocking"
                  : "All products well stocked"
              }
              index={3}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>
                <Link
                  href="/admin/orders"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  View all
                </Link>
              </div>

              {stats.recentOrders.length === 0 ? (
                <div className="mt-8 flex flex-col items-center text-center">
                  <ShoppingCart className="h-10 w-10 text-gray-300 dark:text-gray-700" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No orders yet
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {stats.recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          €{order.total.toLocaleString()}
                        </p>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            statusColors[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Order Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Orders by Status
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {Object.entries(stats.ordersByStatus).map(
                  ([status, count]) => {
                    const total = stats.totalOrders || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize text-gray-700 dark:text-gray-300">
                            {status}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
