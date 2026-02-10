"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { deleteProductAction } from "@/actions/products";
import { Plus, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { AdminProduct } from "@/types/admin";

export default function ProductsListClient({
  products,
  userName,
}: {
  products: AdminProduct[];
  userName?: string;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    product?: AdminProduct;
  }>({ open: false });
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteModal.product) return;
    setDeleting(true);
    await deleteProductAction(deleteModal.product.id);
    setDeleting(false);
    setDeleteModal({ open: false });
    router.refresh();
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (p: AdminProduct) => (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
          <Image
            src={p.image}
            alt={p.name}
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
            unoptimized
          />
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (p: AdminProduct) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{p.id}</p>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (p: AdminProduct) => (
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {p.category}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (p: AdminProduct) => {
        const prices = p.variants.map((v) => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return (
          <span className="font-medium">
            {min === max
              ? `€${min.toLocaleString()}`
              : `€${min.toLocaleString()} – €${max.toLocaleString()}`}
          </span>
        );
      },
    },
    {
      key: "variants",
      label: "Variants",
      render: (p: AdminProduct) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {p.variants.length}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (p: AdminProduct) => {
        const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
        return (
          <span
            className={`font-medium ${
              totalStock <= 5
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {totalStock}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (p: AdminProduct) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/products/${p.id}`}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteModal({ open: true, product: p })}
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Products
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {products.length} products total
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </div>

          <DataTable
            data={products}
            columns={columns}
            searchKeys={["name", "category", "id"]}
            onRowClick={(item) =>
              router.push(`/admin/products/${item.id}`)
            }
          />
        </div>
      </div>

      <DeleteConfirmModal
        open={deleteModal.open}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false })}
        loading={deleting}
      />
    </div>
  );
}
