import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatKES } from "@/lib/cart";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

type AdminOrder = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  delivery_city: string;
  total_kes: number | string;
  payment_method: string;
  status: Status;
  notes: string | null;
};

type AdminOrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price_kes: number | string;
};

const STATUS_STYLES: Record<Status, string> = {
  pending: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  paid: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  shipped: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  delivered: "bg-green-500/15 text-green-700 dark:text-green-400",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-400",
};

function AdminOrders() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", filter],
    queryFn: async () => {
      let q = supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as AdminOrder[];
    },
  });

  const { data: items } = useQuery({
    queryKey: ["admin-order-items", expanded],
    queryFn: async () => {
      if (!expanded) return [];
      const { data } = await supabase.from("order_items").select("*").eq("order_id", expanded);
      return (data ?? []) as AdminOrderItem[];
    },
    enabled: !!expanded,
  });

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${status}`);
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filter === s
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="w-8 px-2 py-3"></th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {orders?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  No orders.
                </td>
              </tr>
            )}
            {orders?.map((o) => (
              <Fragment key={o.id}>
                <tr key={o.id} className="border-t border-border">
                  <td className="px-2 py-3">
                    <button
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                      className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-secondary"
                    >
                      {expanded === o.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs">#{o.id.slice(0, 8)}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatKES(Number(o.total_kes))}</td>
                  <td className="px-4 py-3 uppercase text-xs">{o.payment_method}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[o.status as Status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value as Status)}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="capitalize">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                {expanded === o.id && (
                  <tr className="bg-secondary/30">
                    <td></td>
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Delivery
                          </div>
                          <div className="mt-1 text-sm">{o.delivery_address}</div>
                          <div className="text-sm text-muted-foreground">{o.delivery_city}</div>
                          {o.customer_email && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              {o.customer_email}
                            </div>
                          )}
                          {o.notes && (
                            <div className="mt-2 text-xs italic text-muted-foreground">
                              Note: {o.notes}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Items
                          </div>
                          <ul className="mt-1 space-y-1 text-sm">
                            {items?.map((it) => (
                              <li key={it.id} className="flex justify-between">
                                <span>
                                  {it.product_name} × {it.quantity}
                                </span>
                                <span className="font-medium">
                                  {formatKES(Number(it.unit_price_kes) * it.quantity)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
