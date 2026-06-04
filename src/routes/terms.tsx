import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: `Terms & Conditions - ${brand.name}` }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Terms & Conditions</h1>
        <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
          <p>
            Orders placed through {brand.name} are subject to product availability, confirmed
            pricing, and successful payment or delivery confirmation.
          </p>
          <p>
            Customers are responsible for providing accurate delivery details and a reachable phone
            number. We may contact you to confirm your order before dispatch.
          </p>
          <p>
            Product photos and descriptions are provided to help you choose the right item. Minor
            packaging or model variations may occur depending on supplier stock.
          </p>
          <p>
            For help with an order, contact us at {brand.phone} or {brand.email}.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
