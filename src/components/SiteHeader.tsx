import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/music", label: "Music" },
  { to: "/tour", label: "Tour" },
  { to: "/store", label: "Store" },
  { to: "/about", label: "About" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl tracking-tight font-bold">
          ASHLEY <span className="text-accent">BROOKE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="uppercase tracking-widest text-foreground/80 hover:text-accent transition"
              activeProps={{ className: "text-accent" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to={signedIn ? "/admin" : "/auth"}
            className="rounded-full bg-foreground px-4 py-2 text-xs uppercase tracking-widest text-background hover:bg-accent transition"
          >
            {signedIn ? "Studio" : "Sign In"}
          </Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="flex flex-col p-6 gap-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="uppercase tracking-widest text-sm"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to={signedIn ? "/admin" : "/auth"}
              onClick={() => setOpen(false)}
              className="uppercase tracking-widest text-sm text-accent"
            >
              {signedIn ? "Studio" : "Sign In"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
