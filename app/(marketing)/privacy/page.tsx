import { Metadata } from "next";

import { constructMetadata } from "@/lib/utils";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy – Domain Nest",
  description: "The Privacy Policy for Domain Nest - Your trusted domain management platform.",
});

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="inline-block font-heading text-4xl lg:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-xl text-muted-foreground">
          The Privacy Policy for Domain Nest - Your trusted domain management platform.
        </p>
      </div>
      <hr className="my-8" />
      
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg">
          At Domain Nest, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, and protect your information when you use our domain management services.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, 
          add domain information, or contact our support team. This may include:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Account information (name, email address, password)</li>
          <li>Domain information and DNS records</li>
          <li>Payment information for premium features</li>
          <li>Communications with our support team</li>
        </ul>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Provide and maintain our domain management services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices and support messages</li>
          <li>Improve our services and develop new features</li>
          <li>Protect against fraud and abuse</li>
        </ul>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties 
          without your consent, except as described in this policy. We may share your information:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>With your consent or at your direction</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights and prevent fraud</li>
          <li>With service providers who assist in our operations</li>
        </ul>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against 
          unauthorized access, alteration, disclosure, or destruction. However, no method of 
          transmission over the internet is 100% secure.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through our 
          support system or email us at privacy@domain-nest.com.
        </p>

        <p className="mt-8 text-sm text-muted-foreground">
          Last updated: August 19, 2025
        </p>
      </div>
    </div>
  );
}
