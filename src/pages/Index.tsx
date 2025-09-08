import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import BookingForm from "@/components/BookingForm";


const MassageWebsite = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string>('');

  // Handle hash navigation on page load
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
    
    // Handle preselected service from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    if (service) {
      setPreselectedService(service);
      setIsBookingOpen(true);
    }
  }, []);

  const services = [
    {
      name: "Access Bars",
      duration: "90 мин",
      price: "от 8 000 ₽",
      description: "Энергетическая техника для освобождения от ментальных блоков и глубокой трансформации сознания",
      link: "/access-bars#sessions"
    },
    {
      name: "Целительство",
      duration: "60-120 мин",
      price: "от 7 000 ₽",
      description: "Энергетическое исцеление, работа с чакрами, аурой и восстановление баланса жизненных сил",
      link: "/healing#services"
    },
    {
      name: "Массаж",
      duration: "60-90 мин",
      price: "от 6 000 ₽", 
      description: "Широкий спектр массажных техник: классический, ароматерапия, горячими камнями и другие виды",
      link: "/massage#services"
    },
    {
      name: "Обучение",
      duration: "От 4 часов", 
      price: "от 29 000 ₽",
      description: "Курсы по энергетическим практикам, массажу и целительству для начинающих и практикующих",
      link: "/training#courses"
    }
  ];

  return (
    <div 
      className="min-h-screen font-openSans relative overflow-hidden"
      style={{
        background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover no-repeat fixed`,
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 opacity-0"></div>
      {/* Header */}
      <header className="shadow-lg sticky top-0 z-50 border-b border-gold-400/30 relative" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
        <div className="container mx-auto px-4 relative">
          {/* Logo */}
          <div className="text-center py-3 border-b border-gold-400/20 relative">
            {/* Natalia Logo in top left */}
            <img 
              src="/img/d400ba6e-3090-41d0-afab-e8e8c2a5655b.jpg" 
              alt="Natalia" 
              className="absolute top-1/2 left-0 -translate-y-1/2 w-12 sm:w-16 md:w-20 h-8 sm:h-10 md:h-12 opacity-95 hover:opacity-100 transition-opacity mix-blend-screen rounded-0 object-fill"
              style={{filter: 'invert(1) brightness(1.5) sepia(1) saturate(4) hue-rotate(15deg) contrast(1.3)'}}
            />
            {/* Natalia Logo in top right */}
            <img 
              src="/img/d400ba6e-3090-41d0-afab-e8e8c2a5655b.jpg" 
              alt="Natalia" 
              className="absolute top-1/2 right-0 -translate-y-1/2 w-12 sm:w-16 md:w-20 h-8 sm:h-10 md:h-12 opacity-95 hover:opacity-100 transition-opacity mix-blend-screen object-fill"
              style={{filter: 'invert(1) brightness(1.5) sepia(1) saturate(4) hue-rotate(15deg) contrast(1.3)'}}
            />
            <h1 className="font-montserrat font-bold text-xl sm:text-2xl md:text-3xl text-gold-400">Гармония энергий</h1>
          </div>
          {/* Navigation */}
          <Navigation variant="main" />
        </div>
      </header>



      {/* Navigation Menu */}
      <div className="fixed top-28 sm:top-32 md:top-36 left-2 md:left-4 z-40">
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
          
          <div id="section-menu" className="hidden absolute top-12 left-0 w-64 bg-black/95 border-2 border-gold-400/50 rounded-lg shadow-2xl overflow-hidden z-50">
            <div className="p-2 space-y-1">
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.querySelector('header')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="Home" size={16} />
                Главная
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="Sparkles" size={16} />
                Наши услуги
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="User" size={16} />
                Обо мне
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
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

      {/* Hero Section */}
      <main>
      <section id="hero" className="pt-24 pb-16 md:py-32 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          {/* Watermark N in Hero Section */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-5">
            <div 
              className="text-[36rem] select-none bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent opacity-30"
              style={{
                fontFamily: 'Dancing Script, cursive', 
                fontWeight: 700,
              }}
            >
              N
            </div>
          </div>
          <div className="animate-fade-in relative z-10">
            <h1 className="font-montserrat font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gold-100 mb-8 leading-tight drop-shadow-2xl">
              <span className="block">Найдите свой</span>
              <span className="text-gold-400 block bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">внутренний покой</span>
            </h1>
            <p className="text-xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed">Глубокие энергетические практики и исцеление в атмосфере абсолютного спокойствия и гармонии</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold px-10 py-4 text-lg shadow-2xl border-2 border-gold-400" onClick={() => setIsBookingOpen(true)}>ЗАПИСАТЬСЯ</Button>
              <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold px-10 py-4 text-lg" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <Icon name="Phone" className="mr-2" size={20} />
                +7(918) 414-1221
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hero Images Gallery */}
        <div className="mt-16 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="animate-slide-up">
                <img 
                  src="https://cdn.poehali.dev/files/38fa9efb-1bf6-477f-abf1-6f3cb074aea6.jpg"
                  alt="Женщина читает журнал на диване"
                  className="w-full h-80 shadow-2xl object-contain rounded-full"
                />
              </div>
              <div className="animate-slide-up delay-200">
                <img 
                  src="https://cdn.poehali.dev/files/c599f6e1-ea57-4258-8332-4b538420c522.JPG"
                  alt="Рефлексия на телесном уровне"
                  className="w-full h-80 shadow-2xl object-contain rounded-full"
                />
              </div>
              <div className="animate-slide-up delay-400">
                <img 
                  src="https://cdn.poehali.dev/files/bc543c40-0968-43ba-9d4d-9fa312634f00.JPG"
                  alt="Сеанс энерготерапии"
                  className="w-full h-80 shadow-2xl object-contain rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" 
        className="py-20 relative"
        style={{
          background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Наши услуги</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Широкий спектр массажных техник для вашего здоровья и красоты
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="font-montserrat text-xl text-gold-200 group-hover:text-gold-400 transition-colors">
                      {service.name}
                    </CardTitle>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gold-400">{service.price}</div>

                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-emerald-200 leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <Link to={service.link}>
                    <Button className="w-full mt-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
                      <Icon name="ArrowRight" className="mr-2" size={16} />
                      Подробнее
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" 
        className="py-20 relative"
        style={{
          background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-12 text-center">Обо мне ...</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div className="animate-fade-in">
              <div className="text-lg text-emerald-100 mb-8 leading-relaxed space-y-4">
                <p className="text-xl text-gold-200 font-semibold">
                  Духовный Наставник не по Образу, а по предназначению! 💫
                </p>
                
                <p>
                  Мой Дар уникальный и очень сильный!<br/>
                  Перешел как по маминой, так и по папиной линии Рода.<br/>
                  Две противоположные энергии соединились во мне и раскрыли необычную синергию энергий 💫
                </p>
                
                <p>
                  Ценность энергии в том, что я корректирую дисфункцию человека, как на физическом, так и на психическом и энергетическом уровнях.
                </p>
                
                <p>
                  После сеанса человек находит опору в себе, трезво смотрит на мир и при этом чувствует свободу и расширение своей энергии 💫
                </p>
                
                <p>
                  Более 6 лет я профессионально работаю с людьми и получаю хорошие результаты.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-emerald-800/30 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="text-3xl font-bold text-gold-400 mb-2">200+</div>
                  <div className="text-emerald-200">Довольных клиентов</div>
                </div>
                <div className="text-center p-6 bg-emerald-800/30 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="text-3xl font-bold text-gold-400 mb-2">6</div>
                  <div className="text-emerald-200">Лет опыта</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <p className="font-semibold text-center text-amber-400">
                  Позвольте себе погрузиться в мир гармонии и исцеления. Запишитесь на сеанс прямо сейчас!
                </p>
              </div>
              <div className="p-6 rounded-2xl shadow-lg flex items-center gap-4" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                  <Icon name="Heart" className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">Индивидуальный подход</h3>
                  <p className="text-emerald-200">Персональные программы для каждого клиента</p>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl shadow-lg flex items-center gap-4" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                  <Icon name="Award" className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">Сертифицированный мастер</h3>
                  <p className="text-emerald-200">Международные дипломы и постоянное обучение</p>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl shadow-lg flex items-center gap-4" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                  <Icon name="Leaf" className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">100% натуральные компоненты</h3>
                  <p className="text-emerald-200">Только органические масла и экстракты</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-8">Записаться на сеанс</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Подарите себе момент полного расслабления и восстановления сил
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-3 text-lg">
              <Icon name="MapPin" className="text-gold-400" size={24} />
              <span className="text-emerald-200">адрес уточню по телефону</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <Icon name="Clock" className="text-gold-400" size={24} />
              <span className="text-emerald-200">Ежедневно 12:00-22:00</span>
            </div>
          </div>
          
          <a href="tel:+79184141221">
            <Button size="lg" className="mt-8 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-medium px-12 py-4 text-lg hover:scale-105 transition-all duration-300">
              <Icon name="Phone" className="mr-2" size={20} />
              Позвонить: +7(918) 414-1221
            </Button>
          </a>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="text-white py-12" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-montserrat font-bold text-2xl mb-4 text-gold-200">Гармония энергий</h3>
          <p className="text-emerald-200 mb-6">Ваш путь к внутренней гармонии и красоте</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <a href="tel:+79184141221" className="flex items-center gap-2 hover:text-gold-300 transition-all duration-300 hover:scale-105">
              <Icon name="Phone" size={20} />
              <span>+7(918) 414-1221</span>
            </a>
            <a href="https://t.me/velikaya_nataliya" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300 transition-all duration-300 hover:scale-105">
              <Icon name="Send" size={20} />
              <span>@velikaya_nataliya</span>
            </a>
            <a href="https://t.me/NewWorld7d" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300 transition-all duration-300 hover:scale-105">
              <Icon name="Send" size={20} />
              <span>NewWorld7d</span>
            </a>
            <a href="https://www.youtube.com/@NewWorld7d" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-300 transition-all duration-300 hover:scale-105">
              <Icon name="Youtube" size={20} />
              <span>YouTube канал</span>
            </a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-emerald-700">
            <p className="text-emerald-300">© 2025 Гармония энергий. Все права защищены.</p>
          </div>
        </div>
      </footer>
      
      {/* Booking Form Modal */}
      <BookingForm 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        preselectedService={preselectedService}
      />
    </div>
  );
};

export default MassageWebsite;