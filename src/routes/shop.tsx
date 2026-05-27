import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard, type Product } from "@/components/ProductCard";
import { brand } from "@/lib/brand";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: `Shop Electronics & Accessories - ${brand.name} Kenya` },
      { name: "description", content: "Browse phone cases, chargers, power banks, earphones and more. Buy online with M-Pesa." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { category, q } = Route.useSearch();

  const { data: cats = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("name,slug").order("name");
      return data ?? [];
    },
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", category, q],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("id,name,slug,price_kes,compare_at_price_kes,image_url,brand,stock,categories!inner(slug)");
      if (category) query = query.eq("categories.slug", category);
      if (q) query = query.ilike("name", `%${q}%`);
      const { data, error } = await query.order("featured", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });

  const activeCat = cats.find((c) => c.slug === category);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-accent">Home</Link> / <span>Shop</span>
          {activeCat && <> / <span className="text-foreground">{activeCat.name}</span></>}
        </div>
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          {activeCat ? activeCat.name : "All products"}
        </h1>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/shop"
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              !category ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card hover:border-accent"
            }`}
          >
            All
          </Link>
          {cats.map((c) => (
            <Link
              key={c.slug}
              to="/shop"
              search={{ category: c.slug }}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                category === c.slug ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card hover:border-accent"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {isLoading ? (
          <div className="mt-10 text-center text-muted-foreground">Loading…</div>
        ) : products.length === 0 ? (
          <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            No products found.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
