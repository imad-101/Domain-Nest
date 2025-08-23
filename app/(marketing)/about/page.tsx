import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "About – Domain Nest",
  description: "Learn more about Domain Nest - your professional domain management platform.",
});

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-16">
      <div className="flex flex-col items-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          About Domain Nest
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Professional domain management platform with DNS monitoring, SSL certificates, 
          domain transfers, and comprehensive analytics.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">DNS Management</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive DNS record management with real-time monitoring and analytics.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">SSL Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Real-time SSL certificate monitoring with expiration alerts and security insights.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Domain Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Detailed analytics and reporting for all your domains in one centralized dashboard.
            </p>
          </div>
        </div>
        
        <div className="mt-16 space-y-4 text-left max-w-2xl">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            Domain Nest was created to provide domain professionals and businesses with 
            a comprehensive platform to manage their digital assets. We believe in making 
            domain management simple, secure, and efficient.
          </p>
          
          <h2 className="text-2xl font-bold pt-8">Why Choose Domain Nest?</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Real-time monitoring and alerts</li>
            <li>• Comprehensive DNS and SSL management</li>
            <li>• Professional-grade analytics</li>
            <li>• Secure and reliable infrastructure</li>
            <li>• User-friendly interface</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
