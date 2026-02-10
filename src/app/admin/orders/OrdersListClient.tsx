"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { deleteOrderAction } from "@/actions/orders";
import { Trash2, Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import type { Order, OrderStatus } from "@/types/admin";

const statusTabs: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function OrdersListClient({
  orders,
  userName,
}: {
  orders: Order[];
  userName?: string;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    order?: Order;
  }>({ open: false });
  const [deleting, setDeleting] = useState(false);

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const handleDelete = async () => {
    if (!deleteModal.order) return;
    setDeleting(true);
    await deleteOrderAction(deleteModal.order.id);
    setDeleting(false);
    setDeleteModal({ open: false });
    router.refresh();
  };

  const columns = [
    {
      key: "id",
      label: "Order ID",
      sortable: true,
      render: (o: Order) => (
        <span className="font-medium text-gray-900 dark:text-white">{o.id}</span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (o: Order) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {o.customer.firstName} {o.customer.lastName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {o.customer.email}
          </p>
        </div>
      ),
    },
    {
      key: "total",
      label: "Total",
      sortable: true,
      render: (o: Order) => (
        <span className="font-medium">€{o.total.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (o: Order) => <StatusBadge status={o.status} />,
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (o: Order) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(o.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (o: Order) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/orders/${o.id}`}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteModal({ open: true, order: o })}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

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
              Orders
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {orders.length} orders total
            </p>
          </div>

          {/* Status tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            {statusTabs.map((tab) => {
              const count =
                tab.key === "all"
                  ? orders.length
                  : orders.filter((o) => o.status === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    statusFilter === tab.key
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
              <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-700" />
              <p className="mt-3 text-gray-500 dark:text-gray-400">
                No orders yet
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                Orders will appear here when customers place them
              </p>
            </div>
          ) : (
            <DataTable
              data={filtered}
              columns={columns}
              searchKeys={["id"]}
              onRowClick={(item) =>
                router.push(`/admin/orders/${item.id}`)
              }
            />
          )}
        </div>
      </div>

      <DeleteConfirmModal
        open={deleteModal.open}
        title="Delete Order"
        message={`Are you sure you want to delete order "${deleteModal.order?.id}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false })}
        loading={deleting}
      />
    </div>
  );
}
