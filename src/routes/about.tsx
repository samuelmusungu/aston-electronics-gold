import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, ShieldCheck, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About - ${brand.name} Kenya` },
      {
        name: "description",
        content: `${brand.name} is Kenya's trusted destination for genuine electronics and mobile accessories.`,
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6 md:py-24">
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Built for the way Kenya shops mobile.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/75">
            {brand.name} brings genuine, well-priced electronics and mobile accessories to your
            doorstep with M-Pesa checkout and reliable countrywide delivery.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Award,
              t: "Genuine products",
              s: "We stock authentic brands like Oraimo, Anker, JBL, Spigen — never fakes.",
            },
            {
              icon: Truck,
              t: "Fast delivery",
              s: "Fast dispatch from Naivasha, 1-3 days countrywide via trusted couriers.",
            },
            {
              icon: ShieldCheck,
              t: "Easy returns",
              s: "7-day no-questions return policy on all items.",
            },
            {
              icon: Heart,
              t: "Kenyan first",
              s: "Built in Kenya, for Kenyans. M-Pesa, COD and friendly support.",
            },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl border border-border bg-card p-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.s}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-secondary p-10 md:p-14">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Our story</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            {brand.name} started with a simple frustration: finding genuine, affordable electronics
            and mobile accessories in Kenya was harder than it should be. We built this shop to fix
            that with curated stock, fair prices, and checkout that works for Kenyans, including
            M-Pesa. Whether you need a power bank for the commute or earbuds for the gym, we've got
            you.
          </p>
          <Button asChild variant="hero" className="mt-6">
            <Link to="/shop">Browse the shop</Link>
          </Button>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
