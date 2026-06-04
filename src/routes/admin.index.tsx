import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Tags, ShoppingBag, Banknote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatKES } from "@/lib/cart";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [p, c, o, rev] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total_kes").neq("status", "cancelled"),
      ]);
      const revenue = ((rev.data ?? []) as { total_kes: number | string }[]).reduce(
        (s, r) => s + Number(r.total_kes),
        0,
      );
      return {
        products: p.count ?? 0,
        categories: c.count ?? 0,
        orders: o.count ?? 0,
        revenue,
      };
    },
  });

  const cards = [
    { label: "Products", value: data?.products ?? 0, icon: Package },
    { label: "Categories", value: data?.categories ?? 0, icon: Tags },
    { label: "Orders", value: data?.orders ?? 0, icon: ShoppingBag },
    { label: "Revenue", value: data ? formatKES(data.revenue) : "—", icon: Banknote },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">At-a-glance numbers for your shop.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-3 font-display text-2xl font-bold">{isLoading ? "…" : c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
