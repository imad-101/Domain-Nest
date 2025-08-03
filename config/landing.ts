import { FeatureLdg, InfoLdg, TestimonialType } from "types";

export const infos: InfoLdg[] = [
  {
    title: "Professional Domain Management",
    description:
      "Take control of your online presence with our comprehensive domain management platform. Monitor DNS health, manage SSL certificates, and track domain performance all in one place.",
    image: "/_static/illustrations/work-from-home.jpg",
    list: [
      {
        title: "DNS Monitoring",
        description: "Real-time monitoring of your DNS records and propagation status.",
        icon: "search",
      },
      {
        title: "SSL Management",
        description: "Automated SSL certificate management and renewal notifications.",
        icon: "check",
      },
      {
        title: "Domain Analytics",
        description:
          "Comprehensive analytics and insights for your domain performance.",
        icon: "lineChart",
      },
    ],
  },
  {
    title: "Seamless Integration",
    description:
      "Integrate our open-source SaaS seamlessly into your existing workflows. Effortlessly connect with your favorite tools and services for a streamlined experience.",
    image: "/_static/illustrations/work-from-home.jpg",
    list: [
      {
        title: "Flexible",
        description:
          "Customize your integrations to fit your unique requirements.",
        icon: "laptop",
      },
      {
        title: "Efficient",
        description: "Streamline your processes and reducing manual effort.",
        icon: "search",
      },
      {
        title: "Reliable",
        description:
          "Rely on our robust infrastructure and 24/7 support.",
        icon: "settings",
      },
    ],
  },
];

export const features: FeatureLdg[] = [
  {
    title: "DNS Management",
    description:
      "Easily manage your DNS records with our intuitive interface. Add, edit, and monitor A, CNAME, MX, and TXT records.",
    link: "/dashboard",
    icon: "search",
  },
  {
    title: "SSL Certificate Monitoring",
    description:
      "Automatically monitor SSL certificate expiration dates and receive timely renewal notifications to keep your sites secure.",
    link: "/dashboard",
    icon: "check",
  },
  {
    title: "Domain Transfer",
    description:
      "Streamlined domain transfer process with step-by-step guidance and real-time status tracking.",
    link: "/dashboard",
    icon: "arrowRight",
  },
  {
    title: "Uptime Monitoring",
    description:
      "Monitor your domain's uptime and performance with detailed analytics and instant alerts when issues arise.",
    link: "/dashboard",
    icon: "lineChart",
  },
  {
    title: "WHOIS Lookup",
    description:
      "Quick and comprehensive WHOIS information lookup for any domain with detailed registration and ownership data.",
    link: "/dashboard",
    icon: "user",
  },
  {
    title: "Bulk Operations",
    description:
      "Manage multiple domains efficiently with bulk DNS updates, certificate renewals, and domain transfers.",
    link: "/dashboard",
    icon: "copy",
  },
];

export const testimonials: TestimonialType[] = [
  {
    name: "Sarah Chen",
    job: "DevOps Engineer",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    review:
      "Domain Nest has completely transformed how we handle our infrastructure. The DNS management is intuitive, and the SSL monitoring has saved us from multiple certificate expiration issues. The bulk operations feature is a game-changer for managing our 50+ domains.",
  },
  {
    name: "Marcus Rodriguez",
    job: "Web Developer",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    review:
      "As a freelance developer managing multiple client domains, this platform has been invaluable. The uptime monitoring alerts me immediately when there are issues, and the WHOIS lookup feature saves me so much time. Highly recommended!",
  },
  {
    name: "Jennifer Kim",
    job: "IT Manager",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    review:
      "Managing our company's domain portfolio used to be a nightmare. Now with this platform, everything is centralized and automated. The domain transfer process was incredibly smooth, and the analytics help us make informed decisions.",
  },
  {
    name: "Alex Thompson",
    job: "System Administrator",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    review:
      "The SSL certificate monitoring feature alone is worth the subscription. We never miss a renewal deadline anymore, and the dashboard gives us complete visibility into our domain health. Excellent platform!",
  },
  {
    name: "Lisa Wang",
    job: "Digital Marketing Manager",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    review:
      "Domain Nest has streamlined our entire online presence management. The bulk operations feature lets us update multiple domains simultaneously, and the uptime monitoring ensures our marketing campaigns never suffer from downtime.",
  },
  {
    name: "David Park",
    job: "Startup Founder",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    review:
      "As a startup, we needed a cost-effective solution to manage our domains professionally. This platform delivers enterprise-level features at an affordable price. The interface is clean and the support is excellent.",
  },
  {
    name: "Rachel Green",
    job: "Agency Owner",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    review:
      "Managing domains for multiple clients used to be chaotic. This platform has given us the tools to provide professional domain management services. The client dashboard features are perfect for our agency workflow.",
  },
];
