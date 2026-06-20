import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import aboutImg from "@/assets/ashley-elephant.jpg.asset.json";
import portraitImg from "@/assets/ashley-river.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About — Ashley Brooke" },
    { name: "description", content: "Singer-songwriter Ashley Brooke runs her own label, studio, and team." },
  ]}),
  component: () => (
    <PageShell kicker="The story" title="About Ashley">
      <div className="grid gap-12 md:grid-cols-2 items-start">
        <div className="space-y-6">
          <img src={portraitImg.url} alt="Ashley Brooke" className="rounded-sm w-full" />
          <img src={aboutImg.url} alt="Ashley Brooke" className="rounded-sm w-full" />
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>Ashley Brooke is a singer-songwriter and the founder of her own independent music studio. She writes, records, produces, and releases her music on her own terms — and she runs the business that makes it possible.</p>
          <p>From the songwriting desk to the storefront, every piece of the operation runs through her studio. She builds the team, hires the marketers and sales staff, books the tours, signs the checks, and keeps the books.</p>
          <p>This site is the front door. Behind it is a working studio.</p>
        </div>
      </div>
    </PageShell>
  ),
});
