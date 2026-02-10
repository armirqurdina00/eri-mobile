export interface ProductVariant {
  color: string;
  colorHex: string;
  image: string;
  storage: string;
  price: number;
  originalPrice?: number;
  stock: number;
  inStock: boolean;
}

export interface AdminProduct {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  specs: { label: string; value: string }[];
  description: string;
  category: string;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedStorage: string;
  image: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  items: OrderItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "admin";
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
}

export interface AdminData {
  users: AdminUser[];
  settings: StoreSettings;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
  recentOrders: Order[];
  ordersByStatus: Record<OrderStatus, number>;
}
