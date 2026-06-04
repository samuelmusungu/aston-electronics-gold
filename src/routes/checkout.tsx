import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Smartphone, Banknote } from "lucide-react";
import { toast } from "sonner";
import { useCart, formatKES } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: `Checkout - ${brand.name}` }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    delivery_address: "",
    delivery_city: "Naivasha",
    notes: "",
    payment_method: "mpesa" as "mpesa" | "cod",
  });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Your cart is empty");
    setSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          customer_email: form.customer_email || null,
          delivery_address: form.delivery_address,
          delivery_city: form.delivery_city,
          notes: form.notes || null,
          total_kes: total,
          payment_method: form.payment_method,
        })
        .select()
        .single();
      if (error) throw error;

      const { error: itemsErr } = await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          product_id: i.id,
          product_name: i.name,
          unit_price_kes: i.price_kes,
          quantity: i.quantity,
        })),
      );
      if (itemsErr) throw itemsErr;

      clear();
      setOrderId(order.id);
      toast.success("Order placed successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-6">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
          <h1 className="mt-6 font-display text-3xl font-bold">Order confirmed!</h1>
          <p className="mt-3 text-muted-foreground">
            Order ID:{" "}
            <span className="font-mono text-foreground">{orderId.slice(0, 8).toUpperCase()}</span>
          </p>
          <p className="mt-2 text-muted-foreground">
            We've received your order.{" "}
            {form.payment_method === "mpesa"
              ? "Check your phone for the M-Pesa STK push prompt."
              : "Pay cash on delivery."}{" "}
            Our team will contact you shortly to confirm delivery.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild variant="hero">
              <Link to="/shop">Continue shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Checkout</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild className="mt-4">
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
              <div>
                <h2 className="font-display text-lg font-bold">Delivery details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    required
                    value={form.customer_name}
                    onChange={(v) => update("customer_name", v)}
                  />
                  <Field
                    label="Phone (M-Pesa)"
                    required
                    type="tel"
                    placeholder="07XX XXX XXX"
                    value={form.customer_phone}
                    onChange={(v) => update("customer_phone", v)}
                  />
                  <Field
                    label="Email (optional)"
                    type="email"
                    value={form.customer_email}
                    onChange={(v) => update("customer_email", v)}
                  />
                  <Field
                    label="Town / City"
                    required
                    value={form.delivery_city}
                    onChange={(v) => update("delivery_city", v)}
                  />
                  <div className="sm:col-span-2">
                    <Field
                      label="Delivery address"
                      required
                      value={form.delivery_address}
                      onChange={(v) => update("delivery_address", v)}
                      placeholder="Estate, building, house number"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">Order notes (optional)</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-display text-lg font-bold">Payment method</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <PayOption
                    icon={Smartphone}
                    label="M-Pesa"
                    description="STK push to your phone"
                    value="mpesa"
                    current={form.payment_method}
                    onChange={(v) => update("payment_method", v)}
                  />
                  <PayOption
                    icon={Banknote}
                    label="Cash on Delivery"
                    description="Pay when you receive"
                    value="cod"
                    current={form.payment_method}
                    onChange={(v) => update("payment_method", v)}
                  />
                </div>
                {form.payment_method === "mpesa" && (
                  <p className="mt-3 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
                    Note: M-Pesa STK push activation requires Daraja API credentials. After placing
                    the order, our team will send a manual M-Pesa prompt to your phone.
                  </p>
                )}
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-bold">Order summary</h2>
              <div className="mt-4 space-y-2 max-h-72 overflow-auto">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="line-clamp-1 pr-2">
                      {i.name} x {i.quantity}
                    </span>
                    <span className="font-medium">{formatKES(i.price_kes * i.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatKES(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>{total >= 3000 ? "Free" : "TBD"}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-bold">
                  <span>Total</span>
                  <span>{formatKES(total)}</span>
                </div>
              </div>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="mt-6 w-full"
                disabled={submitting}
              >
                {submitting ? "Placing order..." : `Place order - ${formatKES(total)}`}
              </Button>
            </aside>
          </form>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}

function PayOption({
  icon: Icon,
  label,
  description,
  value,
  current,
  onChange,
}: {
  icon: typeof Smartphone;
  label: string;
  description: string;
  value: "mpesa" | "cod";
  current: "mpesa" | "cod";
  onChange: (value: "mpesa" | "cod") => void;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
        active
          ? "border-accent bg-accent/5 shadow-[var(--shadow-glow)]"
          : "border-border bg-background hover:border-accent/50"
      }`}
    >
      <div
        className={`grid h-10 w-10 place-items-center rounded-lg ${active ? "bg-accent text-accent-foreground" : "bg-secondary"}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </button>
  );
}
