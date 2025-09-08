import { Button } from "@/components/ui/button";

interface TrainingHeroProps {
  onBookingClick: () => void;
}

const TrainingHero = ({ onBookingClick }: TrainingHeroProps) => {
  return (
    <>
      <div id="hero" className="scroll-target"></div>
      <section className="pt-24 pb-12 text-center relative z-10" style={{
      backgroundImage: `url('https://cdn.poehali.dev/files/84b00c22-64c5-4a5c-b7ca-de55c4dac19d.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-gold-100 mb-6">
            Обучение технике <span className="text-gold-400">Access Bars</span>
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Освойте уникальную методику энергетического исцеления и откройте новые возможности 
            для себя и помощи другим
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold"
              onClick={onBookingClick}
            >Записаться</Button>
            <a href="tel:+79184141221">
              <Button variant="outline" size="lg" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold backdrop-blur-sm">+7(918) 414-1221</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default TrainingHero;