import { HeroSection } from '@/components/sections/home/HeroSection'
import { StatsSection } from '@/components/sections/home/StatsSection'
import { FadeInSection } from '@/components/ui/FadeInSection'
import { CountryPresenceSection } from '@/components/sections/home/CountryPresenceSection'
import { AfricanPresenceSection } from '@/components/sections/home/AfricanPresenceSection'
import { AboutSection } from '@/components/sections/home/AboutSection'
import { FeaturedServicesSection } from '@/components/sections/home/FeaturedServicesSection'
import { TeamToolsSection } from '@/components/sections/home/TeamToolsSection'
import { FAQSection } from '@/components/sections/home/FAQSection'
import { NewsletterSection } from '@/components/sections/home/NewsletterSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — priority, not lazy */}
      <HeroSection />

      {/* Stats counters — dark green band, above fold on most screens */}
      <FadeInSection>
        <StatsSection />
      </FadeInSection>

      {/* Country flags infinite scroll */}
      <FadeInSection delay={50}>
        <CountryPresenceSection />
      </FadeInSection>

      {/* African corporate presence mosaic */}
      <FadeInSection delay={60}>
        <AfricanPresenceSection />
      </FadeInSection>

      {/* About / Who we are */}
      <FadeInSection delay={80}>
        <AboutSection />
      </FadeInSection>

      {/* Core service areas */}
      <FadeInSection delay={80}>
        <FeaturedServicesSection />
      </FadeInSection>

      {/* TEAM Tools suite */}
      <FadeInSection delay={80}>
        <TeamToolsSection />
      </FadeInSection>

      {/* FAQ */}
      <FadeInSection delay={80}>
        <FAQSection />
      </FadeInSection>

      {/* Newsletter / Stay Updated */}
      <FadeInSection delay={80}>
        <NewsletterSection />
      </FadeInSection>
    </div>
  )
}
