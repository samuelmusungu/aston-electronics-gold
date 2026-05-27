import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: `Privacy Policy - ${brand.name}` }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Privacy Policy</h1>
        <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
          <p>{brand.name} collects only the information needed to process orders, arrange delivery, provide support, and improve the shopping experience.</p>
          <p>Order details may include your name, phone number, email address, delivery location, cart items, and payment method. We do not sell customer data.</p>
          <p>Payment processing should be handled through trusted providers such as Safaricom Daraja for M-Pesa, with credentials kept securely outside the browser.</p>
          <p>To request corrections or deletion of your customer details, contact {brand.email}.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
