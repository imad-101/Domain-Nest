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
