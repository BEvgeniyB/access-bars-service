import Icon from "@/components/ui/icon";
import PhoneLink from "@/components/ui/phone-link";

const Footer = () => {
  return (
    <footer className="bg-emerald-950/90 backdrop-blur-sm text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="font-montserrat font-bold text-2xl mb-4 text-gold-200">Гармония энергий</h3>
        <p className="text-emerald-200 mb-6">Ваш путь к внутренней гармонии и осознанности</p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <PhoneLink className="flex items-center gap-2 hover:text-gold-300 transition-colors">
            <Icon name="Phone" size={20} />
            <span>+7(918) 414-1221</span>
          </PhoneLink>
          <a href="https://t.me/velikaya_nataliya" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300 transition-colors">
            <Icon name="Send" size={20} />
            <span>@velikaya_nataliya</span>
          </a>
          <a href="https://t.me/NewWorld7d" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300 transition-colors">
            <Icon name="Send" size={20} />
            <span>Новый Мир 🌍</span>
          </a>
          <a href="https://www.instagram.com/velikaya_nataliya/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300 transition-colors">
            <Icon name="Instagram" size={20} />
            <span>@velikaya_nataliya</span>
          </a>
          <a href="https://vk.com/id71840974" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300 transition-colors">
            <Icon name="Users" size={20} />
            <span>VK</span>
          </a>
          <a href="https://youtube.com/channel/UCZ_Ukxv92QcpaTUzIKKS4VA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300 transition-colors">
            <Icon name="Youtube" size={20} />
            <span>Великая Наталья</span>
          </a>
        </div>
        
        <div className="mt-8 pt-8 border-t border-emerald-700">
          <p className="text-emerald-300">© 2025 Гармония энергий. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
