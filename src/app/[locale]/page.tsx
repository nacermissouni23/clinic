import HeroSection from "@/components/home/hero-section";
import ServicesSection from "@/components/home/services-section";
import AboutTeaser from "@/components/home/about-teaser";
import ReviewsCarousel from "@/components/home/reviews-carousel";
import GalleryTeaser from "@/components/home/gallery-teaser";
import LocationSection from "@/components/home/location-section";
import FAQSection from "@/components/home/faq-section";
import CTASection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutTeaser />
      <ReviewsCarousel />
      <GalleryTeaser />
      <LocationSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
