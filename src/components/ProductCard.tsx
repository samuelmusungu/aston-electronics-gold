import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart, formatKES } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export type Product = {
  id: string;
  name: string;
  slug: string;
  price_kes: number;
  compare_at_price_kes: number | null;
  image_url: string | null;
  brand: string | null;
  stock: number;
};

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const [imageFailed, setImageFailed] = useState(false);
  const discount =
    p.compare_at_price_kes && p.compare_at_price_kes > p.price_kes
      ? Math.round(((p.compare_at_price_kes - p.price_kes) / p.compare_at_price_kes) * 100)
      : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link
        to="/product/$slug"
        params={{ slug: p.slug }}
        className="relative block aspect-square overflow-hidden bg-secondary"
      >
        {p.image_url && !imageFailed ? (
          <img
            src={p.image_url}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-4xl font-bold text-muted-foreground/20">
            {p.name.charAt(0)}
          </div>
        )}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
            -{discount}%
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {p.brand && (
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand}</div>
        )}
        <Link
          to="/product/$slug"
          params={{ slug: p.slug }}
          className="mt-1 line-clamp-2 font-medium hover:text-accent"
        >
          {p.name}
        </Link>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold">{formatKES(p.price_kes)}</span>
          {p.compare_at_price_kes && (
            <span className="text-sm text-muted-foreground line-through">
              {formatKES(p.compare_at_price_kes)}
            </span>
          )}
        </div>
        <Button
          variant="navy"
          size="sm"
          className="mt-4"
          onClick={() =>
            add({ id: p.id, name: p.name, price_kes: Number(p.price_kes), image_url: p.image_url })
          }
          disabled={p.stock <= 0}
        >
          <ShoppingCart className="h-4 w-4" />
          {p.stock <= 0 ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
}
