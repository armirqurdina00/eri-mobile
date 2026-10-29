/**
 * Brings the product catalog in line with Apple's lineup as of 29 October 2026.
 *
 *   npx tsx src/lib/update-catalog.ts           # dry run: prints what would change
 *   npx tsx src/lib/update-catalog.ts --apply   # backs up the table to data/, then writes
 *
 * Specs come from Apple's tech-spec pages (EU models). Prices for models Apple still sells are
 * Apple Germany's (apple.com/de, incl. VAT, read 29 Oct 2026). Models Apple no longer sells keep
 * the shop's own prices. Existing stock is kept wherever a colour + storage combination survives;
 * new combinations start at NEW_STOCK and should be corrected in the admin.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { sql } from "@vercel/postgres";
import { writeFileSync } from "fs";
import type { AdminProduct, ProductVariant } from "../types/admin";

const APPLY = process.argv.includes("--apply");
const NEW_STOCK = 10;

// Apple's official product photos as transparent cut-outs, served from public/devices.
const local = (name: string) => `/devices/${name}.webp`;

type Finish = { color: string; colorHex: string; image: string };
type Spec = { label: string; value: string };

type Entry = {
  id: string;
  name: string;
  subtitle: string;
  category: "Pro" | "Standard" | "Accessories";
  badge?: string;
  released: string;
  description: string;
  specs: Spec[];
  finishes: Finish[];
  /**
   * Apple's price per storage tier, for models Apple sells. Omit for discontinued models:
   * they keep the shop's current prices, and only storages the shop already stocks.
   */
  prices?: Record<string, number>;
  /** Colour renames for discontinued models whose stored colour names were wrong. */
  renames?: Record<string, string>;
};

const catalog: Entry[] = [
  // ── Current Apple lineup ─────────────────────────────────────────
  {
    id: "iphone-duo",
    name: "iPhone Duo",
    subtitle: "The first foldable iPhone.",
    category: "Pro",
    badge: "New",
    released: "2026-10-23T12:00:00Z",
    description:
      "Apple's first foldable opens from a 5.4-inch phone into a 7.6-inch display, both with ProMotion up to 120Hz. It runs on the A20 Pro chip, unlocks with Touch ID in the side button, and has a 48MP Fusion Main and 48MP Ultra Wide camera. Titanium design, IP68, eSIM only.",
    specs: [
      { label: "Display", value: '7.6" foldable inner + 5.4" outer, Super Retina XDR, ProMotion 120Hz' },
      { label: "Chip", value: "A20 Pro" },
      { label: "Camera", value: "48MP Fusion Main (2x optical-quality) + 48MP Ultra Wide" },
      { label: "Front camera", value: "12MP Center Stage (outer), under-display camera (inner)" },
      { label: "Battery", value: "Up to 44 hours video playback (outer display), 31 hours (inner)" },
      { label: "Weight", value: "254 g" },
      { label: "Build", value: "Titanium, Ceramic Shield 2, IP68" },
      { label: "Security", value: "Touch ID in the side button" },
      { label: "SIM", value: "eSIM only" },
    ],
    finishes: [
      { color: "Night Sky", colorHex: "#1E2230", image: local("iphone-duo-finish-select-night-sky-202609_GEO_EMEA") },
      { color: "Star White", colorHex: "#F2F1EC", image: local("iphone-duo-finish-select-star-white-202609_GEO_EMEA") },
    ],
    prices: { "256GB": 2299, "512GB": 2549, "1TB": 3049, "2TB": 3799 },
  },
  {
    id: "iphone-18-pro-max",
    name: "iPhone 18 Pro Max",
    subtitle: "The biggest screen and longest battery of any iPhone.",
    category: "Pro",
    badge: "New",
    released: "2026-09-18T12:01:00Z",
    description:
      "A 6.9-inch ProMotion display, the A20 Pro chip with vapour-chamber cooling and up to 43 hours of video playback. Three 48MP Fusion cameras, with a new variable-aperture Main camera and a 4x Telephoto that reaches 8x optical quality. Available up to 2TB.",
    specs: [
      { label: "Display", value: '6.9" Super Retina XDR, ProMotion 120Hz, Always-On' },
      { label: "Chip", value: "A20 Pro" },
      { label: "Camera", value: "48MP Fusion Main (variable aperture) + 48MP Ultra Wide + 48MP 4x Telephoto, up to 8x optical-quality" },
      { label: "Front camera", value: "18MP Center Stage" },
      { label: "Battery", value: "Up to 43 hours video playback" },
      { label: "Weight", value: "249 g" },
      { label: "Build", value: "Aluminium unibody, Ceramic Shield 2, IP68" },
      { label: "Connectivity", value: "Apple C2 modem, Wi-Fi 7, satellite features" },
    ],
    finishes: ["black", "silver", "glacier", "burgundy"].map((c, i) => ({
      color: ["Black", "Silver", "Glacier", "Burgundy"][i],
      colorHex: ["#2B2B2D", "#E3E4E5", "#C9D9E3", "#6B2333"][i],
      image: local(`iphone-18-pro-max-finish-select-${c}-202609`),
    })),
    prices: { "256GB": 1599, "512GB": 1849, "1TB": 2349, "2TB": 3099 },
  },
  {
    id: "iphone-18-pro",
    name: "iPhone 18 Pro",
    subtitle: "Pro cameras and A20 Pro, in a 6.3-inch size.",
    category: "Pro",
    badge: "New",
    released: "2026-09-18T12:00:00Z",
    description:
      "The full iPhone 18 Pro camera system and A20 Pro chip in a 6.3-inch body. Three 48MP Fusion cameras with a variable-aperture Main camera and up to 8x optical-quality zoom, an 18MP Center Stage front camera and up to 34 hours of video playback.",
    specs: [
      { label: "Display", value: '6.3" Super Retina XDR, ProMotion 120Hz, Always-On' },
      { label: "Chip", value: "A20 Pro" },
      { label: "Camera", value: "48MP Fusion Main (variable aperture) + 48MP Ultra Wide + 48MP 4x Telephoto, up to 8x optical-quality" },
      { label: "Front camera", value: "18MP Center Stage" },
      { label: "Battery", value: "Up to 34 hours video playback" },
      { label: "Weight", value: "211 g" },
      { label: "Build", value: "Aluminium unibody, Ceramic Shield 2, IP68" },
      { label: "Connectivity", value: "Apple C2 modem, Wi-Fi 7, satellite features" },
    ],
    finishes: ["black", "silver", "glacier", "burgundy"].map((c, i) => ({
      color: ["Black", "Silver", "Glacier", "Burgundy"][i],
      colorHex: ["#2B2B2D", "#E3E4E5", "#C9D9E3", "#6B2333"][i],
      image: local(`iphone-18-pro-finish-select-${c}-202609`),
    })),
    prices: { "256GB": 1449, "512GB": 1699, "1TB": 2199, "2TB": 2949 },
  },
  {
    id: "iphone-17e",
    name: "iPhone 17e",
    subtitle: "A19, MagSafe and 256GB to start.",
    category: "Standard",
    released: "2026-03-11T12:00:00Z",
    description:
      "The most affordable iPhone, now with the A19 chip, MagSafe and Qi2 charging, and 256GB of storage to start. Its 48MP Fusion camera also takes 2x optical-quality shots, and it lasts up to 26 hours of video playback.",
    specs: [
      { label: "Display", value: '6.1" Super Retina XDR OLED' },
      { label: "Chip", value: "A19" },
      { label: "Camera", value: "48MP Fusion (2x optical-quality)" },
      { label: "Front camera", value: "12MP TrueDepth" },
      { label: "Battery", value: "Up to 26 hours video playback" },
      { label: "Weight", value: "170 g" },
      { label: "Build", value: "Aluminium, Ceramic Shield 2, IP68" },
      { label: "Charging", value: "MagSafe and Qi2 up to 15W, USB-C" },
    ],
    finishes: [
      { color: "Black", colorHex: "#232325", image: local("iphone-17e-finish-select-black-202603") },
      { color: "White", colorHex: "#F5F5F3", image: local("iphone-17e-finish-select-white-202603") },
      { color: "Soft Pink", colorHex: "#F2D3D6", image: local("iphone-17e-finish-select-softpink-202603") },
    ],
    prices: { "256GB": 849, "512GB": 1099 },
  },
  {
    id: "iphone-air",
    name: "iPhone Air",
    subtitle: "The thinnest iPhone, at 165 grams.",
    category: "Pro",
    released: "2025-09-19T12:02:00Z",
    description:
      "A titanium iPhone that weighs just 165 g, with a 6.5-inch ProMotion display and the A19 Pro chip. It has a single 48MP Fusion camera with 2x optical-quality zoom, an 18MP Center Stage front camera and up to 27 hours of video playback. eSIM only.",
    specs: [
      { label: "Display", value: '6.5" Super Retina XDR, ProMotion 120Hz' },
      { label: "Chip", value: "A19 Pro" },
      { label: "Camera", value: "48MP Fusion (2x optical-quality)" },
      { label: "Front camera", value: "18MP Center Stage" },
      { label: "Battery", value: "Up to 27 hours video playback" },
      { label: "Weight", value: "165 g" },
      { label: "Build", value: "Titanium, Ceramic Shield front and back" },
      { label: "SIM", value: "eSIM only" },
    ],
    finishes: [
      { color: "Space Black", colorHex: "#1F1F21", image: local("iphone-air-finish-select-spaceblack-202509_GEO_EMEA") },
      { color: "Cloud White", colorHex: "#F4F4F1", image: local("iphone-air-finish-select-cloudwhite-202509_GEO_EMEA") },
      { color: "Light Gold", colorHex: "#EADDC6", image: local("iphone-air-finish-select-lightgold-202509_GEO_EMEA") },
      { color: "Sky Blue", colorHex: "#CFE3EF", image: local("iphone-air-finish-select-skyblue-202509_GEO_EMEA") },
    ],
    prices: { "256GB": 1299, "512GB": 1549, "1TB": 2049 },
  },
  {
    id: "iphone-17",
    name: "iPhone 17",
    subtitle: "ProMotion and two 48MP cameras.",
    category: "Standard",
    released: "2025-09-19T12:00:00Z",
    description:
      "A 6.3-inch display with ProMotion up to 120Hz, the A19 chip and two 48MP Fusion cameras (Main and Ultra Wide). The 18MP Center Stage front camera keeps everyone in frame, and it lasts up to 30 hours of video playback. 256GB to start.",
    specs: [
      { label: "Display", value: '6.3" Super Retina XDR, ProMotion 120Hz' },
      { label: "Chip", value: "A19" },
      { label: "Camera", value: "48MP Fusion Main (2x optical-quality) + 48MP Ultra Wide" },
      { label: "Front camera", value: "18MP Center Stage" },
      { label: "Battery", value: "Up to 30 hours video playback" },
      { label: "Weight", value: "177 g" },
      { label: "Build", value: "Aluminium, Ceramic Shield 2" },
    ],
    finishes: ["lavender", "sage", "mistblue", "white", "black"].map((c, i) => ({
      color: ["Lavender", "Sage", "Mist Blue", "White", "Black"][i],
      colorHex: ["#DCCFE8", "#B9C3A6", "#A9BDD3", "#F5F5F3", "#232325"][i],
      image: local(`iphone-17-finish-select-${c}-202509_GEO_EMEA`),
    })),
    prices: { "256GB": 1099, "512GB": 1349 },
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    subtitle: "A18 and Camera Control.",
    category: "Standard",
    released: "2024-09-20T12:01:00Z",
    description:
      "A 6.1-inch iPhone with the A18 chip, Apple Intelligence, Camera Control and the Action button. A 48MP Fusion camera with 2x optical-quality zoom and a 12MP Ultra Wide, and up to 22 hours of video playback. Apple now sells it in 128GB.",
    specs: [
      { label: "Display", value: '6.1" Super Retina XDR OLED' },
      { label: "Chip", value: "A18" },
      { label: "Camera", value: "48MP Fusion (2x optical-quality) + 12MP Ultra Wide" },
      { label: "Front camera", value: "12MP TrueDepth" },
      { label: "Battery", value: "Up to 22 hours video playback" },
      { label: "Weight", value: "170 g" },
      { label: "Build", value: "Aluminium, colour-infused glass back" },
    ],
    finishes: ["ultramarine", "teal", "pink", "white", "black"].map((c, i) => ({
      color: ["Ultramarine", "Teal", "Pink", "White", "Black"][i],
      colorHex: ["#748DFF", "#B0D4D1", "#F4C1D2", "#F5F5F0", "#3C3C3D"][i],
      image: local(`iphone-16-finish-select-202409-6-1inch-${c}`),
    })),
    // Apple sells only 128GB now, at €999.
    prices: { "128GB": 999 },
  },
  {
    id: "airpods-5",
    name: "AirPods 5",
    subtitle: "Active Noise Cancellation in an open-ear design.",
    category: "Accessories",
    badge: "New",
    released: "2026-09-18T11:00:00Z",
    description:
      "Open-ear AirPods with Active Noise Cancellation on every model, Adaptive Audio, Conversation Awareness and Personalized Spatial Audio. Up to 4 hours of listening with ANC on, and up to 20 hours with the USB-C charging case.",
    specs: [
      { label: "Chip", value: "H2" },
      { label: "Noise control", value: "Active Noise Cancellation, Transparency, Adaptive Audio" },
      { label: "Battery", value: "Up to 4 hours with ANC (6 hours off), up to 20 hours with case" },
      { label: "Case", value: "USB-C Charging Case" },
    ],
    finishes: [{ color: "White", colorHex: "#F5F5F0", image: local("airpods-5-select-202609_FV1") }],
    prices: { "": 149 },
  },
  {
    id: "airpods-5-wireless",
    name: "AirPods 5 with Wireless Charging Case",
    subtitle: "AirPods 5, with a case that charges wirelessly.",
    category: "Accessories",
    badge: "New",
    released: "2026-09-18T10:59:00Z",
    description:
      "AirPods 5 with a case that charges on Apple Watch and Qi chargers or over USB-C, adds a speaker for Find My and lets you swipe to change volume. Up to 5 hours of listening with ANC on, and up to 22 hours with the case.",
    specs: [
      { label: "Chip", value: "H2" },
      { label: "Noise control", value: "Active Noise Cancellation, Transparency, Adaptive Audio" },
      { label: "Battery", value: "Up to 5 hours with ANC (7 hours off), up to 22 hours with case" },
      { label: "Case", value: "Wireless Charging Case (USB-C, Apple Watch charger, Qi), Find My speaker" },
    ],
    finishes: [{ color: "White", colorHex: "#F5F5F0", image: local("airpods-5-wcc-select-202609_FV1") }],
    prices: { "": 169 },
  },
  {
    id: "airpods-pro-3",
    name: "AirPods Pro 3",
    subtitle: "Noise cancellation and heart-rate sensing.",
    category: "Accessories",
    released: "2025-09-19T11:00:00Z",
    description:
      "Apple's in-ear AirPods Pro with Active Noise Cancellation, built-in heart-rate sensing for workouts and hearing health features including Hearing Test and Hearing Aid. Up to 8 hours of listening with ANC and up to 24 hours with the MagSafe case. IP57.",
    specs: [
      { label: "Chip", value: "H2" },
      { label: "Noise control", value: "Active Noise Cancellation, Transparency, Adaptive Audio" },
      { label: "Battery", value: "Up to 8 hours with ANC, up to 24 hours with case" },
      { label: "Health", value: "Heart-rate sensing, Hearing Test, Hearing Aid, Hearing Protection" },
      { label: "Case", value: "MagSafe Charging Case (USB-C), Find My" },
      { label: "Water resistance", value: "IP57 (earbuds and case)" },
    ],
    finishes: [{ color: "White", colorHex: "#F5F5F0", image: local("airpods-pro-3-hero-select-202509") }],
    prices: { "": 249 },
  },

  // ── No longer sold by Apple: shop prices kept ────────────────────
  {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    subtitle: "Three 48MP cameras and up to 37 hours of video.",
    category: "Pro",
    released: "2025-09-19T12:04:00Z",
    description:
      "Last year's largest Pro: a 6.9-inch ProMotion display, the A19 Pro chip and three 48MP Fusion cameras with a 4x Telephoto that reaches 8x optical quality. Aluminium unibody, up to 37 hours of video playback.",
    specs: [
      { label: "Display", value: '6.9" Super Retina XDR, ProMotion 120Hz, Always-On' },
      { label: "Chip", value: "A19 Pro" },
      { label: "Camera", value: "48MP Fusion Main + 48MP Ultra Wide + 48MP 4x Telephoto, up to 8x optical-quality" },
      { label: "Front camera", value: "18MP Center Stage" },
      { label: "Battery", value: "Up to 37 hours video playback" },
      { label: "Weight", value: "231 g" },
      { label: "Build", value: "Aluminium unibody, Ceramic Shield 2, IP68" },
    ],
    finishes: ["cosmicorange", "deepblue", "silver"].map((c, i) => ({
      color: ["Cosmic Orange", "Deep Blue", "Silver"][i],
      colorHex: ["#E86A2B", "#2E3A4F", "#E3E4E5"][i],
      image: local(`iphone-17-pro-finish-select-202509-6-9inch-${c}`),
    })),
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro",
    subtitle: "Three 48MP cameras in a 6.3-inch size.",
    category: "Pro",
    released: "2025-09-19T12:03:00Z",
    description:
      "A 6.3-inch Pro with the A19 Pro chip, an aluminium unibody and three 48MP Fusion cameras, including a 4x Telephoto that reaches 8x optical quality. 18MP Center Stage front camera and up to 31 hours of video playback.",
    specs: [
      { label: "Display", value: '6.3" Super Retina XDR, ProMotion 120Hz, Always-On' },
      { label: "Chip", value: "A19 Pro" },
      { label: "Camera", value: "48MP Fusion Main + 48MP Ultra Wide + 48MP 4x Telephoto, up to 8x optical-quality" },
      { label: "Front camera", value: "18MP Center Stage" },
      { label: "Battery", value: "Up to 31 hours video playback" },
      { label: "Weight", value: "204 g" },
      { label: "Build", value: "Aluminium unibody, Ceramic Shield 2, IP68" },
    ],
    finishes: ["cosmicorange", "deepblue", "silver"].map((c, i) => ({
      color: ["Cosmic Orange", "Deep Blue", "Silver"][i],
      colorHex: ["#E86A2B", "#2E3A4F", "#E3E4E5"][i],
      image: local(`iphone-17-pro-finish-select-202509-6-3inch-${c}`),
    })),
  },
  {
    id: "iphone-16e",
    name: "iPhone 16e",
    subtitle: "A18 and a 48MP camera.",
    category: "Standard",
    released: "2025-02-28T12:00:00Z",
    description:
      "A 6.1-inch iPhone with the A18 chip, Apple Intelligence, the Action button and a 48MP Fusion camera with 2x optical-quality zoom. Up to 26 hours of video playback.",
    specs: [
      { label: "Display", value: '6.1" Super Retina XDR OLED' },
      { label: "Chip", value: "A18" },
      { label: "Camera", value: "48MP Fusion (2x optical-quality)" },
      { label: "Front camera", value: "12MP TrueDepth" },
      { label: "Battery", value: "Up to 26 hours video playback" },
      { label: "Weight", value: "167 g" },
      { label: "Build", value: "Aluminium, IP68" },
    ],
    finishes: [
      { color: "Black", colorHex: "#1D1D1F", image: local("iphone-16e-finish-select-202502-black") },
      { color: "White", colorHex: "#F5F5F7", image: local("iphone-16e-finish-select-202502-white") },
    ],
    // The 16e only came in Black and White; the store had them under the wrong names.
    renames: { Midnight: "Black", Starlight: "White" },
  },
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    subtitle: "Titanium, 6.9 inches, up to 33 hours of video.",
    category: "Pro",
    released: "2024-09-20T12:03:00Z",
    description:
      "A titanium iPhone with a 6.9-inch ProMotion display, the A18 Pro chip, Camera Control and a 48MP Fusion camera with a 5x Telephoto. Up to 33 hours of video playback.",
    specs: [
      { label: "Display", value: '6.9" Super Retina XDR, ProMotion 120Hz, Always-On' },
      { label: "Chip", value: "A18 Pro" },
      { label: "Camera", value: "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto" },
      { label: "Front camera", value: "12MP TrueDepth" },
      { label: "Battery", value: "Up to 33 hours video playback" },
      { label: "Weight", value: "227 g" },
      { label: "Build", value: "Titanium, IP68" },
    ],
    finishes: ["deserttitanium", "naturaltitanium", "whitetitanium", "blacktitanium"].map((c, i) => ({
      color: ["Desert Titanium", "Natural Titanium", "White Titanium", "Black Titanium"][i],
      colorHex: ["#BFA48F", "#C2BCB2", "#F2F1ED", "#3C3C3D"][i],
      image: local(`iphone-16-pro-finish-select-202409-6-9inch-${c}`),
    })),
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    subtitle: "Titanium and the A18 Pro, at 6.3 inches.",
    category: "Pro",
    released: "2024-09-20T12:02:00Z",
    description:
      "A 6.3-inch titanium iPhone with the A18 Pro chip, Camera Control and a 48MP Fusion camera system with a 5x Telephoto. Up to 27 hours of video playback.",
    specs: [
      { label: "Display", value: '6.3" Super Retina XDR, ProMotion 120Hz, Always-On' },
      { label: "Chip", value: "A18 Pro" },
      { label: "Camera", value: "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto" },
      { label: "Front camera", value: "12MP TrueDepth" },
      { label: "Battery", value: "Up to 27 hours video playback" },
      { label: "Weight", value: "199 g" },
      { label: "Build", value: "Titanium, IP68" },
    ],
    finishes: ["deserttitanium", "naturaltitanium", "whitetitanium", "blacktitanium"].map((c, i) => ({
      color: ["Desert Titanium", "Natural Titanium", "White Titanium", "Black Titanium"][i],
      colorHex: ["#BFA48F", "#C2BCB2", "#F2F1ED", "#3C3C3D"][i],
      image: local(`iphone-16-pro-finish-select-202409-6-3inch-${c}`),
    })),
  },
  {
    id: "iphone-16-plus",
    name: "iPhone 16 Plus",
    subtitle: "A 6.7-inch screen and up to 27 hours of video.",
    category: "Standard",
    released: "2024-09-20T12:00:00Z",
    description:
      "The iPhone 16 with a larger 6.7-inch display and longer battery life: the A18 chip, Camera Control, a 48MP Fusion camera and up to 27 hours of video playback.",
    specs: [
      { label: "Display", value: '6.7" Super Retina XDR OLED' },
      { label: "Chip", value: "A18" },
      { label: "Camera", value: "48MP Fusion (2x optical-quality) + 12MP Ultra Wide" },
      { label: "Front camera", value: "12MP TrueDepth" },
      { label: "Battery", value: "Up to 27 hours video playback" },
      { label: "Weight", value: "199 g" },
      { label: "Build", value: "Aluminium, colour-infused glass back" },
    ],
    finishes: ["ultramarine", "teal", "pink", "white", "black"].map((c, i) => ({
      color: ["Ultramarine", "Teal", "Pink", "White", "Black"][i],
      colorHex: ["#748DFF", "#B0D4D1", "#F4C1D2", "#F5F5F0", "#3C3C3D"][i],
      image: local(`iphone-16-finish-select-202409-6-7inch-${c}`),
    })),
  },
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    subtitle: "Titanium and a 5x Telephoto.",
    category: "Pro",
    released: "2023-09-22T12:01:00Z",
    description:
      "A titanium iPhone with a 6.7-inch ProMotion display, the A17 Pro chip, the Action button, USB-C and a 48MP camera system with a 5x Telephoto. Up to 29 hours of video playback.",
    specs: [
      { label: "Display", value: '6.7" Super Retina XDR, ProMotion 120Hz, Always-On' },
      { label: "Chip", value: "A17 Pro" },
      { label: "Camera", value: "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto" },
      { label: "Front camera", value: "12MP TrueDepth" },
      { label: "Battery", value: "Up to 29 hours video playback" },
      { label: "Weight", value: "221 g" },
      { label: "Build", value: "Titanium, IP68" },
    ],
    finishes: ["bluetitanium", "naturaltitanium", "whitetitanium", "blacktitanium"].map((c, i) => ({
      color: ["Blue Titanium", "Natural Titanium", "White Titanium", "Black Titanium"][i],
      colorHex: ["#394C6B", "#C2BCB2", "#F2F1ED", "#3C3C3D"][i],
      image: local(`iphone-15-pro-finish-select-202309-6-7inch-${c}`),
    })),
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    subtitle: "Dynamic Island, 48MP and USB-C.",
    category: "Standard",
    released: "2023-09-22T12:00:00Z",
    description:
      "A 6.1-inch iPhone with the Dynamic Island, a 48MP Main camera, USB-C and the A16 Bionic chip, in colour-infused glass. Up to 20 hours of video playback.",
    specs: [
      { label: "Display", value: '6.1" Super Retina XDR OLED' },
      { label: "Chip", value: "A16 Bionic" },
      { label: "Camera", value: "48MP Main + 12MP Ultra Wide" },
      { label: "Front camera", value: "12MP TrueDepth" },
      { label: "Battery", value: "Up to 20 hours video playback" },
      { label: "Weight", value: "171 g" },
      { label: "Build", value: "Aluminium, colour-infused glass back" },
    ],
    finishes: ["pink", "yellow", "green", "blue", "black"].map((c, i) => ({
      color: ["Pink", "Yellow", "Green", "Blue", "Black"][i],
      colorHex: ["#F4C1D2", "#F9E479", "#D1E6C8", "#7EB4D2", "#3C3C3D"][i],
      image: local(`iphone-15-finish-select-202309-6-1inch-${c}`),
    })),
  },
  {
    id: "airpods-pro-2",
    name: "AirPods Pro 2",
    subtitle: "Noise cancellation with the H2 chip.",
    category: "Accessories",
    released: "2023-09-22T11:00:00Z",
    description:
      "The previous AirPods Pro, with the H2 chip, Active Noise Cancellation, Adaptive Audio and Conversation Awareness. Up to 6 hours of listening with ANC and a USB-C MagSafe charging case.",
    specs: [
      { label: "Chip", value: "H2" },
      { label: "Noise control", value: "Active Noise Cancellation, Transparency, Adaptive Audio" },
      { label: "Battery", value: "Up to 6 hours with ANC, up to 30 hours with case" },
      { label: "Case", value: "MagSafe Charging Case (USB-C)" },
    ],
    finishes: [{ color: "White", colorHex: "#F5F5F0", image: local("airpods-pro-2-hero-select-202409") }],
  },
];

function buildVariants(entry: Entry, existing?: AdminProduct): ProductVariant[] {
  const old = (existing?.variants ?? []).map((v) => ({ ...v, color: entry.renames?.[v.color] ?? v.color }));
  const finishByColor = new Map(entry.finishes.map((f) => [f.color, f]));

  if (entry.prices) {
    return entry.finishes.flatMap((f) =>
      Object.entries(entry.prices!).map(([storage, price]) => {
        const prev = old.find((v) => v.color === f.color && v.storage === storage);
        const stock = prev?.stock ?? NEW_STOCK;
        return { color: f.color, colorHex: f.colorHex, image: f.image, storage, price, stock, inStock: stock > 0 };
      })
    );
  }

  // Discontinued: the shop's own variants and prices, with corrected colour names, hexes and photos.
  // Colours that never existed (e.g. a red iPhone 16e) are dropped.
  return old.flatMap((v) => {
    const f = finishByColor.get(v.color);
    return f ? [{ ...v, colorHex: f.colorHex, image: f.image }] : [];
  });
}

function describeChanges(before: AdminProduct | undefined, after: Omit<AdminProduct, "createdAt" | "updatedAt">) {
  if (!before) {
    const prices = [...new Set(after.variants.map((v) => v.price))].sort((a, b) => a - b);
    return [`NEW  ${after.variants.length} variants, €${prices[0]}–€${prices.at(-1)}`];
  }
  const lines: string[] = [];
  for (const key of ["name", "subtitle", "badge", "category", "description"] as const) {
    if ((before[key] ?? "") !== (after[key] ?? "")) lines.push(`${key}: "${before[key] ?? ""}" → "${after[key] ?? ""}"`);
  }
  if (before.reviews || before.rating) lines.push(`rating: ${before.rating} (${before.reviews} reviews) → none`);
  const fmt = (s: AdminProduct["specs"]) => s.map((x) => `${x.label}: ${x.value}`);
  const oldSpecs = new Set(fmt(before.specs));
  for (const s of fmt(after.specs)) if (!oldSpecs.has(s)) lines.push(`spec + ${s}`);
  const key = (v: ProductVariant) => `${v.color} ${v.storage}`.trim();
  const oldV = new Map(before.variants.map((v) => [key(v), v]));
  const newV = new Map(after.variants.map((v) => [key(v), v]));
  for (const [k, v] of newV) {
    const o = oldV.get(k);
    if (!o) lines.push(`variant + ${k} €${v.price} (stock ${v.stock})`);
    else if (o.price !== v.price) lines.push(`price ${k}: €${o.price} → €${v.price}`);
  }
  for (const k of oldV.keys()) if (!newV.has(k)) lines.push(`variant − ${k}`);
  const imgChanged = after.variants.filter((v) => oldV.get(key(v))?.image !== v.image).length;
  if (imgChanged) lines.push(`photos: ${imgChanged} variant photos replaced with Apple's official images`);
  return lines;
}

async function main() {
  const { rows } = await sql`SELECT * FROM products`;
  const current = new Map(
    rows.map((r) => [
      r.id as string,
      {
        ...(r as unknown as AdminProduct),
        createdAt: String(r.created_at),
        updatedAt: String(r.updated_at),
      },
    ])
  );

  const unknown = [...current.keys()].filter((id) => !catalog.some((e) => e.id === id));
  if (unknown.length) console.log(`Left untouched (not in this catalog): ${unknown.join(", ")}\n`);

  const planned = catalog.map((entry) => {
    const existing = current.get(entry.id);
    const product = {
      id: entry.id,
      name: entry.name,
      subtitle: entry.subtitle,
      image: entry.finishes[0].image,
      badge: entry.badge,
      // The shop has no review system, so ratings shown on the site must not be invented.
      rating: 0,
      reviews: 0,
      specs: entry.specs,
      description: entry.description,
      category: entry.category,
      variants: buildVariants(entry, existing),
    };
    return { entry, existing, product };
  });

  for (const { entry, existing, product } of planned) {
    const changes = describeChanges(existing, product);
    console.log(`── ${entry.name} (${entry.id})`);
    for (const c of changes) console.log(`   ${c}`);
  }

  if (!APPLY) {
    console.log("\nDry run. Re-run with --apply to write these changes.");
    return;
  }

  // Timestamped so a second run never overwrites the backup of the original data.
  const backup = `data/products-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  writeFileSync(backup, JSON.stringify(rows, null, 2));
  console.log(`\nBacked up ${rows.length} products to ${backup}`);

  for (const { entry, existing, product } of planned) {
    if (existing) {
      await sql`
        UPDATE products SET
          name = ${product.name}, subtitle = ${product.subtitle}, image = ${product.image},
          badge = ${product.badge ?? null}, rating = 0, reviews = 0,
          specs = ${JSON.stringify(product.specs)}, description = ${product.description},
          category = ${product.category}, variants = ${JSON.stringify(product.variants)},
          created_at = ${entry.released}, updated_at = NOW()
        WHERE id = ${product.id}`;
    } else {
      await sql`
        INSERT INTO products (id, name, subtitle, image, badge, rating, reviews, specs, description, category, variants, created_at, updated_at)
        VALUES (${product.id}, ${product.name}, ${product.subtitle}, ${product.image}, ${product.badge ?? null}, 0, 0,
                ${JSON.stringify(product.specs)}, ${product.description}, ${product.category},
                ${JSON.stringify(product.variants)}, ${entry.released}, NOW())`;
    }
  }
  console.log(`Wrote ${planned.length} products.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
