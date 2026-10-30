"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Banknote, Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { placeOrderAction } from "@/actions/orders";
import { useLocale } from "@/components/LocaleProvider";
import { formatPrice } from "@/lib/catalog";
import { useShop } from "./ShopProvider";
import Vitrine from "./Vitrine";

const CITIES = [
  "Prishtinë", "Prizren", "Pejë", "Gjakovë", "Ferizaj", "Gjilan", "Mitrovicë",
  "Podujevë", "Vushtrri", "Suharekë", "Rahovec", "Drenas", "Lipjan", "Malishevë",
  "Kamenicë", "Viti", "Deçan", "Istog", "Klinë", "Skenderaj", "Dragash", "Fushë Kosovë",
];

type Field = {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete: string;
  inputMode?: "tel" | "email";
  hint?: string;
  list?: string;
  wide?: boolean;
};

export default function CheckoutView() {
  const t = useTranslations("Checkout");
  const { locale } = useLocale();
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useShop();
  const [status, setStatus] = useState<"idle" | "placing">("idle");
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<{ orderId: string; phone: string } | null>(null);

  if (placed) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-ok text-white"
        >
          <Check className="h-10 w-10" strokeWidth={2.5} />
        </motion.span>
        <h1 className="font-semibold leading-none mt-8 text-5xl">{t("successTitle")}</h1>
        <p className="mt-4 text-lg">{t("successBody", placed)}</p>
        <Link href="/products" className="mt-8 rounded-full bg-fg text-night px-7 py-3.5 text-base font-semibold">
          {t("keepShopping")}
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 px-4 py-32 text-center">
        <p className="text-lg">{t("empty")}</p>
        <Link href="/products" className="rounded-full bg-fg text-night px-6 py-3 text-[15px] font-medium">
          {t("browse")}
        </Link>
      </div>
    );
  }

  const contact: Field[] = [
    { name: "firstName", label: t("firstName"), required: true, autoComplete: "given-name" },
    { name: "lastName", label: t("lastName"), required: true, autoComplete: "family-name" },
    { name: "phone", label: t("phone"), required: true, type: "tel", autoComplete: "tel", inputMode: "tel", hint: t("phoneHint"), wide: true },
    { name: "email", label: t("email"), required: true, type: "email", autoComplete: "email", inputMode: "email", wide: true },
  ];
  const address: Field[] = [
    { name: "address", label: t("address"), required: true, autoComplete: "street-address", wide: true },
    { name: "city", label: t("city"), required: true, autoComplete: "address-level2", list: "kosovo-cities" },
    { name: "zipCode", label: t("zipCode"), autoComplete: "postal-code" },
    { name: "state", label: t("region"), autoComplete: "address-level1", wide: true },
  ];

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();
    if ([...contact, ...address].some((f) => f.required && !get(f.name))) {
      setError(t("required"));
      return;
    }
    setError("");
    setStatus("placing");
    try {
      const result = await placeOrderAction({
        items: cart.map((l) => ({ productId: l.productId, color: l.color, storage: l.storage, quantity: l.quantity })),
        customer: {
          firstName: get("firstName"),
          lastName: get("lastName"),
          phone: get("phone"),
          email: get("email"),
          address: get("address"),
          city: get("city"),
          state: get("state"),
          zipCode: get("zipCode"),
        },
      });
      if (result.success) {
        clearCart();
        setPlaced({ orderId: result.orderId, phone: get("phone") });
        window.scrollTo({ top: 0 });
      } else if (result.error === "changed") {
        setError(t("changed"));
        router.refresh();
      } else {
        setError(t("required"));
      }
    } catch {
      setError(t("failed"));
    } finally {
      setStatus("idle");
    }
  }

  const renderField = (f: Field) => (
    <label key={f.name} className={`block ${f.wide ? "sm:col-span-2" : ""}`}>
      <span className="text-[15px] font-medium">
        {f.label}
        {f.required && <span className="text-brand"> *</span>}
      </span>
      <input
        name={f.name}
        type={f.type ?? "text"}
        required={f.required}
        autoComplete={f.autoComplete}
        inputMode={f.inputMode}
        list={f.list}
        className="mt-1.5 h-13 w-full rounded-2xl border border-edge bg-panel px-4 py-3.5 text-base outline-none transition-colors focus:border-fg"
      />
      {f.hint && <span className="mt-1.5 block text-sm text-dim">{f.hint}</span>}
    </label>
  );

  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:pt-16">
      <Link href="/products" className="text-sm text-dim hover:text-fg">
        {t("back")}
      </Link>
      <h1 className="font-semibold leading-none mt-3 text-[clamp(2.75rem,7vw,5.5rem)]">{t("title")}</h1>

      <form onSubmit={submit} noValidate className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
        <div className="space-y-10">
          <fieldset>
            <legend className="font-semibold text-2xl">{t("contact")}</legend>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">{contact.map(renderField)}</div>
          </fieldset>

          <fieldset>
            <legend className="font-semibold text-2xl">{t("delivery")}</legend>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">{address.map(renderField)}</div>
            <datalist id="kosovo-cities">
              {CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </fieldset>

          <fieldset>
            <legend className="font-semibold text-2xl">{t("payment")}</legend>
            <div className="mt-5 flex items-start gap-4 rounded-2xl border-2 border-fg bg-panel p-5">
              <Banknote className="mt-0.5 h-6 w-6 shrink-0" strokeWidth={1.75} />
              <div>
                <p className="font-semibold">{t("cash")}</p>
                <p className="mt-1 text-[15px] text-dim">{t("cashDesc")}</p>
              </div>
            </div>
          </fieldset>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[28px] bg-panel p-6">
            <h2 className="font-semibold text-xl">{t("summary")}</h2>
            <ul className="mt-5 space-y-4">
              {cart.map((l) => (
                <li key={`${l.productId}-${l.color}-${l.storage}`} className="flex gap-3">
                  <Vitrine glow={l.colorHex} src={l.image} alt="" sizes="64px" className="h-16 w-16 shrink-0 rounded-xl" imageClassName="object-contain p-1.5" />
                  <div className="min-w-0 flex-1 text-[15px]">
                    <p className="truncate font-semibold">{l.name}</p>
                    <p className="text-sm text-dim">
                      {[l.color, l.storage].filter(Boolean).join(", ")}
                    </p>
                    <p className="text-sm text-dim">{t("qty", { quantity: l.quantity })}</p>
                  </div>
                  <p className="text-[15px] font-semibold tabular-nums">{formatPrice(l.price * l.quantity, locale)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 border-t border-edge pt-4 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-dim">{t("subtotal")}</dt>
                <dd className="tabular-nums">{formatPrice(cartTotal, locale)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dim">{t("deliveryFee")}</dt>
                <dd className="text-ok">{t("free")}</dd>
              </div>
              <div className="flex justify-between pt-2 text-lg font-semibold">
                <dt>{t("total")}</dt>
                <dd className="tabular-nums">{formatPrice(cartTotal, locale)}</dd>
              </div>
            </dl>

            {error && (
              <p role="alert" className="mt-4 rounded-2xl bg-brand/10 p-3 text-[15px] text-brand">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "placing"}
              className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand text-base font-semibold text-white shadow-[0_10px_40px_-12px] shadow-brand/70 transition-transform active:scale-[0.98] disabled:opacity-70"
            >
              {status === "placing" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> {t("placing")}
                </>
              ) : (
                t("placeOrder", { amount: formatPrice(cartTotal, locale) })
              )}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
