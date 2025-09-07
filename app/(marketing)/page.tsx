import { infos } from "@/config/landing";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import FeaturesNew from "@/components/sections/features-new";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Testimonials from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/FaqSection";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      <Powered />
      <FeaturesNew />
      {/* <InfoLanding data={infos[0]} reverse={true} /> */}
      {/* <InfoLanding data={infos[1]} /> */}
      <FAQSection />
      {/* <Features /> */}
      {/* <BentoGrid /> */}
      <Testimonials />
    </>
  );
}
