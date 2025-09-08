import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const AccessBarsContact = () => {
  return (
    <>
      {/* Contact Section */}
      <section id="booking" className="py-20 bg-emerald-800/30 backdrop-blur-sm relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-8">Записаться на Access Bars</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Откройте для себя новый уровень расслабления и внутренней гармонии
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <div className="flex items-center gap-3 text-lg">
              <Icon name="User" className="text-gold-400" size={24} />
              <span className="text-emerald-200">Сертифицированный специалист</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <Icon name="Shield" className="text-gold-400" size={24} />
              <span className="text-emerald-200">100% безопасность</span>
            </div>
          </div>
          
          <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-medium px-12 py-4 text-lg">
            <Icon name="Phone" className="mr-2" size={20} />
            Позвонить: +7(918) 414-1221
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950/90 backdrop-blur-sm text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-montserrat font-bold text-2xl mb-4 text-gold-200">Гармония энергий</h3>
          <p className="text-emerald-200 mb-6">Access Bars и классический массаж для вашего благополучия</p>
          
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
          
          <div className="mt-8 pt-8 border-t border-emerald-700">
            <p className="text-emerald-300">© 2025 Гармония энергий. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AccessBarsContact;