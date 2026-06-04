import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact - ${brand.name} Kenya` },
      {
        name: "description",
        content: `Get in touch with ${brand.name}. WhatsApp, phone or email.`,
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const socials = [
    { href: brand.social.instagram, label: "Instagram", icon: Instagram },
    { href: brand.social.tiktok, label: "TikTok", icon: Music2 },
    { href: brand.social.facebook, label: "Facebook", icon: Facebook },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Talk to us</h1>
        <p className="mt-2 text-muted-foreground">
          We reply fast — usually within an hour during business hours.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <a
            href={brand.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border-2 border-border bg-card p-6 transition-all hover:border-accent hover:shadow-[var(--shadow-glow)]"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-success text-success-foreground">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">WhatsApp</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Fastest way to reach us. Tap to start a chat.
            </p>
            <p className="mt-3 font-semibold text-accent group-hover:underline">{brand.phone} →</p>
          </a>
          <a
            href={brand.phoneHref}
            className="group rounded-2xl border-2 border-border bg-card p-6 transition-all hover:border-accent hover:shadow-[var(--shadow-glow)]"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">Call us</h3>
            <p className="mt-1 text-sm text-muted-foreground">Mon-Sat, 8am-7pm</p>
            <p className="mt-3 font-semibold text-accent group-hover:underline">{brand.phone}</p>
          </a>
          <a
            href={brand.emailHref}
            className="group rounded-2xl border-2 border-border bg-card p-6 transition-all hover:border-accent"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">Email</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              For order issues & wholesale inquiries.
            </p>
            <p className="mt-3 font-semibold text-accent group-hover:underline">{brand.email}</p>
          </a>
          <div className="rounded-2xl border-2 border-border bg-card p-6">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">Visit / pickup</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pickup details are shared after order confirmation.
            </p>
            <p className="mt-3 font-semibold">{brand.location}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Follow Aston Electronics</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-accent hover:bg-accent/5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent">
                  <social.icon className="h-5 w-5" />
                </span>
                <span className="font-semibold">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
