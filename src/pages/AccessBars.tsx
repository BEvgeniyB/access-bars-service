import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import BookingForm from "@/components/BookingForm";
import { breadcrumbStructuredData } from "@/data/structuredData";
import AccessBarsHero from "@/components/AccessBars/AccessBarsHero";
import AccessBarsAbout from "@/components/AccessBars/AccessBarsAbout";
import AccessBarsBenefits from "@/components/AccessBars/AccessBarsBenefits";
import AccessBarsSessions from "@/components/AccessBars/AccessBarsSessions";
import AccessBarsNavigation from "@/components/AccessBars/AccessBarsNavigation";
import AccessBarsFAQ from "@/components/AccessBars/AccessBarsFAQ";
import AccessBarsContact from "@/components/AccessBars/AccessBarsContact";
import ShareButton from "@/components/ShareButton";

const AccessBars = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string>('');

  useEffect(() => {
    // Плавный скролл к якорю после загрузки страницы
    const hash = window.location.hash;
    if (hash) {
      // Сначала прокручиваем в начало страницы
      window.scrollTo(0, 0);
      
      // Затем медленно прокручиваем к целевому разделу
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500); // Увеличенная задержка для более заметного эффекта
    }
    
    // Handle preselected service from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    if (service) {
      setPreselectedService(service);
      setIsBookingOpen(true);
    }
  }, []);

  const breadcrumbData = breadcrumbStructuredData([
    { name: "Главная", url: "https://harmony-energies.ru/" },
    { name: "Access Bars", url: "https://harmony-energies.ru/access-bars" }
  ]);

  return (
    <>
      <SEOHead 
        title="Access Bars в Москве - Энергетическая терапия | Гармония энергий"
        description="Профессиональные сеансы Access Bars в Москве. Телесная техника для освобождения от ментальных блоков. Опытный специалист Наталья Великая. Цена от 7000 ₽."
        keywords="Access Bars Москва, энергетическая терапия, телесные практики, ментальные блоки, трансформация сознания"
        url="https://velikaya-nataliya.ru/access-bars"
        image="https://cdn.poehali.dev/files/58c024e8-2d2e-49a9-ac0e-19692c531870.jpg"
        structuredData={breadcrumbData}
      />
      <div className="min-h-screen font-openSans relative overflow-hidden" style={{backgroundImage: `url('https://cdn.poehali.dev/files/58c024e8-2d2e-49a9-ac0e-19692c531870.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-emerald-900/80"></div>
      
      {/* Header */}
      <Header backgroundImage="https://cdn.poehali.dev/files/4e95d530-7f57-4257-9e14-933aa912aea1.png" />

      {/* Share Button */}
      <ShareButton />

      {/* Navigation Menu */}
      <AccessBarsNavigation />

      {/* Hero Section */}
      <AccessBarsHero />

      {/* About Section */}
      <AccessBarsAbout />

      {/* Benefits Section */}
      <AccessBarsBenefits />

      {/* Sessions Section */}
      <AccessBarsSessions onBookingClick={(serviceId) => {
        setPreselectedService(serviceId);
        setIsBookingOpen(true);
      }} />

      {/* FAQ Section */}
      <AccessBarsFAQ />

      {/* Contact Section & Footer */}
      <AccessBarsContact />
      
      {/* Booking Form Modal */}
      <BookingForm 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        preselectedService={preselectedService}
      />
      </div>
    </>
  );
};

export default AccessBars;