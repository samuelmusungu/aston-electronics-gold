import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Smartphone,
  Headphones,
  BatteryCharging,
  Cable,
  Shield,
  CarFront,
  Speaker,
  Watch,
  Instagram,
  Facebook,
  Music2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard, type Product } from "@/components/ProductCard";
import { brand } from "@/lib/brand";
import { categoryImages } from "@/lib/categoryImages";
import heroImg from "@/assets/hero-accessories.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${brand.name} - Electronics & Mobile Accessories Kenya` },
      {
        name: "description",
        content:
          "Premium electronics, phone cases, chargers, power banks and audio gear. Pay with M-Pesa, fast delivery from Naivasha.",
      },
    ],
  }),
  component: HomePage,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Cable,
  BatteryCharging,
  Headphones,
  Shield,
  CarFront,
  Speaker,
  Watch,
};

function HomePage() {
  const { data: featured = [] } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,price_kes,compare_at_price_kes,image_url,brand,stock")
        .eq("featured", true)
        .limit(8);
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("name,slug,icon")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              Same-day dispatch from Naivasha
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
              Power up your
              <br />
              <span className="text-accent">mobile life.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-primary-foreground/75 md:text-lg">
              Premium electronics, phone cases, fast chargers, power banks, and audio gear delivered
              across Kenya. Pay with M-Pesa or cash on delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/shop">
                  Shop now <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/about">Why Aston?</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Aston Electronics on Instagram"
                className="grid h-10 w-10 place-items-center rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={brand.social.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="Aston Electronics on TikTok"
                className="grid h-10 w-10 place-items-center rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <Music2 className="h-5 w-5" />
              </a>
              <a
                href={brand.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Aston Electronics on Facebook"
                className="grid h-10 w-10 place-items-center rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-xs text-primary-foreground/70">
              <div>
                <div className="font-display text-2xl font-bold text-accent">500+</div>Products
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-accent">24h</div>Fast dispatch
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-accent">M-Pesa</div>Easy
                checkout
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 rounded-[2rem] bg-accent/20 blur-3xl" />
            <img
              src={heroImg}
              alt="Premium mobile accessories — phone, cable, earbuds and power bank"
              width={1600}
              height={1024}
              className="relative rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 md:px-6">
          {[
            { icon: Truck, t: "Fast delivery", s: "Naivasha dispatch, countrywide 1-3 days" },
            { icon: ShieldCheck, t: "Genuine products", s: "Authentic brands, 7-day returns" },
            { icon: BatteryCharging, t: "M-Pesa & COD", s: "Pay how you want, securely" },
          ].map((f) => (
            <div key={f.t} className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{f.t}</div>
                <div className="text-sm text-muted-foreground">{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Shop by category</h2>
            <p className="mt-2 text-muted-foreground">Find exactly what your phone needs.</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => {
            const Icon = ICONS[c.icon ?? ""] ?? Smartphone;
            const categoryImage = categoryImages[c.slug];
            return (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.slug }}
                className="group overflow-hidden rounded-xl border border-border bg-card text-center transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-glow)]"
              >
                {categoryImage ? (
                  <div className="aspect-[4/3] w-full bg-secondary">
                    <img
                      src={categoryImage}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="grid aspect-[4/3] w-full place-items-center bg-secondary text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="h-8 w-8" />
                  </div>
                )}
                <div className="flex min-h-14 items-center justify-center px-3 py-3">
                  <span className="text-xs font-medium leading-tight">{c.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Featured products</h2>
            <p className="mt-2 text-muted-foreground">Top picks our customers love.</p>
          </div>
          <Link
            to="/shop"
            className="hidden items-center gap-1 text-sm font-semibold text-accent hover:underline sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Need help finding the right accessory?
            </h2>
            <p className="mt-3 text-primary-foreground/75">
              Chat with us on WhatsApp and we'll match you to the perfect fit for your phone.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-6">
              <a href={brand.whatsappHref} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
