import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/returns")({
  head: () => ({ meta: [{ title: `Returns Policy - ${brand.name}` }] }),
  component: ReturnsPage,
});

function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Returns Policy</h1>
        <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
          <p>
            Returns are accepted within 7 days for eligible items that are unused, undamaged, and
            returned with their original packaging.
          </p>
          <p>
            If an item arrives faulty or incorrect, contact us as soon as possible with your order
            details so we can arrange a replacement, repair, or refund review.
          </p>
          <p>
            Delivery fees may be non-refundable unless the issue was caused by an incorrect or
            defective item supplied by {brand.name}.
          </p>
          <p>
            Start a return through WhatsApp on {brand.phone} or email {brand.email}.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
