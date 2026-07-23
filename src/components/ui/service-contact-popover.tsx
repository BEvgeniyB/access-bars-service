import { Button, ButtonProps } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Icon from "@/components/ui/icon";
import { trackEvent, YMEvents } from "@/utils/yandexMetrika";

const TELEGRAM_USERNAME = "velikaya_nataliya";
const WHATSAPP_PHONE = "79184141221";
const MAX_LINK =
  "https://max.ru/u/f9LHodD0cOJSfu29fW-eM5wyD1w_SrofjdyRVHjfVWyAroq_MgyamiyLPC8";

interface ServiceContactPopoverProps {
  serviceName?: string;
  label?: string;
  className?: string;
  buttonClassName?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  style?: React.CSSProperties;
}

const ServiceContactPopover = ({
  serviceName,
  label = "Записаться",
  className = "",
  buttonClassName = "w-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold",
  size,
  variant,
  style,
}: ServiceContactPopoverProps) => {
  const text = serviceName
    ? `Здравствуйте! Хочу записаться на «${serviceName}»`
    : "Здравствуйте! Хочу записаться на приём";
  const encodedText = encodeURIComponent(text);

  const handleClick = (channel: "telegram" | "whatsapp" | "max") => {
    if (channel === "telegram") {
      trackEvent(YMEvents.TELEGRAM_CLICK, { url: "telegram", service: serviceName });
    } else if (channel === "whatsapp") {
      trackEvent(YMEvents.WHATSAPP_CLICK, { url: "whatsapp", service: serviceName });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={size} variant={variant} style={style} className={`${buttonClassName} ${className}`}>
          <Icon name="Calendar" className="mr-2" size={16} />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <p className="text-xs text-muted-foreground px-2 pb-2">
          Выберите удобный мессенджер для связи:
        </p>
        <div className="flex flex-col gap-1">
          <a
            href={`https://t.me/${TELEGRAM_USERNAME}?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick("telegram")}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
          >
            <Icon name="Send" size={18} className="text-sky-500" />
            <span className="text-sm font-medium">Telegram</span>
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick("whatsapp")}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
          >
            <Icon name="MessageCircle" size={18} className="text-green-500" />
            <span className="text-sm font-medium">WhatsApp</span>
          </a>
          <a
            href={MAX_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick("max")}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
          >
            <Icon name="CircleDot" size={18} className="text-blue-500" />
            <span className="text-sm font-medium">MAX</span>
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ServiceContactPopover;