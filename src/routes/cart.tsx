import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, formatKES } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: `Your Cart - ${brand.name}` }] }),
  component: CartPage,
});

function CartPage() {
  const { items, update, remove, total } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
            <Button asChild variant="hero" className="mt-6">
              <Link to="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {items.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary">
                    {i.image_url ? (
                      <img src={i.image_url} alt={i.name} className="h-full w-full object-cover" />
                    ) : (
                      i.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="line-clamp-2 font-medium">{i.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {formatKES(i.price_kes)} each
                    </div>
                  </div>
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      onClick={() => update(i.id, i.quantity - 1)}
                      className="grid h-9 w-9 place-items-center hover:bg-secondary"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{i.quantity}</span>
                    <button
                      onClick={() => update(i.id, i.quantity + 1)}
                      className="grid h-9 w-9 place-items-center hover:bg-secondary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="hidden w-24 text-right font-semibold sm:block">
                    {formatKES(i.price_kes * i.quantity)}
                  </div>
                  <button
                    onClick={() => remove(i.id)}
                    className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-bold">Order summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatKES(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">
                    {total >= 3000 ? "Free" : "Calculated at checkout"}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-border pt-4">
                <span className="font-display font-bold">Total</span>
                <span className="font-display text-xl font-bold">{formatKES(total)}</span>
              </div>
              <Button asChild variant="hero" size="lg" className="mt-6 w-full">
                <Link to="/checkout">Proceed to checkout</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
                <Link to="/shop">Continue shopping</Link>
              </Button>
            </aside>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
