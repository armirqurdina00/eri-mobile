import { config } from "dotenv";
config({ path: ".env.local" });

import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { products } from "../data/products";

async function seed() {
  console.log("🌱 Seeding database...\n");

  // Seed products
  const now = new Date();
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const createdAt = new Date(now.getTime() + (products.length - 1 - i) * 60000).toISOString();
    await sql`
      INSERT INTO products (id, name, subtitle, image, badge, rating, reviews, specs, description, category, variants, created_at, updated_at)
      VALUES (${p.id}, ${p.name}, ${p.subtitle}, ${p.image}, ${p.badge ?? null}, ${p.rating}, ${p.reviews}, ${JSON.stringify(p.specs)}, ${p.description}, ${p.category}, ${JSON.stringify(p.variants)}, ${createdAt}, ${now.toISOString()})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
  console.log(`✅ Seeded ${products.length} products`);

  // Seed admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  await sql`
    INSERT INTO admin_users (id, email, password_hash, name, role)
    VALUES ('admin-1', 'admin@erimobile.com', ${passwordHash}, 'Admin', 'admin')
    ON CONFLICT (id) DO NOTHING;
  `;
  console.log("✅ Seeded admin user (admin@erimobile.com / admin123)");

  // Seed default store settings
  await sql`
    INSERT INTO store_settings (id, store_name, store_email, store_phone, store_address, currency, tax_rate, free_shipping_threshold)
    VALUES (1, 'Eri Mobile Shop', 'info@erimobile.com', '+383 44 123 456', 'Gjakovë, Kosovë', 'EUR', 0.08, 0)
    ON CONFLICT (id) DO NOTHING;
  `;
  console.log("✅ Seeded store settings");

  console.log("\n🎉 Seed complete!");
}

seed().catch(console.error);
