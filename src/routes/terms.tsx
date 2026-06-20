import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — Ashley Brooke" }, { name: "description", content: "Terms and conditions for use of ashleybrookemusic.com." }]}),
  component: () => (
    <PageShell kicker="Legal" title="Terms of Service">
      <div className="max-w-3xl space-y-5 text-muted-foreground leading-relaxed">
        <p><strong className="text-foreground">Effective date:</strong> {new Date().toLocaleDateString()}</p>
        <p>These Terms of Service ("Terms") govern your use of the Ashley Brooke website and any related services. By accessing the Site you agree to be bound by these Terms. These Terms are governed by the laws of the United States, without regard to conflict-of-laws principles.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Use of the Site</h2>
        <p>You agree to use the Site lawfully and not to attempt to interfere with its operation, gain unauthorized access, or scrape content for commercial purposes without permission.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Intellectual property</h2>
        <p>All music, lyrics, photography, video, and brand elements are © Ashley Brooke unless otherwise noted. No content may be reproduced, distributed, or used commercially without written permission.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Purchases</h2>
        <p>Orders placed through the Site are subject to acceptance and availability. Prices are listed in U.S. dollars. Applicable U.S. sales tax is added at checkout where required.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Disclaimers</h2>
        <p>The Site is provided "as is" without warranty of any kind. To the maximum extent permitted by law we disclaim all warranties, express or implied.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Limitation of liability</h2>
        <p>In no event will Ashley Brooke or her affiliates be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Changes</h2>
        <p>We may update these Terms from time to time. Continued use of the Site constitutes acceptance of the updated Terms.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Contact</h2>
        <p>legal@ashleybrookemusic.com</p>
      </div>
    </PageShell>
  ),
});
