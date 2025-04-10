import { PageLayout } from "@/components/layouts/page-layout"
import { HeroSection } from "@/features/home/components/hero-section"
import { FeaturesSection } from "@/features/home/components/features-section"
import { HowItWorksSection } from "@/features/home/components/how-it-works-section"
import { PricingSection } from "@/features/home/components/pricing-section"
import { TestimonialsSection } from "@/features/home/components/testimonials-section"
import { MainHeader } from "@/components/layouts/main-header"

export default function HomePage() {
  return (
    <PageLayout>
      <MainHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
      </main>
    </PageLayout>
  )
}
