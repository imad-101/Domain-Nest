import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HeaderSection } from "../shared/header-section";

const pricingFaqData = [
  {
    id: "item-1",
    question: "What is the cost of the free plan?",
    answer:
      "Our free plan is completely free, with no monthly or annual charges. It's a great way to get started and explore our basic domain management features.",
  },
  {
    id: "item-2",
    question: "How much does the Pro Monthly plan cost?",
    answer:
      "The Pro Monthly plan is priced at $15 per month. It provides access to advanced domain management features and is billed on a monthly basis.",
  },
  {
    id: "item-3",
    question: "What is the price of the Business Monthly plan?",
    answer:
      "The Business Monthly plan is available for $30 per month. It offers comprehensive domain management features and is billed on a monthly basis for added flexibility.",
  },
  {
    id: "item-4",
    question: "Do you offer any annual subscription plans?",
    answer:
      "Yes, we offer annual subscription plans with significant savings. The Pro Annual plan is $144 per year (20% off), and the Business Annual plan is $300 per year (17% off).",
  },
  {
    id: "item-5",
    question: "What is the Lifetime plan and how much does it cost?",
    answer:
      "Our Lifetime plan is a one-time payment of $49 that gives you lifetime access to all Business plan features. This includes unlimited domains, advanced analytics, priority support, and all future updates - no recurring fees ever!",
  },
  {
    id: "item-6",
    question: "Is there a trial period for the paid plans?",
    answer:
      "We offer a 14-day free trial for both monthly and annual plans. The Lifetime plan comes with a 30-day money-back guarantee, so you can try it risk-free.",
  },
  {
    id: "item-7",
    question: "What's included in the Lifetime plan?",
    answer:
      "The Lifetime plan includes everything from the Business plan: unlimited domains, real-time analytics, custom branding, 24/7 support, plus exclusive lifetime member benefits and all future feature updates at no additional cost.",
  },
];

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-2">
      <HeaderSection
        label="FAQ"
        title="Frequently Asked Questions"
        subtitle="Explore our comprehensive FAQ to find quick answers to common
          inquiries. If you need further assistance, don't hesitate to
          contact us for personalized help."
      />

      <Accordion type="single" collapsible className="my-12 w-full">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
