import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import AccessBarsHero from "@/components/AccessBars/AccessBarsHero";
import AccessBarsAbout from "@/components/AccessBars/AccessBarsAbout";
import AccessBarsBenefits from "@/components/AccessBars/AccessBarsBenefits";
import AccessBarsSessions from "@/components/AccessBars/AccessBarsSessions";
import AccessBarsNavigation from "@/components/AccessBars/AccessBarsNavigation";
import AccessBarsFAQ from "@/components/AccessBars/AccessBarsFAQ";
import AccessBarsContact from "@/components/AccessBars/AccessBarsContact";

const AccessBars = () => {
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
  }, []);

  return (
    <div className="min-h-screen font-openSans relative overflow-hidden" style={{backgroundImage: `url('https://cdn.poehali.dev/files/58c024e8-2d2e-49a9-ac0e-19692c531870.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-emerald-900/80"></div>
      
      {/* Header */}
      <header className="backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gold-400/30 relative" style={{
        backgroundImage: `url('https://cdn.poehali.dev/files/4e95d530-7f57-4257-9e14-933aa912aea1.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container mx-auto px-4 py-2 md:py-4 relative">
          <Navigation variant="secondary" />
        </div>
      </header>

      {/* Navigation Menu */}
      <AccessBarsNavigation />

      {/* Hero Section */}
      <AccessBarsHero />

      {/* About Section */}
      <AccessBarsAbout />

      {/* Benefits Section */}
      <AccessBarsBenefits />

      {/* Sessions Section */}
      <AccessBarsSessions />

      {/* FAQ Section */}
      <AccessBarsFAQ />

      {/* Contact Section & Footer */}
      <AccessBarsContact />
    </div>
  );
};

export default AccessBars;