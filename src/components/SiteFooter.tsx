import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Music2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background mt-32">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold">Ashley Brooke</p>
          <p className="mt-3 text-sm text-background/70 max-w-xs">
            Singer-songwriter. Independent artist. Building it her own way.
          </p>
          <div className="mt-5 flex gap-3 text-background/80">
            <a href="#" aria-label="Instagram" className="hover:text-accent"><Instagram size={18} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-accent"><Youtube size={18} /></a>
            <a href="#" aria-label="Spotify" className="hover:text-accent"><Music2 size={18} /></a>
          </div>
        </div>
        <FooterCol title="Explore" links={[["/music","Music"],["/tour","Tour"],["/store","Store"],["/about","About"]]} />
        <FooterCol title="Business" links={[["/careers","Careers"],["/contact","Contact"],["/report","Report a concern"]]} />
        <FooterCol title="Legal" links={[["/privacy","Privacy Policy"],["/terms","Terms of Service"],["/refunds","Refund & Shipping"]]} />
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-background/60">
          <p>© {new Date().getFullYear()} Ashley Brooke. All rights reserved.</p>
          <p>Operated in the United States. Governed by applicable U.S. federal law.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-accent font-medium mb-4">{title}</p>
      <ul className="space-y-2 text-sm">
        {links.map(([to, label]) => (
          <li key={to}><Link to={to} className="text-background/80 hover:text-background">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
