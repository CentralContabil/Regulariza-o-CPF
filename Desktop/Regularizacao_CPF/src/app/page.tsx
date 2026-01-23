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

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProblemSection />
      <EducationSection />
      <SolutionSection />
      <HowItWorksSection />
      <TargetAudienceSection />
      <BenefitsSection />
      <SocialProofSection />
      <FAQSection />
      <FinalCTASection />
      <PreDiagnosticoForm />
      <Footer />
    </main>
  )
}
