import { sql } from "@vercel/postgres";
import type {
  AdminProduct,
  Order,
  StoreSettings,
  AdminUser,
} from "@/types/admin";

// --- Row-to-object mappers ---

function rowToProduct(row: Record<string, unknown>): AdminProduct {
  return {
    id: row.id as string,
    name: row.name as string,
    subtitle: row.subtitle as string,
    image: row.image as string,
    badge: (row.badge as string) || undefined,
    rating: row.rating as number,
    reviews: row.reviews as number,
    specs: row.specs as AdminProduct["specs"],
    description: row.description as string,
    category: row.category as string,
    variants: row.variants as AdminProduct["variants"],
    createdAt: (row.created_at as Date).toISOString(),
    updatedAt: (row.updated_at as Date).toISOString(),
  };
}

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    items: row.items as Order["items"],
    customer: row.customer as Order["customer"],
    status: row.status as Order["status"],
    subtotal: row.subtotal as number,
    shipping: row.shipping as number,
    tax: row.tax as number,
    total: row.total as number,
    createdAt: (row.created_at as Date).toISOString(),
    updatedAt: (row.updated_at as Date).toISOString(),
  };
}

function rowToAdminUser(row: Record<string, unknown>): AdminUser {
  return {
    id: row.id as string,
    email: row.email as string,
    passwordHash: row.password_hash as string,
    name: row.name as string,
    role: row.role as "admin",
  };
}

function rowToSettings(row: Record<string, unknown>): StoreSettings {
  return {
    storeName: row.store_name as string,
    storeEmail: row.store_email as string,
    storePhone: row.store_phone as string,
    storeAddress: row.store_address as string,
    currency: row.currency as string,
    taxRate: row.tax_rate as number,
    freeShippingThreshold: row.free_shipping_threshold as number,
  };
}

// --- Products ---

export async function getProducts(): Promise<AdminProduct[]> {
  const { rows } = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  return rows.map(rowToProduct);
}

export async function getProductById(
  id: string
): Promise<AdminProduct | undefined> {
  const { rows } = await sql`SELECT * FROM products WHERE id = ${id}`;
  return rows[0] ? rowToProduct(rows[0]) : undefined;
}

export async function createProduct(
  product: Omit<AdminProduct, "createdAt" | "updatedAt">
): Promise<AdminProduct> {
  const now = new Date().toISOString();
  const { rows } = await sql`
    INSERT INTO products (id, name, subtitle, image, badge, rating, reviews, specs, description, category, variants, created_at, updated_at)
    VALUES (${product.id}, ${product.name}, ${product.subtitle}, ${product.image}, ${product.badge ?? null}, ${product.rating}, ${product.reviews}, ${JSON.stringify(product.specs)}, ${product.description}, ${product.category}, ${JSON.stringify(product.variants)}, ${now}, ${now})
    RETURNING *;
  `;
  return rowToProduct(rows[0]);
}

export async function updateProduct(
  id: string,
  updates: Partial<AdminProduct>
): Promise<AdminProduct | null> {
  const existing = await getProductById(id);
  if (!existing) return null;

  const merged = { ...existing, ...updates };
  const now = new Date().toISOString();

  const { rows } = await sql`
    UPDATE products SET
      name = ${merged.name},
      subtitle = ${merged.subtitle},
      image = ${merged.image},
      badge = ${merged.badge ?? null},
      rating = ${merged.rating},
      reviews = ${merged.reviews},
      specs = ${JSON.stringify(merged.specs)},
      description = ${merged.description},
      category = ${merged.category},
      variants = ${JSON.stringify(merged.variants)},
      updated_at = ${now}
    WHERE id = ${id}
    RETURNING *;
  `;
  return rows[0] ? rowToProduct(rows[0]) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { rowCount } = await sql`DELETE FROM products WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}

// --- Orders ---

export async function getOrders(): Promise<Order[]> {
  const { rows } = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
  return rows.map(rowToOrder);
}

export async function getOrderById(
  id: string
): Promise<Order | undefined> {
  const { rows } = await sql`SELECT * FROM orders WHERE id = ${id}`;
  return rows[0] ? rowToOrder(rows[0]) : undefined;
}

export async function createOrder(
  order: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<Order> {
  const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
  const now = new Date().toISOString();

  const { rows } = await sql`
    INSERT INTO orders (id, items, customer, status, subtotal, shipping, tax, total, created_at, updated_at)
    VALUES (${id}, ${JSON.stringify(order.items)}, ${JSON.stringify(order.customer)}, ${order.status}, ${order.subtotal}, ${order.shipping}, ${order.tax}, ${order.total}, ${now}, ${now})
    RETURNING *;
  `;
  return rowToOrder(rows[0]);
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order | null> {
  const existing = await getOrderById(id);
  if (!existing) return null;

  const merged = { ...existing, ...updates };
  const now = new Date().toISOString();

  const { rows } = await sql`
    UPDATE orders SET
      items = ${JSON.stringify(merged.items)},
      customer = ${JSON.stringify(merged.customer)},
      status = ${merged.status},
      subtotal = ${merged.subtotal},
      shipping = ${merged.shipping},
      tax = ${merged.tax},
      total = ${merged.total},
      updated_at = ${now}
    WHERE id = ${id}
    RETURNING *;
  `;
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const { rowCount } = await sql`DELETE FROM orders WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}

// --- Admin Users ---

export async function getAdminUser(
  email: string
): Promise<AdminUser | undefined> {
  const { rows } = await sql`SELECT * FROM admin_users WHERE email = ${email}`;
  return rows[0] ? rowToAdminUser(rows[0]) : undefined;
}

export async function updateAdminUser(
  email: string,
  updates: Partial<AdminUser>
): Promise<AdminUser | null> {
  const existing = await getAdminUser(email);
  if (!existing) return null;

  const merged = { ...existing, ...updates };
  const { rows } = await sql`
    UPDATE admin_users SET
      password_hash = ${merged.passwordHash},
      name = ${merged.name},
      role = ${merged.role}
    WHERE email = ${email}
    RETURNING *;
  `;
  return rows[0] ? rowToAdminUser(rows[0]) : null;
}

// --- Store Settings ---

export async function getStoreSettings(): Promise<StoreSettings> {
  const { rows } = await sql`SELECT * FROM store_settings WHERE id = 1`;
  if (!rows[0]) {
    return {
      storeName: "Eri Mobile Shop",
      storeEmail: "info@erimobile.com",
      storePhone: "+383 44 123 456",
      storeAddress: "Gjakovë, Kosovë",
      currency: "EUR",
      taxRate: 0.08,
      freeShippingThreshold: 0,
    };
  }
  return rowToSettings(rows[0]);
}

export async function updateStoreSettings(
  updates: Partial<StoreSettings>
): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const merged = { ...current, ...updates };

  const { rows } = await sql`
    INSERT INTO store_settings (id, store_name, store_email, store_phone, store_address, currency, tax_rate, free_shipping_threshold)
    VALUES (1, ${merged.storeName}, ${merged.storeEmail}, ${merged.storePhone}, ${merged.storeAddress}, ${merged.currency}, ${merged.taxRate}, ${merged.freeShippingThreshold})
    ON CONFLICT (id) DO UPDATE SET
      store_name = ${merged.storeName},
      store_email = ${merged.storeEmail},
      store_phone = ${merged.storePhone},
      store_address = ${merged.storeAddress},
      currency = ${merged.currency},
      tax_rate = ${merged.taxRate},
      free_shipping_threshold = ${merged.freeShippingThreshold}
    RETURNING *;
  `;
  return rowToSettings(rows[0]);
}
