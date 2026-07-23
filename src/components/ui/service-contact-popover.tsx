import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Icon from "@/components/ui/icon";
import { trackEvent, YMEvents } from "@/utils/yandexMetrika";
import { toast } from "sonner";

const TELEGRAM_USERNAME = "velikaya_nataliya";
const WHATSAPP_PHONE = "79184141221";
const MAX_LINK =
  "https://max.ru/u/f9LHodD0cOJSfu29fW-eM5wyD1w_SrofjdyRVHjfVWyAroq_MgyamiyLPC8";

interface ServiceContactPopoverProps {
  serviceName?: string;
  categories?: string[];
  label?: string;
  className?: string;
  buttonClassName?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  style?: React.CSSProperties;
}

const ServiceContactPopover = ({
  serviceName,
  categories,
  label = "Записаться",
  className = "",
  buttonClassName = "w-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold",
  size,
  variant,
  style,
}: ServiceContactPopoverProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const activeService = serviceName || selectedCategory || undefined;
  const showCategoryStep = !!categories && categories.length > 0 && !serviceName && !selectedCategory;

  const text = activeService
    ? `Здравствуйте! Хочу записаться на «${activeService}»`
    : "Здравствуйте! Хочу записаться на приём";
  const encodedText = encodeURIComponent(text);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedCategory(null);
    }
  };

  const handleClick = (channel: "telegram" | "whatsapp" | "max") => {
    if (channel === "telegram") {
      trackEvent(YMEvents.TELEGRAM_CLICK, { url: "telegram", service: activeService });
    } else if (channel === "whatsapp") {
      trackEvent(YMEvents.WHATSAPP_CLICK, { url: "whatsapp", service: activeService });
    }
  };

  const handleMaxClick = async () => {
    trackEvent(YMEvents.TELEGRAM_CLICK, { url: "max", service: activeService });
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Сообщение скопировано!", {
        description: "Вставьте его в чат MAX (Ctrl+V)",
      });
    } catch {
      // Буфер обмена недоступен — просто откроется чат
    }
    window.open(MAX_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button size={size} variant={variant} style={style} className={`${buttonClassName} ${className}`}>
          {label}
          <span className="flex items-center gap-1.5 ml-2">
            <Icon name="Send" size={16} className="text-sky-600" />
            <Icon name="MessageCircle" size={16} className="text-green-600" />
            <Icon name="CircleDot" size={16} className="text-blue-600" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        {showCategoryStep ? (
          <>
            <p className="text-xs text-muted-foreground px-2 pb-2">
              Выберите, что вас интересует:
            </p>
            <div className="flex flex-col gap-1">
              {categories!.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
                >
                  <span className="text-sm font-medium">{category}</span>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 px-2 pb-2">
              {categories && categories.length > 0 && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name="ChevronLeft" size={16} />
                </button>
              )}
              <p className="text-xs text-muted-foreground">
                {activeService ? `«${activeService}» — выберите мессенджер:` : "Выберите удобный мессенджер для связи:"}
              </p>
            </div>
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
              <button
                onClick={handleMaxClick}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
              >
                <Icon name="CircleDot" size={18} className="text-blue-500" />
                <span className="text-sm font-medium">MAX</span>
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ServiceContactPopover;