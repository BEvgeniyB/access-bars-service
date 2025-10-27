import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface BusinessCardProps {
  onClose?: () => void;
}

const BusinessCard = ({ onClose }: BusinessCardProps) => {
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
          className="business-card text-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
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
                  <p className="text-emerald-200 text-sm">Целительские практики</p>
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
                  <a href="https://t.me/yourchannel" target="_blank" rel="noopener noreferrer" className="text-emerald-100 hover:text-gold-200 transition-colors">
                    @bodyhealing
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