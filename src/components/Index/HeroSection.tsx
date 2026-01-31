import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import PhoneLink from "@/components/ui/phone-link";
import { Link } from "react-router-dom";
import { trackEvent, YMEvents } from "@/utils/yandexMetrika";
import { BACKGROUND_IMAGES, getBackgroundStyle } from "@/constants/images";

interface HeroSectionProps {
  setIsBookingOpen: (value: boolean) => void;
}

const HeroSection = ({ setIsBookingOpen }: HeroSectionProps) => {
  return (
    <>
      <div id="hero" className="scroll-target"></div>
      <section className="pt-20 pb-16 md:py-24 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-5">
            <div 
              className="text-[12rem] sm:text-[14rem] md:text-[16rem] select-none bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent opacity-30"
              style={{
                fontFamily: 'Dancing Script, cursive', 
                fontWeight: 700,
              }}
            >
              N
            </div>
          </div>
          <div className="animate-fade-in relative z-10">
            <h1 className="font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gold-100 mb-8 leading-tight drop-shadow-2xl">
              <span className="block">Создай своё</span>
              <span className="text-gold-400 block bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">состояние</span>
            </h1>
            <p className="text-xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed">Глубокие энергетические практики и исцеление в атмосфере абсолютного спокойствия и гармонии</p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold px-8 py-4 text-lg shadow-2xl border-2 border-gold-400" onClick={() => {
                trackEvent(YMEvents.SCHEDULE_FORM_OPEN, { source: 'hero_button', page: 'index' });
                setIsBookingOpen(true);
              }}>ЗАПИСАТЬСЯ</Button>
              <PhoneLink>
                <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold px-8 py-4 text-lg" style={getBackgroundStyle(BACKGROUND_IMAGES.PRIMARY)}>
                  <Icon name="Phone" className="mr-2" size={20} />
                  +7(918) 414-1221
                </Button>
              </PhoneLink>
              <Link to="/reviews">
                <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold px-8 py-4 text-lg">
                  <Icon name="Star" className="mr-2" size={20} />
                  Все отзывы
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-16 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="animate-slide-up">
                <img 
                  src="https://cdn.poehali.dev/files/38fa9efb-1bf6-477f-abf1-6f3cb074aea6.jpg"
                  alt="Женщина читает журнал на диване"
                  className="w-full h-80 shadow-2xl object-contain rounded-full"
                />
              </div>
              <div className="animate-slide-up delay-200">
                <img 
                  src="https://cdn.poehali.dev/files/c599f6e1-ea57-4258-8332-4b538420c522.JPG"
                  alt="Рефлексия на телесном уровне"
                  className="w-full h-80 shadow-2xl object-contain rounded-full"
                />
              </div>
              <div className="animate-slide-up delay-400">
                <img 
                  src="https://cdn.poehali.dev/files/bc543c40-0968-43ba-9d4d-9fa312634f00.JPG"
                  alt="Сеанс энерготерапии"
                  className="w-full h-80 shadow-2xl object-contain rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;