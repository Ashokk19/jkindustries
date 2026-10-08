import Hero from '@/components/home/Hero';
import CatalogueSection from '@/components/home/CatalogueSection';
import AutomationCapability from '@/components/home/AutomationCapability';
import WhySection from '@/components/home/WhySection';
import MachineGallery from '@/components/home/MachineGallery';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <CatalogueSection />
      <AutomationCapability />
      <WhySection />
      <MachineGallery />
      <ContactSection />
    </div>
  );
}
