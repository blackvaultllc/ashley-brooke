import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import positiveVibes from "@/assets/cover-positive-vibes.jpg.asset.json";
import paidToExist from "@/assets/cover-paid-to-exist.jpg.asset.json";
import glitter from "@/assets/cover-glitter.jpg.asset.json";
import blessed from "@/assets/cover-blessed.jpg.asset.json";
import { Play } from "lucide-react";

const releases = [
  { title: "Positive Vibes", year: "2026", art: positiveVibes.url, kind: "Album" },
  { title: "I Get Paid to Exist", year: "2025", art: paidToExist.url, kind: "Single" },
  { title: "I Always Get What I Want", year: "2025", art: glitter.url, kind: "Single" },
  { title: "Blessed Never Stressed", year: "2024", art: blessed.url, kind: "Single" },
];

export const Route = createFileRoute("/music")({
  head: () => ({ meta: [
    { title: "Music — Ashley Brooke" },
    { name: "description", content: "Stream Ashley Brooke's latest album, singles, and discography." },
  ]}),
  component: () => (
    <PageShell kicker="Discography" title="The Music">
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] items-start mb-20">
        <img src={positiveVibes.url} alt="Positive Vibes" className="rounded-sm w-full shadow-2xl" />
        <div>
          <p className="text-xs uppercase tracking-widest text-accent mb-2">Latest album · 2026</p>
          <h2 className="font-display text-4xl font-bold mb-3">Positive Vibes</h2>
          <p className="text-muted-foreground mb-6">Written, produced, and sung by Ashley Brooke.</p>
          <div className="flex gap-3 flex-wrap">
            <a href="#" className="rounded-full bg-foreground text-background px-5 py-2 text-sm uppercase tracking-widest">Spotify</a>
            <a href="#" className="rounded-full border border-border px-5 py-2 text-sm uppercase tracking-widest">Apple Music</a>
            <a href="#" className="rounded-full border border-border px-5 py-2 text-sm uppercase tracking-widest">YouTube</a>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-accent mb-2">Discography</p>
        <h3 className="font-display text-3xl font-bold">All releases</h3>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {releases.map((r) => (
          <div key={r.title} className="group">
            <div className="relative overflow-hidden rounded-sm">
              <img src={r.art} alt={r.title} className="w-full aspect-square object-cover transition group-hover:scale-105" />
              <button className="absolute inset-0 m-auto h-14 w-14 rounded-full bg-accent text-accent-foreground opacity-0 group-hover:opacity-100 transition flex items-center justify-center" aria-label={`Play ${r.title}`}>
                <Play size={20} />
              </button>
            </div>
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{r.kind} · {r.year}</p>
            <p className="font-display text-lg font-bold">{r.title}</p>
          </div>
        ))}
      </div>
    </PageShell>
  ),
});
