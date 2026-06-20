import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Ashley Brooke" }, { name: "description", content: "How Ashley Brooke's site collects and uses your information." }]}),
  component: () => (
    <PageShell kicker="Legal" title="Privacy Policy">
      <div className="prose prose-stone max-w-3xl space-y-5 text-muted-foreground leading-relaxed">
        <p><strong className="text-foreground">Effective date:</strong> {new Date().toLocaleDateString()}</p>
        <p>This Privacy Policy describes how Ashley Brooke ("we," "us," "our") collects, uses, and discloses information when you visit ashleybrookemusic.com (the "Site"). This policy is governed by the laws of the United States.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Information we collect</h2>
        <p>We collect information you provide directly — such as name, email address, phone number, and message content when you use our contact, career, or order forms. We may also automatically collect technical data (IP address, browser type, pages visited) for security and analytics.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">How we use information</h2>
        <p>We use your information to respond to inquiries, evaluate job applications, fulfill orders, send transactional and marketing communications (where permitted), prevent fraud, and comply with legal obligations.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Sharing</h2>
        <p>We do not sell your personal information. We share information only with service providers who help operate the Site (hosting, payment processing, email delivery) and as required by law.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Your rights</h2>
        <p>You may request access, correction, or deletion of your personal information by emailing privacy@ashleybrookemusic.com. We honor opt-out requests for marketing communications.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Children</h2>
        <p>The Site is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
        <h2 className="text-foreground font-display text-2xl mt-8">Contact</h2>
        <p>Questions about this policy: privacy@ashleybrookemusic.com.</p>
      </div>
    </PageShell>
  ),
});
