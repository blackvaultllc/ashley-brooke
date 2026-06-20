import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/careers")({
  head: () => ({ meta: [
    { title: "Careers — Ashley Brooke" },
    { name: "description", content: "Open roles at Ashley Brooke's music studio. Marketing, sales, touring, and creative positions." },
  ]}),
  component: Careers,
});

type Posting = { id: string; title: string; department: string; description: string; location: string | null; employment_type: string | null };

const schema = z.object({
  full_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  cover_letter: z.string().trim().max(5000).optional().or(z.literal("")),
});

function Careers() {
  const { data } = useQuery({
    queryKey: ["postings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("career_postings").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data as Posting[];
    },
  });

  const postings = (data && data.length) ? data : [
    { id: "demo1", title: "Digital Marketing Lead", department: "Marketing", description: "Lead digital campaigns, social, and release promotion.", location: "Remote / Nashville, TN", employment_type: "Full-time" },
    { id: "demo2", title: "Merch & Sales Manager", department: "Sales", description: "Run the storefront, wholesale, and tour merch sales.", location: "Remote", employment_type: "Full-time" },
    { id: "demo3", title: "Tour Production Assistant", department: "Touring", description: "Support production on upcoming live dates.", location: "Tour", employment_type: "Contract" },
  ];

  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", cover_letter: "" });
  const [busy, setBusy] = useState(false);

  async function apply(e: React.FormEvent, postingId: string) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    const realId = postingId.startsWith("demo") ? null : postingId;
    const { error } = await supabase.from("applications").insert({ ...parsed.data, posting_id: realId, status: "new" });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Application submitted. Ashley will review it personally.");
    setForm({ full_name: "", email: "", phone: "", cover_letter: "" });
    setOpenId(null);
  }

  return (
    <PageShell kicker="Join the studio" title="Careers">
      <p className="text-muted-foreground max-w-2xl mb-12">
        We're hiring marketers, salespeople, and touring crew. If you want to help build an independent
        music company from the inside, apply below.
      </p>
      <div className="space-y-6">
        {postings.map((p) => (
          <article key={p.id} className="border border-border rounded-sm p-6 bg-card">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-widest text-accent">{p.department}</p>
                <h2 className="font-display text-2xl mt-1">{p.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{p.location || "Remote"} · {p.employment_type || "Full-time"}</p>
                <p className="text-sm mt-3 max-w-2xl">{p.description}</p>
              </div>
              <button onClick={() => setOpenId(openId === p.id ? null : p.id)} className="rounded-full bg-foreground text-background px-5 py-2 text-xs uppercase tracking-widest">
                {openId === p.id ? "Cancel" : "Apply"}
              </button>
            </div>
            {openId === p.id && (
              <form onSubmit={(e) => apply(e, p.id)} className="mt-6 grid gap-3 md:grid-cols-2 border-t border-border pt-6">
                <input required placeholder="Full name" value={form.full_name} onChange={(e)=>setForm(f=>({...f,full_name:e.target.value}))} className="bg-background border border-border rounded px-3 py-2 text-sm" />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} className="bg-background border border-border rounded px-3 py-2 text-sm" />
                <input placeholder="Phone (optional)" value={form.phone} onChange={(e)=>setForm(f=>({...f,phone:e.target.value}))} className="bg-background border border-border rounded px-3 py-2 text-sm md:col-span-2" />
                <textarea placeholder="Tell Ashley about yourself" rows={5} value={form.cover_letter} onChange={(e)=>setForm(f=>({...f,cover_letter:e.target.value}))} className="bg-background border border-border rounded px-3 py-2 text-sm md:col-span-2" />
                <button disabled={busy} className="md:col-span-2 rounded-full bg-accent text-accent-foreground px-5 py-2 text-sm uppercase tracking-widest disabled:opacity-50">
                  {busy ? "Submitting..." : "Submit application"}
                </button>
              </form>
            )}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
