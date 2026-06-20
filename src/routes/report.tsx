import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [
    { title: "Report a Concern — Ashley Brooke" },
    { name: "description", content: "Report safety, harassment, or compliance concerns confidentially." },
  ]}),
  component: Report,
});

function Report() {
  const [form, setForm] = useState({ name: "Anonymous", email: "anonymous@report.local", subject: "Report: ", message: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.message.trim()) { toast.error("Please describe the concern"); return; }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name || "Anonymous",
      email: form.email || "anonymous@report.local",
      subject: form.subject || "Report",
      message: form.message,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Report submitted. It will be reviewed confidentially.");
    setForm({ name: "Anonymous", email: "anonymous@report.local", subject: "Report: ", message: "" });
  }

  return (
    <PageShell kicker="Confidential" title="Report a Concern">
      <p className="text-muted-foreground max-w-2xl mb-10">
        Use this form to confidentially report safety, harassment, intellectual property,
        or compliance concerns. You may submit anonymously. Reports are reviewed personally by Ashley.
      </p>
      <form onSubmit={submit} className="grid gap-3 max-w-2xl">
        <input placeholder="Your name (optional)" value={form.name === "Anonymous" ? "" : form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value || "Anonymous"}))} className="bg-background border border-border rounded px-3 py-3 text-sm" />
        <input type="email" placeholder="Contact email (optional)" value={form.email === "anonymous@report.local" ? "" : form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value || "anonymous@report.local"}))} className="bg-background border border-border rounded px-3 py-3 text-sm" />
        <input placeholder="Subject" value={form.subject} onChange={(e)=>setForm(f=>({...f,subject:e.target.value}))} className="bg-background border border-border rounded px-3 py-3 text-sm" />
        <textarea required rows={10} placeholder="Describe the concern in detail" value={form.message} onChange={(e)=>setForm(f=>({...f,message:e.target.value}))} className="bg-background border border-border rounded px-3 py-3 text-sm" />
        <button disabled={busy} className="rounded-full bg-foreground text-background px-6 py-3 text-sm uppercase tracking-widest disabled:opacity-50">
          {busy ? "Submitting..." : "Submit report"}
        </button>
      </form>
    </PageShell>
  );
}
