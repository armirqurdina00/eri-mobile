import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { products } from "../data/products";
import type { AdminProduct, AdminData } from "../types/admin";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function seed() {
  console.log("🌱 Seeding data files...\n");
  ensureDataDir();

  // Seed products.json
  const now = new Date();
  const adminProducts: AdminProduct[] = products.map((p, i) => ({
    ...p,
    createdAt: new Date(now.getTime() + i * 60000).toISOString(),
    updatedAt: now.toISOString(),
  }));

  const productsPath = path.join(DATA_DIR, "products.json");
  fs.writeFileSync(productsPath, JSON.stringify(adminProducts, null, 2));
  console.log(`✅ Created ${productsPath} (${adminProducts.length} products)`);

  // Seed orders.json
  const ordersPath = path.join(DATA_DIR, "orders.json");
  fs.writeFileSync(ordersPath, JSON.stringify([], null, 2));
  console.log(`✅ Created ${ordersPath} (empty)`);

  // Seed admin.json
  const passwordHash = await bcrypt.hash("admin123", 12);
  const adminData: AdminData = {
    users: [
      {
        id: "admin-1",
        email: "admin@erimobile.com",
        passwordHash,
        name: "Admin",
        role: "admin",
      },
    ],
    settings: {
      storeName: "Eri Mobile Shop",
      storeEmail: "info@erimobile.com",
      storePhone: "+383 44 123 456",
      storeAddress: "Gjakovë, Kosovë",
      currency: "EUR",
      taxRate: 0.08,
      freeShippingThreshold: 0,
    },
  };

  const adminPath = path.join(DATA_DIR, "admin.json");
  fs.writeFileSync(adminPath, JSON.stringify(adminData, null, 2));
  console.log(`✅ Created ${adminPath}`);

  console.log("\n🎉 Seed complete! Admin login: admin@erimobile.com / admin123");
}

seed().catch(console.error);
