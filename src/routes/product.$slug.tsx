import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ShoppingCart, Minus, Plus, Truck, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCart, formatKES } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/product/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name,slug)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="grid min-h-screen place-items-center">Loading…</div>;
  if (!product)
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          <p className="text-muted-foreground">Product not found.</p>
          <Button asChild className="mt-4">
            <Link to="/shop">Back to shop</Link>
          </Button>
        </div>
      </div>
    );

  const discount =
    product.compare_at_price_kes && product.compare_at_price_kes > product.price_kes
      ? Math.round(
          ((product.compare_at_price_kes - product.price_kes) / product.compare_at_price_kes) * 100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-accent">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/shop" className="hover:text-accent">
            Shop
          </Link>{" "}
          / <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 grid place-items-center text-7xl font-bold text-muted-foreground/15">
              {product.name.charAt(0)}
            </div>
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1.5 text-sm font-bold text-accent-foreground">
                -{discount}% OFF
              </span>
            )}
          </div>

          <div>
            {product.brand && (
              <div className="text-sm uppercase tracking-wider text-muted-foreground">
                {product.brand}
              </div>
            )}
            <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">{product.name}</h1>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold">
                {formatKES(Number(product.price_kes))}
              </span>
              {product.compare_at_price_kes && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatKES(Number(product.compare_at_price_kes))}
                </span>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex items-center gap-2 text-sm">
              {product.stock > 0 ? (
                <>
                  <Check className="h-4 w-4 text-success" />{" "}
                  <span className="font-medium text-success">In stock</span>{" "}
                  <span className="text-muted-foreground">({product.stock} available)</span>
                </>
              ) : (
                <span className="font-medium text-destructive">Out of stock</span>
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-11 w-11 place-items-center hover:bg-secondary"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-11 w-11 place-items-center hover:bg-secondary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
                disabled={product.stock <= 0}
                onClick={() => {
                  add(
                    {
                      id: product.id,
                      name: product.name,
                      price_kes: Number(product.price_kes),
                      image_url: product.image_url,
                    },
                    qty,
                  );
                  toast.success(`Added ${qty} × ${product.name} to cart`);
                }}
              >
                <ShoppingCart className="h-5 w-5" /> Add to cart
              </Button>
              <Button
                variant="navy"
                size="lg"
                disabled={product.stock <= 0}
                onClick={() => {
                  add(
                    {
                      id: product.id,
                      name: product.name,
                      price_kes: Number(product.price_kes),
                      image_url: product.image_url,
                    },
                    qty,
                  );
                  navigate({ to: "/checkout" });
                }}
              >
                Buy now
              </Button>
            </div>

            <div className="mt-8 grid gap-3 rounded-xl border border-border bg-card p-5 text-sm">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-accent" /> Free delivery on orders over KES 3,000
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-accent" /> 7-day return policy on all items
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
