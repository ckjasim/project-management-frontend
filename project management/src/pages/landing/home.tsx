
import Hero from '@/components/Home/hero';

import First from '@/components/Home/first';
import TeamCollaborationSection from '@/components/Home/teamCollaboration';
import IntegrationSection from '@/components/Home/integration';
import DetailedReportsSection from '@/components/Home/report';
import UnlockPerksSection from '@/components/Home/unlock';
import FeaturesSection from '@/components/Home/features';
import TestimonialsSection from '@/components/Home/testimonial';
import Footer from '@/components/Home/footer';
import Trustedby from '@/components/Home/trustedBy';

const EnhancedLandingPage = () => {

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Trustedby />
      <First />
      <TeamCollaborationSection />
      <IntegrationSection />
<DetailedReportsSection/>
<UnlockPerksSection/>
<FeaturesSection/>
<TestimonialsSection/>
<Footer/>
  
    </div>
  );
};

export default EnhancedLandingPage;
