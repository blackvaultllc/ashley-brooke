import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader />
      <section className="pt-40 pb-12 px-6 border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl">
          {kicker && <p className="text-xs uppercase tracking-[0.4em] text-accent mb-4">{kicker}</p>}
          <h1 className="font-display text-5xl md:text-7xl font-bold">{title}</h1>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-6 py-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
