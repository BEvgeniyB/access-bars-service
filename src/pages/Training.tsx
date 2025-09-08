import { useEffect, useState } from "react";
import Header from "@/components/Header";
import TrainingBookingForm from "@/components/TrainingBookingForm";
import TrainingHero from "@/components/training/TrainingHero";
import TrainingCourses from "@/components/training/TrainingCourses";
import TrainingBenefits from "@/components/training/TrainingBenefits";
import TrainingTestimonials from "@/components/training/TrainingTestimonials";
import TrainingFooter from "@/components/training/TrainingFooter";
import TrainingNavigation from "@/components/training/TrainingNavigation";

const Training = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string>('');

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => observer.observe(el));

    const style = document.createElement('style');
    style.textContent = `
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('[style*="background-attachment: fixed"]');
      
      parallaxElements.forEach((element) => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        (element as HTMLElement).style.backgroundPosition = `center ${yPos}px`;
      });
    };

    window.addEventListener('scroll', handleScroll);

    setTimeout(() => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.style.opacity = '1';
        heroSection.style.transform = 'translateY(0)';
      }
    }, 500);
    
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    if (service) {
      setPreselectedService(service);
      setIsBookingOpen(true);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(style);
    };
  }, []);

  const handleBookingClick = () => {
    setPreselectedService('training-basic');
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950">
      <Header />
      
      <TrainingHero onBookingClick={handleBookingClick} />
      
      <TrainingCourses onBookingClick={handleBookingClick} />
      
      <TrainingBenefits />
      
      <TrainingTestimonials />
      
      <TrainingFooter />
      
      <TrainingNavigation />
      
      <TrainingBookingForm 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        preselectedService={preselectedService}
      />
    </div>
  );
};

export default Training;