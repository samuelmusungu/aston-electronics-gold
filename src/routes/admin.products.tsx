import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ImageOff, Pencil, Trash2, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/cart";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

type Product = {
  id?: string;
  name: string;
  slug: string;
  brand: string | null;
  description: string | null;
  price_kes: number;
  compare_at_price_kes: number | null;
  stock: number;
  category_id: string | null;
  image_url: string | null;
  featured: boolean;
};

const empty: Product = {
  name: "",
  slug: "",
  brand: "",
  description: "",
  price_kes: 0,
  compare_at_price_kes: null,
  stock: 0,
  category_id: null,
  image_url: "",
  featured: false,
};

const IMAGE_BUCKET = "product-images";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function AdminProducts() {
  const qc = useQueryClient();
  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("name");
      if (error) throw error;
      return data as (Product & { categories: { name: string } | null })[];
    },
  });
  const { data: categories } = useQuery({
    queryKey: ["admin-categories-pick"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id,name").order("name");
      return data ?? [];
    },
  });

  const [editing, setEditing] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const save = async () => {
    if (!editing) return;
    if (!editing.name || !editing.price_kes) return toast.error("Name and price are required");
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
      brand: editing.brand || null,
      description: editing.description || null,
      image_url: editing.image_url || null,
      compare_at_price_kes: editing.compare_at_price_kes || null,
    };
    const res = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["featured-products"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  };

  const uploadImage = async (file: File) => {
    if (!editing) return;
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      toast.error("Use a JPG, PNG, WebP or AVIF image");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error("Image must be 5 MB or smaller");
      return;
    }

    setUploading(true);
    try {
      const ext =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase()
          .replace(/[^a-z0-9]/g, "") || "jpg";
      const baseName = editing.slug || slugify(editing.name) || crypto.randomUUID();
      const key = `products/${baseName}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(key, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(key);
      const imageUrl = `${data.publicUrl}?v=${Date.now()}`;

      if (editing.id) {
        const { error: updateError } = await supabase
          .from("products")
          .update({ image_url: imageUrl })
          .eq("id", editing.id);
        if (updateError) throw updateError;
        qc.invalidateQueries({ queryKey: ["admin-products"] });
        qc.invalidateQueries({ queryKey: ["products"] });
        qc.invalidateQueries({ queryKey: ["featured-products"] });
      }

      setImageLoadError(false);
      setEditing({ ...editing, image_url: imageUrl });
      toast.success(
        editing.id ? "Image uploaded and saved" : "Image uploaded. Save the product to publish it.",
      );
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <Button
          variant="hero"
          onClick={() => {
            setImageLoadError(false);
            setEditing({ ...empty });
          }}
        >
          <Plus className="h-4 w-4" /> New product
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {products?.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-secondary" />
                    )}
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.brand ?? "—"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.categories?.name ?? "—"}</td>
                <td className="px-4 py-3">{formatKES(Number(p.price_kes))}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">{p.featured ? "★" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setImageLoadError(false);
                      setEditing(p as Product);
                    }}
                    className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded hover:bg-secondary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(p.id!)}
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
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-3 sm:p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="my-4 w-full max-w-2xl rounded-xl border border-border bg-card p-4 sm:my-8 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-lg font-bold">
              {editing.id ? "Edit product" : "New product"}
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Field
                label="Name"
                value={editing.name}
                onChange={(v) =>
                  setEditing({ ...editing, name: v, slug: editing.id ? editing.slug : slugify(v) })
                }
              />
              <Field
                label="Slug"
                value={editing.slug}
                onChange={(v) => setEditing({ ...editing, slug: v })}
              />
              <Field
                label="Brand"
                value={editing.brand ?? ""}
                onChange={(v) => setEditing({ ...editing, brand: v })}
              />
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={editing.category_id ?? ""}
                  onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">— None —</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="Price (KES)"
                type="number"
                value={String(editing.price_kes)}
                onChange={(v) => setEditing({ ...editing, price_kes: Number(v) })}
              />
              <Field
                label="Compare-at price (KES)"
                type="number"
                value={String(editing.compare_at_price_kes ?? "")}
                onChange={(v) =>
                  setEditing({ ...editing, compare_at_price_kes: v ? Number(v) : null })
                }
              />
              <Field
                label="Stock"
                type="number"
                value={String(editing.stock)}
                onChange={(v) => setEditing({ ...editing, stock: Number(v) })}
              />
              <label className="flex items-end gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                />
                Featured on homepage
              </label>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  rows={3}
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Image</label>
                <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary text-muted-foreground">
                    {editing.image_url && !imageLoadError ? (
                      <img
                        src={editing.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                        onLoad={() => setImageLoadError(false)}
                        onError={() => setImageLoadError(true)}
                      />
                    ) : (
                      <ImageOff className="h-5 w-5" />
                    )}
                  </div>
                  <input
                    value={editing.image_url ?? ""}
                    onChange={(e) => {
                      setImageLoadError(false);
                      setEditing({ ...editing, image_url: e.target.value });
                    }}
                    placeholder="Paste image URL or upload"
                    className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                  <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm hover:bg-secondary">
                    <Upload className="h-4 w-4" />
                    {uploading ? "Uploading" : "Upload"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.currentTarget.value = "";
                        if (file) uploadImage(file);
                      }}
                    />
                  </label>
                </div>
                {imageLoadError && (
                  <p className="mt-2 text-xs text-destructive">
                    This image URL is not loading publicly yet. Check the URL or storage policy
                    before saving.
                  </p>
                )}
              </div>
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
