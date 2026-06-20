import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import heroImg from "@/assets/ashley-river.jpg.asset.json";
import aboutImg from "@/assets/ashley-elephant.jpg.asset.json";
import album1 from "@/assets/cover-positive-vibes.jpg.asset.json";
import { ArrowRight, Play } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ashley Brooke — Official Site" },
      { name: "description", content: "New music, tour dates, merch, and the official story of independent artist Ashley Brooke." },
      { property: "og:title", content: "Ashley Brooke — Official Site" },
      { property: "og:description", content: "Independent artist. New album out now." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <img
          src={heroImg.url}
          alt="Ashley Brooke in golden hour"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-24 px-6 text-center text-background">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="uppercase tracking-[0.4em] text-xs text-accent mb-4"
          >
            New album · out now
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.95]"
          >
            Ashley Brooke
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link to="/music" className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm uppercase tracking-widest hover:opacity-90 transition">
              <Play size={14} /> Listen now
            </Link>
            <Link to="/tour" className="inline-flex items-center gap-2 rounded-full border border-background/60 px-6 py-3 text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition">
              Tour dates <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURED RELEASE */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            src={album1.url}
            alt="Positive Vibes album art"
            width={1024} height={1024}
            loading="lazy"
            className="rounded-sm shadow-2xl"
          />
          <div>
            <p className="text-xs uppercase tracking-widest text-accent mb-3">The new album</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">Positive Vibes</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
              Twelve tracks written, sung, and produced from Ashley's own studio.
              A record about leaving small towns, falling in love with the work,
              and what it really costs to do it on your own terms.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/music" className="rounded-full bg-foreground text-background px-5 py-2 text-sm uppercase tracking-widest">Stream</Link>
              <Link to="/store" className="rounded-full border border-border px-5 py-2 text-sm uppercase tracking-widest">Buy vinyl</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TOUR PREVIEW */}
      <section className="bg-foreground text-background py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent mb-2">On the road</p>
              <h2 className="font-display text-5xl md:text-6xl font-bold">Live Dates</h2>
            </div>
            <Link to="/tour" className="text-sm uppercase tracking-widest text-background/80 hover:text-accent">
              All dates →
            </Link>
          </div>
          <div className="py-12 text-center">
            <p className="font-display text-3xl mb-3">Tour dates coming soon</p>
            <p className="text-background/70">Sign up below to be the first to know when Ashley announces new shows.</p>
          </div>
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1">
            <p className="text-xs uppercase tracking-widest text-accent mb-3">Independent</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">Her studio. Her rules.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-md">
              Ashley runs every piece of the operation herself — from writing and
              recording, to the studio business, the team, and the storefront.
              This site is her front porch.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-foreground hover:text-accent">
              Read her story <ArrowRight size={14} />
            </Link>
          </div>
          <img src={aboutImg.url} alt="Ashley in studio" width={1200} height={1500} loading="lazy" className="rounded-sm shadow-xl order-1 md:order-2" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
