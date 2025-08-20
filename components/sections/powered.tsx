import Link from "next/link";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const logos = [
  {
    title: "Pinsearch",
    href: "https://pinsearch.co/",
    icon: (
      <img
        src="https://pinsearch.co/wp-content/uploads/2023/09/Main.png"
        alt="Pinsearch Logo"
        className="h-10 w-auto"
      />
    ),
  },
    {
    title: "Upwork",
    href: "https://www.upwork.com/",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Upwork-Logo-Black.svg"
        alt="Upwork Logo"
        className="h-10 w-auto"
      />
    ),
  },
     {
    title: "Fiverr",
    href: "https://www.fiverr.com/",
    icon: (
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSZXBEShtugHEYZHZ7WnLuRssXUhI5EmqLEg&s"
        alt="Fiverr Logo"
        className="h-10 w-auto"
      />
    ),
  },
    {
    title: "Cloudflare",
    href: "https://www.cloudflare.com/",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cloudflare_Logo.svg/2560px-Cloudflare_Logo.svg.png"
        alt="Cloudflare Logo"
        className="h-10 w-auto"
      />
    ),
  },
  {
    title: "Canva",
    href: "https://www.canva.com/",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/Canva_Logo.svg/2560px-Canva_Logo.svg.png"
        alt="Canva Logo"
        className="h-10 w-auto"
      />
    ),
  },
 {
    title: "Digital Ocean",
    href: "https://www.digitalocean.com/",
    icon: (
      <img
        src="data:image/png;base64,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"
        alt="Digital Ocean Logo"
        className="h-10 w-auto"
      />
    ),
  },
  

   {
    title: "Etsy",
    href: "https://www.etsy.com/",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/1200px-Etsy_logo.svg.png"
        alt="Etsy Logo"
        className="h-10 w-auto"
      />
    ),
  },
     
   
{
    title: "Amazon",
    href: "https://www.amazon.com/",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
        alt="Amazon Logo"
        className="h-10 w-auto"
      />
    ),
  },

];


export default function Powered() {
  return (
    <section className="py-14 text-muted-foreground">
      <MaxWidthWrapper>
        <h2 className="text-center text-lg font-semibold uppercase">
          Trusted By
        </h2>

        <div className="mt-10 grid grid-cols-2 place-items-center gap-8 md:grid-cols-4">
          {logos.slice(0, 4).map((logo) => (
            <Link
              target="_blank"
              key={logo.title}
              href={logo.href}
              aria-label={logo.title}
              className="duration-250 grayscale transition hover:text-foreground hover:grayscale-0"
            >
              {logo.icon}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 place-items-center gap-8 md:mt-10 md:grid-cols-4">
          {logos.slice(4, 8).map((logo) => (
            <Link
              target="_blank"
              key={logo.title}
              href={logo.href}
              aria-label={logo.title}
              className="duration-250 grayscale transition hover:text-foreground hover:grayscale-0"
            >
              {logo.icon}
            </Link>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
