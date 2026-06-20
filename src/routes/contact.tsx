import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(5000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — Ashley Brooke" },
    { name: "description", content: "Get in touch with Ashley Brooke's team for press, booking, and general inquiries." },
  ]}),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Message sent. Ashley reads every one.");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <PageShell kicker="Get in touch" title="Contact">
      <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
        <div className="space-y-4 text-muted-foreground">
          <p>For press, booking, licensing, partnerships, or general inquiries — use the form. Messages go straight to Ashley's inbox.</p>
          <p className="text-foreground"><strong>Press:</strong> press@ashleybrookemusic.com</p>
          <p className="text-foreground"><strong>Booking:</strong> booking@ashleybrookemusic.com</p>
          <p className="text-foreground"><strong>Careers:</strong> careers@ashleybrookemusic.com</p>
        </div>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input required placeholder="Your name" value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} className="bg-background border border-border rounded px-3 py-3 text-sm" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} className="bg-background border border-border rounded px-3 py-3 text-sm" />
          </div>
          <input placeholder="Subject" value={form.subject} onChange={(e)=>setForm(f=>({...f,subject:e.target.value}))} className="bg-background border border-border rounded px-3 py-3 text-sm" />
          <textarea required rows={8} placeholder="Message" value={form.message} onChange={(e)=>setForm(f=>({...f,message:e.target.value}))} className="bg-background border border-border rounded px-3 py-3 text-sm" />
          <button disabled={busy} className="rounded-full bg-foreground text-background px-6 py-3 text-sm uppercase tracking-widest disabled:opacity-50">
            {busy ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
