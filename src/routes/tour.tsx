import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/tour")({
  head: () => ({ meta: [
    { title: "Tour — Ashley Brooke" },
    { name: "description", content: "Upcoming Ashley Brooke tour dates and tickets." },
  ]}),
  component: () => (
    <PageShell kicker="On the road" title="Live Dates">
      <div className="py-20 text-center border border-border rounded-sm">
        <p className="font-display text-4xl mb-4">Tour dates coming soon</p>
        <p className="text-muted-foreground max-w-md mx-auto">
          Ashley is finalizing her upcoming live schedule. Check back soon, or
          subscribe on the contact page to be the first to know.
        </p>
      </div>
    </PageShell>
  ),
});
