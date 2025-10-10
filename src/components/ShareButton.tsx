import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const ShareButton = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  const currentUrl = `https://velikaya-nataliya.ru${location.pathname}`;
  const shareText = document.title || "Гармония энергий - Наталья Великая";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  const shareLinks = [
    {
      name: "Telegram",
      icon: "Send",
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
      color: "hover:bg-blue-500/20 hover:text-blue-400"
    },
    {
      name: "WhatsApp",
      icon: "MessageCircle",
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`,
      color: "hover:bg-green-500/20 hover:text-green-400"
    },
    {
      name: "ВКонтакте",
      icon: "Share2",
      url: `https://vk.com/share.php?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareText)}`,
      color: "hover:bg-blue-600/20 hover:text-blue-300"
    }
  ];

  return (
    <div className="fixed top-20 sm:top-22 md:top-24 left-2 md:left-4 z-40">
      <div className="group">
        <Button 
          className="bg-black/80 border-2 border-gold-400/50 text-gold-400 hover:bg-gold-400/10 shadow-xl text-xs md:text-sm"
          onClick={() => setIsShareOpen(!isShareOpen)}
        >
          <Icon name="Share2" size={16} />
          <span className="ml-1 md:ml-2 hidden sm:inline">Поделиться</span>
        </Button>
        
        <div className={`${isShareOpen ? 'block' : 'hidden'} absolute top-12 left-0 w-64 bg-black/95 border-2 border-gold-400/50 rounded-lg shadow-2xl overflow-hidden z-50`}>
          <div className="p-2 space-y-1">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full text-left px-4 py-3 text-gold-200 transition-colors rounded flex items-center gap-3 ${link.color}`}
                onClick={() => setIsShareOpen(false)}
              >
                <Icon name={link.icon as any} size={16} />
                {link.name}
              </a>
            ))}
            
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={handleCopyLink}
            >
              <Icon name={copied ? "Check" : "Copy"} size={16} />
              {copied ? "Скопировано!" : "Скопировать ссылку"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareButton;
