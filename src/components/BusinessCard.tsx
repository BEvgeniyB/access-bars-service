import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface BusinessCardProps {
  onClose?: () => void;
}

const quotes = [
  "Когда я выбираю, что именно я хочу выбрать? И что из этого является выбором?",
  "Какое решение сделает меня сегодня счастливым?",
  "Когда ты принимаешь решение, на чей выбор ты опираешься?",
  "Везде, где ты не готов/а принять решение, ты не готов/а получить!",
  "Что опасного в получении? И где еще ты защищаешься от него?",
  "Тебе правда нужно все? Или может тебе нужно только твое?"
];

const BusinessCard = ({ onClose }: BusinessCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  }, [isFlipped]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0 text-white hover:bg-white/20"
        >
          <Icon name="X" size={24} />
        </Button>

        <div 
          className="business-card-container"
          style={{ 
            perspective: '1000px',
            width: '400px',
            height: '250px'
          }}
        >
          <div 
            className={`business-card-inner ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              position: 'relative',
              width: '400px',
              height: '250px',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <div 
              className="business-card text-white rounded-2xl shadow-2xl overflow-hidden"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                background: `url('https://cdn.poehali.dev/files/84efec35-e1b8-4feb-94a3-2726c46b8421.jpg') center/cover`
              }}
            >
              <div className="p-8 relative">
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                      <Icon name="Sparkles" className="text-emerald-900" size={32} />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-bold text-2xl text-gold-100">Духовный Наставник</h3>
                      <p className="text-emerald-200 text-sm text-center">Целительские практики<br />Душа, энергия, тело</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Icon name="Phone" className="text-gold-400" size={20} />
                      <a href="tel:+79184141221" className="text-emerald-100 hover:text-gold-200 transition-colors">
                        +7 (918) 414-1221
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Icon name="Globe" className="text-gold-400" size={20} />
                      <a href="https://velikaya-nataliya.ru/" target="_blank" rel="noopener noreferrer" className="text-emerald-100 hover:text-gold-200 transition-colors">velikaya-nataliya.ru</a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Icon name="Send" className="text-gold-400" size={20} />
                      <a href="https://t.me/velikaya_nataliya" target="_blank" rel="noopener noreferrer" className="text-emerald-100 hover:text-gold-200 transition-colors">
                        @velikaya_nataliya
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-gold-400/30 pt-4">
                    <p className="text-emerald-200 text-sm text-center italic">
                      Позвольте себе погрузиться в мир гармонии и исцеления 💫
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="business-card text-white rounded-2xl shadow-2xl overflow-hidden"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: `url('https://cdn.poehali.dev/files/c07f561b-dede-46dd-a1f0-1c390d8e783e.jpg') center/cover`
              }}
            >
              <div className="p-8 h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative z-10 text-center">
                  <Icon name="Quote" className="text-gold-400 mx-auto mb-4" size={48} />
                  <p className="font-montserrat text-xl md:text-2xl text-gold-100 leading-relaxed italic">
                    {currentQuote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button
            onClick={() => window.print()}
            className="bg-gold-400 hover:bg-gold-500 text-emerald-900 font-medium"
          >
            <Icon name="Printer" className="mr-2" size={18} />
            Распечатать визитку
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;