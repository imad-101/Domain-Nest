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
    job: "Senior DevOps Engineer",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    review:
      "I've been using DomNest for about 8 months now and it's honestly made my life so much easier. Before this, I was juggling spreadsheets and sticky notes trying to keep track of SSL renewals. The automated alerts have already saved me twice from embarrassing certificate expirations. Worth every penny.",
  },
  {
    name: "Marcus Rodriguez",
    job: "Freelance Web Developer",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    review:
      "Running a one-person web dev shop means I'm constantly switching between client projects. DomNest keeps all my domains organized in one place, and the uptime monitoring gives me peace of mind when I'm focused on coding. My clients love getting proactive notifications too.",
  },
  {
    name: "Jennifer Kim",
    job: "IT Director",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    review:
      "We had domains scattered across three different registrars with no central visibility. The migration to DomNest took some planning, but now our entire team can see domain status at a glance. The reporting features have been great for our quarterly reviews with leadership.",
  },
  {
    name: "Alex Thompson",
    job: "Systems Administrator",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    review:
      "Look, I'm not easily impressed by SaaS tools, but DomNest actually delivers. The DNS propagation checker has saved me hours of troubleshooting, and I love that I can manage everything from my phone when I'm on-call. Simple but powerful.",
  },
  {
    name: "Lisa Wang",
    job: "Marketing Operations Manager",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    review:
      "As someone who's not super technical, I was worried about managing our campaign landing page domains. DomNest's interface is intuitive enough that I don't need to bug our dev team for every little DNS change. The bulk editing feature is a lifesaver during campaign launches.",
  },
  {
    name: "David Park",
    job: "Co-founder & CTO",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    review:
      "Early stage startup here - we're watching every dollar. DomNest gives us enterprise-level domain management without the enterprise price tag. The API integration with our deployment pipeline was surprisingly straightforward. Definitely recommend for other startups.",
  },
  {
    name: "Rachel Green",
    job: "Digital Agency Owner",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    review:
      "Managing 40+ client domains used to be a nightmare of shared logins and forgotten renewals. DomNest's client portal feature lets us give customers visibility without exposing sensitive settings. Our account managers love how professional it makes us look.",
  },
];