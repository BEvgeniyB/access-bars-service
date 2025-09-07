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
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold-200">Контакты</h4>
            <div className="space-y-2 text-emerald-200">
              <p>+7(918) 414-1221</p>
              <p>info@harmony-energy.ru</p>
              <p>Москва, ул. Примерная, 123</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold-200">Следите за нами</h4>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="text-emerald-200 hover:text-gold-400 p-2">
                <Icon name="Instagram" size={20} />
              </Button>
              <Button variant="ghost" size="sm" className="text-emerald-200 hover:text-gold-400 p-2">
                <Icon name="MessageCircle" size={20} />
              </Button>
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