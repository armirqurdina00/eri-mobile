import fs from "fs";
import path from "path";
import type {
  AdminProduct,
  Order,
  AdminData,
  StoreSettings,
  AdminUser,
} from "@/types/admin";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Data file not found: ${filename}. Run "npm run seed" first.`);
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJSON<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// --- Products ---

export function getProducts(): AdminProduct[] {
  return readJSON<AdminProduct[]>("products.json");
}

export function getProductById(id: string): AdminProduct | undefined {
  const products = getProducts();
  return products.find((p) => p.id === id);
}

export function createProduct(
  product: Omit<AdminProduct, "createdAt" | "updatedAt">
): AdminProduct {
  const products = getProducts();
  const now = new Date().toISOString();
  const newProduct: AdminProduct = {
    ...product,
    createdAt: now,
    updatedAt: now,
  };
  products.push(newProduct);
  writeJSON("products.json", products);
  return newProduct;
}

export function updateProduct(
  id: string,
  updates: Partial<AdminProduct>
): AdminProduct | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeJSON("products.json", products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  writeJSON("products.json", filtered);
  return true;
}

// --- Orders ---

export function getOrders(): Order[] {
  return readJSON<Order[]>("orders.json");
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  return orders.find((o) => o.id === id);
}

export function createOrder(
  order: Omit<Order, "id" | "createdAt" | "updatedAt">
): Order {
  const orders = getOrders();
  const now = new Date().toISOString();
  const newOrder: Order = {
    ...order,
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    createdAt: now,
    updatedAt: now,
  };
  orders.unshift(newOrder);
  writeJSON("orders.json", orders);
  return newOrder;
}

export function updateOrder(
  id: string,
  updates: Partial<Order>
): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeJSON("orders.json", orders);
  return orders[index];
}

export function deleteOrder(id: string): boolean {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length === orders.length) return false;
  writeJSON("orders.json", filtered);
  return true;
}

// --- Admin ---

export function getAdminData(): AdminData {
  return readJSON<AdminData>("admin.json");
}

export function getAdminUser(email: string): AdminUser | undefined {
  const data = getAdminData();
  return data.users.find((u) => u.email === email);
}

export function getStoreSettings(): StoreSettings {
  const data = getAdminData();
  return data.settings;
}

export function updateStoreSettings(
  updates: Partial<StoreSettings>
): StoreSettings {
  const data = getAdminData();
  data.settings = { ...data.settings, ...updates };
  writeJSON("admin.json", data);
  return data.settings;
}

export function updateAdminUser(
  email: string,
  updates: Partial<AdminUser>
): AdminUser | null {
  const data = getAdminData();
  const index = data.users.findIndex((u) => u.email === email);
  if (index === -1) return null;
  data.users[index] = { ...data.users[index], ...updates };
  writeJSON("admin.json", data);
  return data.users[index];
}
