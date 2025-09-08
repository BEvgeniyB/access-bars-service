import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const TrainingNavigation = () => {
  return (
    <div className="fixed bottom-4 right-4 md:top-16 md:bottom-auto md:right-2 md:left-auto z-40">
      <div className="group">
        <Button 
          className="bg-black/80 border-2 border-gold-400/50 text-gold-400 hover:bg-gold-400/10 shadow-xl text-xs md:text-sm"
          onClick={() => {
            const menu = document.getElementById('section-menu');
            menu?.classList.toggle('hidden');
          }}
        >
          <Icon name="Menu" size={16} />
          <span className="ml-1 md:ml-2 hidden sm:inline">Разделы</span>
        </Button>
        
        <div id="section-menu" className="hidden absolute bottom-12 md:top-12 md:bottom-auto right-0 w-56 md:w-64 bg-black/95 border-2 border-gold-400/50 rounded-lg shadow-2xl overflow-hidden z-50">
          <div className="p-2 space-y-1">
            <a 
              href="/"
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3 block"
              onClick={() => {
                document.getElementById('section-menu')?.classList.add('hidden');
              }}
            >
              <Icon name="Home" size={16} />
              Главная
            </a>
            
            <a 
              href="/#about"
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3 block"
              onClick={() => {
                document.getElementById('section-menu')?.classList.add('hidden');
              }}
            >
              <Icon name="User" size={16} />
              Обо мне
            </a>
            
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={() => {
                document.querySelector('header')?.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('section-menu')?.classList.add('hidden');
              }}
            >
              <Icon name="ArrowUp" size={16} />
              В начало
            </button>
            
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={() => {
                document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('section-menu')?.classList.add('hidden');
              }}
            >
              <Icon name="GraduationCap" size={16} />
              Обучение Access Bars
            </button>
            
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={() => {
                document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('section-menu')?.classList.add('hidden');
              }}
            >
              <Icon name="BookOpen" size={16} />
              Курсы
            </button>
            
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={() => {
                document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('section-menu')?.classList.add('hidden');
              }}
            >
              <Icon name="Target" size={16} />
              Преимущества
            </button>
            
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={() => {
                document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('section-menu')?.classList.add('hidden');
              }}
            >
              <Icon name="Star" size={16} />
              Отзывы
            </button>
            
            <button 
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={() => {
                document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('section-menu')?.classList.add('hidden');
              }}
            >
              <Icon name="Phone" size={16} />
              Контакты
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingNavigation;