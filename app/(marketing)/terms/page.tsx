import { Metadata } from "next";

import { constructMetadata } from "@/lib/utils";

export const metadata: Metadata = constructMetadata({
  title: "Terms & Conditions – Domain Nest",
  description: "Terms of Service for Domain Nest - Your trusted domain management platform.",
});

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="inline-block font-heading text-4xl lg:text-5xl">
          Terms & Conditions
        </h1>
        <p className="text-xl text-muted-foreground">
          Terms of Service for Domain Nest - Your trusted domain management platform.
        </p>
      </div>
      <hr className="my-8" />
      
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg">
          Welcome to Domain Nest. These terms and conditions outline the rules and regulations 
          for the use of our domain management platform.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Acceptance of Terms</h2>
        <p>
          By accessing and using Domain Nest, you accept and agree to be bound by the terms 
          and provision of this agreement. If you do not agree to abide by the above, please 
          do not use this service.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Use License</h2>
        <p>
          Permission is granted to temporarily use Domain Nest for personal and commercial 
          domain management purposes. This includes:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Managing your domain names and DNS records</li>
          <li>Monitoring domain expiration dates</li>
          <li>Organizing domain portfolios</li>
          <li>Accessing domain analytics and insights</li>
        </ul>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">User Responsibilities</h2>
        <p>
          As a user of Domain Nest, you agree to:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Provide accurate and current information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Use the service only for lawful purposes</li>
          <li>Not attempt to interfere with the service or other users</li>
          <li>Comply with all applicable laws and regulations</li>
        </ul>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Service Availability</h2>
        <p>
          While we strive to maintain high availability, Domain Nest may be temporarily 
          unavailable due to maintenance, updates, or circumstances beyond our control. 
          We do not guarantee uninterrupted access to the service.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Payment and Billing</h2>
        <p>
          Premium features require payment as outlined in our pricing plans. All payments 
          are processed securely through our payment providers. Refunds are subject to 
          our refund policy.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Limitation of Liability</h2>
        <p>
          Domain Nest shall not be liable for any indirect, incidental, special, consequential, 
          or punitive damages resulting from your use of or inability to use the service.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Termination</h2>
        <p>
          We may terminate or suspend your account and access to the service at our sole 
          discretion, without prior notice, for conduct that we believe violates these 
          terms or is harmful to other users or the service.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Users will be notified 
          of significant changes, and continued use of the service constitutes acceptance 
          of the modified terms.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Contact Information</h2>
        <p>
          If you have any questions about these Terms & Conditions, please contact us 
          through our support system or email us at legal@domain-nest.com.
        </p>

        <p className="mt-8 text-sm text-muted-foreground">
          Last updated: August 19, 2025
        </p>
      </div>
    </div>
  );
}
