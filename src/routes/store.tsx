import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import album1 from "@/assets/album1.jpg";
import merch1 from "@/assets/merch1.jpg";

export const Route = createFileRoute("/store")({
  head: () => ({ meta: [
    { title: "Store — Ashley Brooke" },
    { name: "description", content: "Official Ashley Brooke merch, vinyl, and apparel." },
  ]}),
  component: Store,
});

type Product = { id: string; name: string; description: string | null; price_cents: number; image_url: string | null; category: string | null };

function fmt(c: number) { return `$${(c/100).toFixed(2)}`; }

function Store() {
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const items = (data && data.length > 0) ? data : [
    { id: "demo1", name: "Signed CD", description: "Hand-signed by Ashley.", price_cents: 2000, image_url: null, category: "Music" },
    { id: "demo2", name: "Logo Tee — Cream", description: "Heavyweight cotton, vintage wash.", price_cents: 3200, image_url: null, category: "Apparel" },
    { id: "demo3", name: "Signed Lyric Booklet", description: "Hand-signed by Ashley.", price_cents: 2000, image_url: null, category: "Collectibles" },
  ];

  return (
    <PageShell kicker="Official store" title="Shop">
      <p className="text-muted-foreground max-w-xl mb-10">All orders ship from the U.S. Sales tax calculated at checkout per applicable state law.</p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <article key={p.id} className="group">
            <div className="aspect-square overflow-hidden bg-secondary rounded-sm mb-4">
              <img src={p.image_url || (i % 2 === 0 ? merch1 : album1)} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
            </div>
            <p className="text-xs uppercase tracking-widest text-accent">{p.category || "Merch"}</p>
            <h3 className="font-display text-2xl mt-1">{p.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-medium">{fmt(p.price_cents)}</span>
              <button disabled className="text-xs uppercase tracking-widest text-muted-foreground">Coming soon</button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
