import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

type Cat = { id: string; name: string; slug: string; icon: string | null };

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function AdminCategories() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data as Cat[];
    },
  });

  const [editing, setEditing] = useState<Partial<Cat> | null>(null);

  const save = async () => {
    if (!editing?.name) return toast.error("Name is required");
    const payload = {
      name: editing.name,
      slug: editing.slug || slugify(editing.name),
      icon: editing.icon || null,
    };
    const res = editing.id
      ? await supabase.from("categories").update(payload).eq("id", editing.id)
      : await supabase.from("categories").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
        <Button variant="hero" onClick={() => setEditing({})}>
          <Plus className="h-4 w-4" /> New
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Icon</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {data?.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.icon ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditing(c)}
                    className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded hover:bg-secondary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-lg font-bold">
              {editing.id ? "Edit category" : "New category"}
            </h2>
            <div className="mt-4 space-y-3">
              <Field
                label="Name"
                value={editing.name ?? ""}
                onChange={(v) =>
                  setEditing({ ...editing, name: v, slug: editing.id ? editing.slug : slugify(v) })
                }
              />
              <Field
                label="Slug"
                value={editing.slug ?? ""}
                onChange={(v) => setEditing({ ...editing, slug: v })}
              />
              <Field
                label="Icon (emoji or name)"
                value={editing.icon ?? ""}
                onChange={(v) => setEditing({ ...editing, icon: v })}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button variant="hero" onClick={save}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
