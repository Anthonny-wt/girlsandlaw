import HeroSection from '@/components/sections/HeroSection';
import FounderSection from '@/components/sections/FounderSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Community & Heritage Archive */}
      <HeroSection />

      {/* Founder Leadership Section (Exact visual match from provided design) */}
      <FounderSection />
    </div>
  );
}
