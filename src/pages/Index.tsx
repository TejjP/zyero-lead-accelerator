import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { MissionSection } from "@/components/sections/MissionSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <MissionSection />
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
