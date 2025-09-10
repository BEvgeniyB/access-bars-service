import React from 'react';
import Icon from "@/components/ui/icon";

interface PhoneLinkProps {
  phoneNumber?: string;
  children: React.ReactNode;
  className?: string;
}

const PhoneLink: React.FC<PhoneLinkProps> = ({ 
  phoneNumber = "+79184141221", 
  children, 
  className = ""
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
  };

  const isBusinessHours = isMoscowBusinessHours();

  return (
    <a 
      href={`tel:${phoneNumber}`} 
      onClick={handlePhoneClick}
      className={`${className} ${!isBusinessHours ? 'opacity-75 cursor-not-allowed' : ''}`}
      title={!isBusinessHours ? 'Звонки принимаются с 12:00 до 21:00 МСК' : 'Позвонить сейчас'}
    >
      {children}
      {!isBusinessHours && (
        <span className="ml-1 text-xs opacity-75">
          (12:00-21:00 МСК)
        </span>
      )}
    </a>
  );
};

export default PhoneLink;