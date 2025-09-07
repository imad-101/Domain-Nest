
import FeaturesNew from "@/components/sections/features-new";
import HeroLanding from "@/components/sections/hero-landing";
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
      <FAQSection />
      <Testimonials />
    </>
  );
}
