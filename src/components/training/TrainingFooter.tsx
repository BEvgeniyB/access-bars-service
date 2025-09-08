import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const TrainingFooter = () => {
  return (
    <footer className="bg-emerald-950/90 backdrop-blur-sm text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-montserrat font-bold text-xl mb-4 text-gold-200">Гармония энергий</h4>
            <p className="text-emerald-200 mb-4">Обучения и практики Access Bars в Москве</p>
          </div>
          <div className="col-span-2">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <Icon name="Phone" size={20} />
                <span>+7(918) 414-1221</span>
              </div>
              <a href="https://t.me/velikaya_nataliya" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300 transition-colors">
                <Icon name="Send" size={20} />
                <span>@velikaya_nataliya</span>
              </a>
              <a href="https://t.me/NewWorld7d" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300 transition-colors">
                <Icon name="Send" size={20} />
                <span>NewWorld7d</span>
              </a>
              <a href="https://youtube.com/channel/UCZ_Ukxv92QcpaTUzIKKS4VA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300 transition-colors">
                <Icon name="Youtube" size={20} />
                <span>YouTube канал</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-emerald-700 mt-8 pt-8 text-center text-emerald-300">
          <p>&copy; 2025 Гармония энергий. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default TrainingFooter;