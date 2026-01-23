'use client'

import Hero from '@/components/Hero'
import ProblemSection from '@/components/ProblemSection'
import EducationSection from '@/components/EducationSection'
import SolutionSection from '@/components/SolutionSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import TargetAudienceSection from '@/components/TargetAudienceSection'
import BenefitsSection from '@/components/BenefitsSection'
import SocialProofSection from '@/components/SocialProofSection'
import FAQSection from '@/components/FAQSection'
import FinalCTASection from '@/components/FinalCTASection'
import PreDiagnosticoForm from '@/components/PreDiagnosticoForm'
import Footer from '@/components/Footer'
import ParallaxSection from '@/components/ParallaxSection'

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Hero />
      <ParallaxSection speed={0.2}>
        <ProblemSection />
      </ParallaxSection>
      <EducationSection />
      <ParallaxSection speed={0.15}>
        <SolutionSection />
      </ParallaxSection>
      <HowItWorksSection />
      <TargetAudienceSection />
      <BenefitsSection />
      <ParallaxSection speed={0.1}>
        <SocialProofSection />
      </ParallaxSection>
      <FAQSection />
      <FinalCTASection />
      <PreDiagnosticoForm />
      <Footer />
    </main>
  )
}
