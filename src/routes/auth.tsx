import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — Ashley Brooke Studio" }]}),
  component: Auth,
});

const emailSchema = z.string().trim().email().max(255);
const pwSchema = z.string().min(8).max(72);

function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin"|"signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) nav({ to: "/admin" }); });
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const e1 = emailSchema.safeParse(email);
    const e2 = pwSchema.safeParse(pw);
    if (!e1.success) { toast.error("Enter a valid email"); return; }
    if (!e2.success) { toast.error("Password must be 8+ characters"); return; }
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password: pw,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Account created. You're signed in.");
      nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      nav({ to: "/admin" });
    }
  }

  async function oauth(provider: "google" | "apple") {
    const r = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin + "/admin" });
    if (r.error) { toast.error(String(r.error.message || r.error)); return; }
    if (r.redirected) return;
    nav({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-md px-6 pt-40 pb-20">
        <p className="text-xs uppercase tracking-[0.4em] text-accent mb-3">Studio access</p>
        <h1 className="font-display text-5xl font-bold mb-3">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Owner access is restricted to Ashley. Other accounts can apply via Careers.
        </p>

        <div className="grid gap-3 mb-6">
          <button onClick={() => oauth("google")} className="rounded-full border border-border bg-card py-3 text-sm font-medium hover:bg-secondary transition">
            Continue with Google
          </button>
          <button onClick={() => oauth("apple")} className="rounded-full bg-foreground text-background py-3 text-sm font-medium">
            Continue with Apple
          </button>
        </div>

        <div className="flex items-center gap-3 my-6 text-xs uppercase tracking-widest text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> or email <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={submit} className="grid gap-3">
          <input type="email" required placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="bg-background border border-border rounded px-3 py-3 text-sm" />
          <input type="password" required placeholder="Password" value={pw} onChange={(e)=>setPw(e.target.value)} className="bg-background border border-border rounded px-3 py-3 text-sm" />
          <button disabled={busy} className="rounded-full bg-accent text-accent-foreground py-3 text-sm uppercase tracking-widest disabled:opacity-50">
            {busy ? "Working..." : (mode === "signin" ? "Sign in" : "Create account")}
          </button>
        </form>

        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-5 text-sm text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
