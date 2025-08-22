"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqData = [
  {
    question: "What is Domain Nest and how does it help my business?",
    answer:
      "Domain Nest is a comprehensive domain monitoring platform that helps businesses protect their online presence by tracking domain health, SSL certificates, DNS records, and security status. It prevents costly downtime by alerting you before issues affect your customers and provides detailed analytics to optimize your domain portfolio.",
  },
  {
    question: "How often does Domain Nest check my domains?",
    answer:
      "We monitor your domains 24/7 with checks every 5 minutes for critical metrics like uptime and SSL status. DNS changes are detected within minutes, and we provide real-time alerts via email, SMS, and webhooks so you're always the first to know about any issues.",
  },
  {
    question: "What types of domain issues can Domain Nest detect?",
    answer:
      "Domain Nest monitors SSL certificate expiration, DNS record changes, domain expiration dates, website downtime, response time degradation, security vulnerabilities, subdomain hijacking attempts, and unauthorized DNS modifications. Our comprehensive monitoring ensures no critical issue goes unnoticed.",
  },
  {
    question: "Can I monitor multiple domains and subdomains?",
    answer:
      "Absolutely! Domain Nest supports unlimited domain and subdomain monitoring. You can organize domains by projects, set different monitoring rules for each, and get consolidated reports across your entire domain portfolio. Perfect for agencies, enterprises, and anyone managing multiple web properties.",
  },
  {
    question: "How does the SSL certificate monitoring work?",
    answer:
      "Our SSL monitoring tracks certificate expiration dates, validates certificate chains, monitors for weak encryption, and alerts you before certificates expire. We check SSL health continuously and provide detailed reports on certificate status, helping you maintain secure connections and avoid browser security warnings.",
  },
  {
    question: "What happens when Domain Nest detects an issue?",
    answer:
      "When an issue is detected, you'll receive instant notifications through your preferred channels (email, SMS, Slack, Discord, or webhooks). Our detailed incident reports help you quickly diagnose problems, and our analytics dashboard provides insights to prevent future issues. You can also set up escalation rules for critical domains.",
  },
  {
    question: "Is Domain Nest suitable for agencies managing client domains?",
    answer:
      "Yes! Domain Nest is perfect for agencies and freelancers. You can organize client domains into separate projects, provide branded monitoring reports, set up white-label notifications, and give clients read-only access to their domain health dashboards. Our multi-tenant architecture keeps everything organized and professional.",
  },
  {
    question: "How secure is my domain data with Domain Nest?",
    answer:
      "Security is our top priority. All data is encrypted in transit and at rest, we use enterprise-grade infrastructure, and we never store sensitive credentials. Our monitoring is read-only and non-intrusive. We're SOC 2 compliant and follow industry best practices to protect your domain information.",
  },
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggle()
  }
  return (
    <div
      className={`w-full bg-[#e4f0d0] overflow-hidden rounded-[10px] outline outline-1 outline-border outline-offset-[-1px] transition-all duration-500 ease-out cursor-pointer`}
      onClick={handleClick}
    >
      <div className="w-full px-5 py-[18px] pr-4 flex justify-between items-center gap-5 text-left transition-all duration-300 ease-out">
        <div className="flex-1 text-foreground text-base font-medium leading-6 break-words">{question}</div>
        <div className="flex justify-center items-center">
          <ChevronDown
            className={`w-6 h-6 text-muted-foreground transition-all duration-500 ease-out ${isOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"}`}
          />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        style={{
          transitionProperty: "max-height, opacity, padding",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className={`px-5 transition-all duration-500 ease-out ${isOpen ? "pb-[18px] pt-2 translate-y-0" : "pb-0 pt-0 -translate-y-2"}`}
        >
          <div className="text-foreground/80 text-sm font-normal leading-6 break-words">{answer}</div>
        </div>
      </div>
    </div>
  )
}

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }
  return (
    <section className="w-full  px-5 relative flex flex-col justify-center items-center">
      <div className="w-[300px] h-[500px] absolute top-[150px] left-1/2 -translate-x-1/2 origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[100px] z-0" />
      <div className="self-stretch pt-8 pb-8 md:pt-14 md:pb-14 flex flex-col justify-center items-center gap-2 relative z-10">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="w-full max-w-[435px] text-center text-foreground text-4xl font-semibold leading-10 break-words">
            Frequently Asked Questions
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-[18.20px] break-words">
            Everything you need to know about Domain Nest and how it protects your online presence
          </p>
        </div>
      </div>
      <div className="w-full max-w-[600px] pt-0.5 pb-10 flex flex-col justify-start items-start gap-4 relative z-10">
        {faqData.map((faq, index) => (
          <FAQItem key={index} {...faq} isOpen={openItems.has(index)} onToggle={() => toggleItem(index)} />
        ))}
      </div>
    </section>
  )
}
