import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import PhoneLink from "@/components/ui/phone-link";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { useEffect, useState } from "react";
import BookingForm from "@/components/BookingForm";
import { businessStructuredData, servicesStructuredData, personStructuredData } from "@/data/structuredData";
import { trackEvent, YMEvents } from "@/utils/yandexMetrika";
import AdminButton from "@/components/AdminButton";
import ReviewsCarousel from "@/components/reviews/ReviewsCarousel";
import ShareButton from "@/components/ShareButton";


const MassageWebsite = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

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
      price: "от 7 000 ₽",
      description: "Телесная техника для освобождения от ментальных блоков и глубокой трансформации сознания",
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
      description: "Широкий спектр массажных техник: классический, ароматерапия и другие виды",
      link: "/massage#services"
    },
    {
      name: "Обучение",
      duration: "От 4 часов", 
      price: "29 000 ₽",
      description: "Обучение технике Access Bars",
      link: "/training#courses"
    }
  ];

  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      businessStructuredData,
      servicesStructuredData,
      personStructuredData
    ]
  };

  return (
    <>
      <SEOHead 
        title="Гармония энергий - Массаж, Access Bars, Целительство в Москве"
        description="Профессиональные услуги массажа, Access Bars, энергетического целительства и обучения в Москве. Наталья Великая - сертифицированный специалист. Записаться: +7(918) 414-1221"
        keywords="массаж Москва, Access Bars, энергетическое целительство, духовные практики, массаж спины, расслабляющий массаж, Наталья Великая"
        url="https://velikaya-nataliya.ru"
        image="https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg"
        structuredData={combinedStructuredData}
      />
      <div 
        className="min-h-screen font-openSans relative overflow-hidden"
        style={{
          background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover no-repeat fixed`,
        }}
      >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 opacity-0"></div>
      {/* Header */}
      <Header />

      {/* Share Button */}
      <ShareButton />

      {/* Navigation Menu */}
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
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <main>
      <div id="hero" className="scroll-target"></div>
      <section className="pt-16 pb-16 md:py-24 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          {/* Watermark N in Hero Section */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-5">
            <div 
              className="text-[12rem] sm:text-[14rem] md:text-[16rem] select-none bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent opacity-30"
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
              <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold px-10 py-4 text-lg shadow-2xl border-2 border-gold-400" onClick={() => {
                trackEvent(YMEvents.SCHEDULE_FORM_OPEN, { source: 'hero_button', page: 'index' });
                setIsBookingOpen(true);
              }}>ЗАПИСАТЬСЯ</Button>
              <PhoneLink>
                <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold px-10 py-4 text-lg" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                  <Icon name="Phone" className="mr-2" size={20} />
                  +7(918) 414-1221
                </Button>
              </PhoneLink>
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
      <div id="services" className="scroll-target"></div>
      <section className="py-20 relative"
        style={{
          background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Наши услуги</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">Широкий спектр телесных техник для вашего здоровья и красоты</p>
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
      <div id="about" className="scroll-target"></div>
      <section className="py-20 relative"
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

      {/* Reviews Section */}
      <div id="reviews" className="scroll-target"></div>
      <section className="py-20 relative"
        style={{
          background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Отзывы клиентов</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">Истории тех, кто уже нашел свой путь к гармонии</p>
          </div>

          <ReviewsCarousel />

          <div className="text-center mt-8">
            <Link to="/reviews">
              <Button 
                variant="outline" 
                className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 px-8 py-3"
              >
                Все отзывы
                <Icon name="ArrowRight" className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <div id="contact" className="scroll-target"></div>
      <section className="py-20 relative">
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
          
          <PhoneLink>
            <Button size="lg" className="mt-8 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-medium px-12 py-4 text-lg hover:scale-105 transition-all duration-300">
              <Icon name="Phone" className="mr-2" size={20} />
              Позвонить: +7(918) 414-1221
            </Button>
          </PhoneLink>
        </div>
      </section>
      </main>

      {/* Footer */}
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
      
      {/* Booking Form Modal */}
      <BookingForm 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        preselectedService={preselectedService}
      />
      
      {/* Admin Panel Access */}
      <AdminButton />
      </div>
    </>
  );
};

export default MassageWebsite;