import React from 'react';
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface PhoneCallButtonProps {
  phoneNumber?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "lg" | "default";
  variant?: "default" | "outline" | "ghost";
}

const PhoneCallButton: React.FC<PhoneCallButtonProps> = ({ 
  phoneNumber = "+79184141221", 
  children, 
  className = "",
  size = "default",
  variant = "default"
}) => {
  const isMoscowBusinessHours = (): boolean => {
    const now = new Date();
    const moscowTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
    const hours = moscowTime.getHours();
    return hours >= 12 && hours < 21;
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    if (!isMoscowBusinessHours()) {
      e.preventDefault();
      alert("Звонки принимаются с 12:00 до 21:00 по московскому времени.\n\nВы можете:\n• Оставить заявку через форму записи\n• Написать в Telegram: @velikaya_nataliya");
      return;
    }
    // Если время подходящее, ссылка сработает как обычно
  };

  const isBusinessHours = isMoscowBusinessHours();

  return (
    <a 
      href={`tel:${phoneNumber}`} 
      onClick={handlePhoneClick}
      className={!isBusinessHours ? 'opacity-75' : ''}
    >
      <Button 
        size={size} 
        variant={variant}
        className={`${className} ${!isBusinessHours ? 'bg-gray-500 hover:bg-gray-600' : ''}`}
      >
        <Icon 
          name="Phone" 
          className={`mr-2 ${!isBusinessHours ? 'text-gray-300' : ''}`} 
          size={size === "lg" ? 20 : 16} 
        />
        {children}
        {!isBusinessHours && (
          <span className="ml-2 text-xs opacity-75">
            (12:00-21:00 МСК)
          </span>
        )}
      </Button>
    </a>
  );
};

export default PhoneCallButton;