import React from 'react';
import Icon from "@/components/ui/icon";
import { trackEvent, YMEvents } from "@/utils/yandexMetrika";

interface TelegramLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const TelegramLink: React.FC<TelegramLinkProps> = ({ href, children, className = "" }) => {
  const handleTelegramClick = () => {
    trackEvent(YMEvents.TELEGRAM_CLICK, { 
      url: href,
      time: new Date().toISOString()
    });
  };

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={className}
      onClick={handleTelegramClick}
    >
      {children}
    </a>
  );
};

export default TelegramLink;