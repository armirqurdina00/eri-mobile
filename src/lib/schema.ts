import { config } from "dotenv";
config({ path: ".env.local" });

import { sql } from "@vercel/postgres";

async function createTables() {
  console.log("Creating tables...\n");

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subtitle TEXT,
      image TEXT,
      badge TEXT,
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      specs JSONB DEFAULT '[]',
      description TEXT,
      category TEXT,
      variants JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("✅ Created products table");

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      items JSONB NOT NULL,
      customer JSONB NOT NULL,
      status TEXT DEFAULT 'pending',
      subtotal REAL DEFAULT 0,
      shipping REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("✅ Created orders table");

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'admin'
    );
  `;
  console.log("✅ Created admin_users table");

  await sql`
    CREATE TABLE IF NOT EXISTS store_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      store_name TEXT,
      store_email TEXT,
      store_phone TEXT,
      store_address TEXT,
      currency TEXT DEFAULT 'EUR',
      tax_rate REAL DEFAULT 0.08,
      free_shipping_threshold REAL DEFAULT 0
    );
  `;
  console.log("✅ Created store_settings table");

  console.log("\n🎉 All tables created!");
}

createTables().catch(console.error);
