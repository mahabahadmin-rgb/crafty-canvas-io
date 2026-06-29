import { HeroSection } from "@/components/sections/hero-section";
import { AssetsCarousel } from "@/components/sections/assets-carousel";
import { ContributionsShowcase } from "@/components/sections/contributions-showcase";
import { RealEstateServices } from "@/components/sections/real-estate-services";
import { MediaCenter } from "@/components/sections/media-center";
import { KnowledgeLibrary } from "@/components/sections/knowledge-library";
import { FinalCTA } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AssetsCarousel />
      <ContributionsShowcase />
      <RealEstateServices />
      <MediaCenter />
      <KnowledgeLibrary />
      <FinalCTA />
    </>
  );
}
