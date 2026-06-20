import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/refunds")({
  head: () => ({ meta: [{ title: "Refund & Shipping — Ashley Brooke" }]}),
  component: () => (
    <PageShell kicker="Store policy" title="Refund & Shipping">
      <div className="max-w-3xl space-y-5 text-muted-foreground leading-relaxed">
        <h2 className="text-foreground font-display text-2xl">Shipping</h2>
        <p>All physical merchandise ships from the United States. Domestic orders typically arrive within 5–10 business days. International shipping times vary by destination.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Returns</h2>
        <p>Unused merchandise may be returned within 30 days of delivery for a full refund of the item price. Buyer is responsible for return shipping unless the item is defective.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Damaged items</h2>
        <p>Email orders@ashleybrookemusic.com within 7 days of delivery with photos and we'll make it right.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Digital purchases</h2>
        <p>Digital downloads and stream credits are non-refundable once delivered.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Sales tax</h2>
        <p>Applicable U.S. state and local sales tax is calculated at checkout in accordance with state law.</p>
      </div>
    </PageShell>
  ),
});
