import Image from "next/image";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import Link from "next/link";

const features = [
  {
    id: 1,
    title: "Intelligent DNS Management",
    description: "Effortlessly manage your DNS records with our smart interface. Real-time propagation tracking, automatic validation, and intuitive bulk editing tools make DNS management a breeze.",
    image: "/main.png", // Using the main image as placeholder

    highlights: ["Real-time propagation", "Bulk editing", "Automatic validation"]
  },
  {
    id: 2,
    title: "SSL Certificate Monitoring",
    description: "Never worry about expired certificates again. Our automated monitoring system tracks all your SSL certificates and sends smart alerts 90, 30, and 7 days before expiration with one-click renewal options.",
    image: "/DomNest.png",

    highlights: ["Automated monitoring", "Smart alerts", "One-click renewal"]
  },
  {
    id: 3,
    title: "Advanced Analytics Dashboard",
    description: "Get comprehensive insights into your domain performance with detailed analytics, uptime monitoring, and security metrics. Make data-driven decisions with our powerful reporting tools.",
    image: "/_static/illustrations/work-from-home.jpg",

    highlights: ["Performance insights", "Uptime monitoring", "Security metrics"]
  },
  {
    id: 4,
    title: "Multi-Domain Operations",
    description: "Scale your domain management with powerful bulk operations. Transfer multiple domains, update DNS records across portfolios, and manage renewals for hundreds of domains simultaneously.",
    image: "/main.png", // Using main image as placeholder

    highlights: ["Bulk operations", "Portfolio management", "Scaled automation"]
  }
];

export default function FeaturesNew() {
  return (
    <section className="py-24 ">
      <MaxWidthWrapper>
   

        <div className="mt-16 space-y-24">
          {features.map((feature, index) => {
            
            const isReversed = index % 2 === 1;
            
            return (
              <div
                key={feature.id}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image Box */}
                <div className="lg:w-1/2">
                  <div className="relative group">
                    <div className="absolute -inset-1  rounded-2xl  transition duration-300"></div>
                    <div className="relative bg-background border rounded-xl p-4 ">
                      <div className="aspect-video overflow-hidden rounded-lg bg-muted/30">
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      
                     
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2 space-y-2">
                  <div className="space-y-4">
               
                    
                    <h3 className="text-2xl  text-foreground leading-tight">
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3">
                    {feature.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-foreground font-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>

              
                </div>
              </div>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
