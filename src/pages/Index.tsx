import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { useEffect, useState } from "react";
import BookingForm from "@/components/BookingForm";
import { businessStructuredData, servicesStructuredData, personStructuredData } from "@/data/structuredData";
import ShareButton from "@/components/ShareButton";
import NavigationMenu from "@/components/Index/NavigationMenu";
import HeroSection from "@/components/Index/HeroSection";
import ServicesSection from "@/components/Index/ServicesSection";
import AboutSection from "@/components/Index/AboutSection";
import ReviewsSection from "@/components/Index/ReviewsSection";
import ContactSection from "@/components/Index/ContactSection";
import Footer from "@/components/Index/Footer";

const MassageWebsite = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    if (service) {
      setPreselectedService(service);
      setIsBookingOpen(true);
    }
  }, []);

  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      businessStructuredData,
      servicesStructuredData,
      personStructuredData
    ]
  };

  return (
    <>
      <SEOHead 
        title="Гармония энергий - Массаж, Access Bars, Целительство в Москве"
        description="Профессиональные услуги массажа, Access Bars, энергетического целительства и обучения в Москве. Наталья Великая - сертифицированный специалист. Записаться: +7(918) 414-1221"
        keywords="массаж Москва, Access Bars, энергетическое целительство, духовные практики, массаж спины, расслабляющий массаж, Наталья Великая"
        url="https://velikaya-nataliya.ru"
        image="https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg"
        structuredData={combinedStructuredData}
      />
      <div 
        className="min-h-screen font-openSans relative overflow-hidden"
        style={{
          background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover no-repeat fixed`,
        }}
      >
        <div className="absolute inset-0 opacity-0"></div>
        
        <Header />
        <ShareButton />
        <NavigationMenu 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          closeMenu={closeMenu} 
        />

        <main>
          <HeroSection setIsBookingOpen={setIsBookingOpen} />
          <ServicesSection />
          <AboutSection />
          <ReviewsSection />
          <ContactSection />
        </main>

        <Footer />
        
        <BookingForm 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)}
          preselectedService={preselectedService}
        />
      </div>
    </>
  );
};

export default MassageWebsite;