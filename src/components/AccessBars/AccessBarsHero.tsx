import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const AccessBarsHero = () => {
  return (
    <section className="pt-16 pb-16 md:py-20 px-4 text-center relative overflow-hidden" style={{backgroundImage: `url('https://cdn.poehali.dev/files/12b737b3-bf4d-499d-8f9a-ff594a4f705f.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="container mx-auto relative z-10">
        <div className="animate-fade-in">
          <h2 className="font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gold-100 mb-6 leading-tight drop-shadow-2xl">
            <span className="block">Access Bars</span>
            <span className="text-gold-400 block bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent text-4xl">Энергетическая техника освобождения разума</span>
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Уникальная методика работы с энергетическими точками головы для глубокого расслабления, 
            освобождения от стресса и активации внутренних ресурсов организма
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#sessions">
              <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold px-8 py-3 text-lg shadow-2xl border-2 border-gold-400">
                <Icon name="Calendar" className="mr-2" size={20} />
                Выбрать сессию
              </Button>
            </a>
            <a href="#benefits">
              <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold px-8 py-3 text-lg backdrop-blur-sm">
                <Icon name="Heart" className="mr-2" size={20} />
                Польза Access Bars
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      {/* Hero Images */}
      <div className="mt-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <img 
              src="https://cdn.poehali.dev/files/ce1034c3-ae7a-425f-9eb0-7c2712c3c240.jpg"
              alt="Специалист Access Bars"
              className="w-full h-96 object-cover rounded-3xl shadow-2xl animate-slide-up md:block hidden"
            />
            <img 
              src="https://cdn.poehali.dev/files/40e60d43-5726-43aa-869b-a862f9704781.jpg"
              alt="Access Bars therapy session"
              className="w-full h-96 object-cover rounded-3xl shadow-2xl animate-slide-up"
            />
            <img 
              src="https://cdn.poehali.dev/files/2e7c5f05-7502-4d70-8942-b7055e5a89f5.jpg"
              alt="Консультация Access Bars"
              className="w-full h-96 object-cover rounded-3xl shadow-2xl animate-slide-up md:block hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessBarsHero;