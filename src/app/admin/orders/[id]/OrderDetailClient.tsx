"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { updateOrderStatusAction } from "@/actions/orders";
import { ArrowLeft, Package, User, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Order, OrderStatus } from "@/types/admin";

const statusFlow: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export default function OrderDetailClient({
  order,
  userName,
}: {
  order: Order;
  userName?: string;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (status: OrderStatus) => {
    setUpdating(true);
    await updateOrderStatusAction(order.id, status);
    setUpdating(false);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
        />

        <div className="p-4 lg:p-6">
          <Link
            href="/admin/orders"
            className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Link>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Order {order.id}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              {/* Items */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Items ({order.items.length})
                  </h3>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          width={40}
                          height={40}
                          className="h-10 w-auto object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.selectedColor}
                          {item.selectedStorage
                            ? ` / ${item.selectedStorage}`
                            : ""}
                          {" × "}
                          {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        €{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      €{order.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Shipping
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {order.shipping === 0
                        ? "Free"
                        : `€${order.shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Tax
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      €{order.tax.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold dark:border-gray-800">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">
                      €{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Update Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {statusFlow.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={updating || order.status === status}
                      className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-all disabled:opacity-50 ${
                        order.status === status
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        status
                      )}
                    </button>
                  ))}
                  <button
                    onClick={() => handleStatusChange("cancelled")}
                    disabled={
                      updating || order.status === "cancelled"
                    }
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                      order.status === "cancelled"
                        ? "bg-red-600 text-white"
                        : "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Info Sidebar */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Customer
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {order.customer.email}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Shipping Address
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>{order.customer.address}</p>
                  <p>
                    {order.customer.city}, {order.customer.state}{" "}
                    {order.customer.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
