import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface NavigationMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  closeMenu: () => void;
}

const NavigationMenu = ({ isMenuOpen, setIsMenuOpen, closeMenu }: NavigationMenuProps) => {
  return (
    <div className="fixed top-20 sm:top-22 md:top-24 right-2 md:right-4 z-40">
      <div className="group">
        <Button 
          className="bg-black/80 border-2 border-gold-400/50 text-gold-400 hover:bg-gold-400/10 shadow-xl text-xs md:text-sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Icon name="Menu" size={16} />
          <span className="ml-1 md:ml-2 hidden sm:inline">Разделы</span>
        </Button>
        
        <div className={`${isMenuOpen ? 'block' : 'hidden'} absolute top-12 right-0 w-64 bg-black/95 border-2 border-gold-400/50 rounded-lg shadow-2xl overflow-hidden z-50`}>
          <div className="p-2 space-y-1">
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                closeMenu();
              }}
            >
              <Icon name="Home" size={16} />
              Главная
            </button>
            
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                closeMenu();
              }}
            >
              <Icon name="Sparkles" size={16} />
              Наши услуги
            </button>
            
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                closeMenu();
              }}
            >
              <Icon name="User" size={16} />
              Обо мне
            </button>
            
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={() => {
                document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                closeMenu();
              }}
            >
              <Icon name="MessageSquare" size={16} />
              Отзывы
            </button>
            
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                closeMenu();
              }}
            >
              <Icon name="Phone" size={16} />
              Контакты
            </button>
            
            <div className="border-t border-gold-400/30 my-2"></div>
            
            <a 
              href="tel:+79184141221"
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={closeMenu}
            >
              <Icon name="Phone" size={16} />
              +7(918) 414-1221
            </a>
            
            <a 
              href="https://t.me/velikaya_nataliya"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={closeMenu}
            >
              <Icon name="Send" size={16} />
              @velikaya_nataliya
            </a>
            
            <a 
              href="https://t.me/NewWorld7d"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={closeMenu}
            >
              <Icon name="Send" size={16} />
              Новый Мир 🌍
            </a>
            
            <a 
              href="https://www.instagram.com/velikaya_nataliya/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={closeMenu}
            >
              <Icon name="Instagram" size={16} />
              @velikaya_nataliya
            </a>
            
            <a 
              href="https://vk.com/id71840974"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={closeMenu}
            >
              <Icon name="Users" size={16} />
              VK
            </a>
            
            <a 
              href="https://youtube.com/channel/UCZ_Ukxv92QcpaTUzIKKS4VA"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={closeMenu}
            >
              <Icon name="Youtube" size={16} />
              Великая Наталья
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;