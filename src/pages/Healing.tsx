import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import BookingForm from "@/components/BookingForm";

const Healing = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string>('');

  useEffect(() => {
    // Плавный скролл к якорю после загрузки страницы
    const hash = window.location.hash;
    if (hash) {
      // Очищаем хэш от параметров запроса
      const cleanHash = hash.split('?')[0];
      
      // Сначала прокручиваем в начало страницы
      window.scrollTo(0, 0);
      
      // Затем медленно прокручиваем к целевому разделу
      setTimeout(() => {
        const element = document.querySelector(cleanHash);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500); // Увеличенная задержка для более заметного эффекта
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
      title: "Телесное исцеление",
      duration: "60 мин",
      price: "8 000 ₽",
      description: "Работа с энергетическими блоками и восстановление баланса",
      benefits: [
        "Оздоровительная программа для тела",
        "Работа с психоэмоциональным фоном",
        "Реабилитация после тяжелых заболеваний",
        "Корректировка энергий в теле"
      ],
      icon: "Sparkles"
    },
    {
      title: "Дистанционное исцеление",
      duration: "60 мин",
      price: "7 000 ₽",
      description: "Энергетическая работа на расстоянии по видеосвязи из любой точки мира",
      benefits: [
        "Активация самоисцеления",
        "Снятие энергетических блоков",
        "Балансировка чакр",
        "Очищение ауры",
        "Работа с предназначением"
      ],
      icon: "Wifi"
    }
  ];

  const techniques = [];

  const results = [
    {
      icon: "Shield",
      title: "Энергетическая защита",
      description: "Укрепление энергетического поля и защита от негативных воздействий"
    },
    {
      icon: "Zap",
      title: "Повышение энергии",
      description: "Восстановление жизненной силы и энергетических ресурсов"
    },
    {
      icon: "Brain",
      title: "Ясность сознания",
      description: "Освобождение от ментальных блоков и повышение осознанности"
    },
    {
      icon: "Heart",
      title: "Эмоциональное исцеление",
      description: "Проработка травм и восстановление эмоционального равновесия"
    },
    {
      icon: "Sun",
      title: "Духовный рост",
      description: "Активация духовных способностей и расширение сознания"
    },
    {
      icon: "Smile",
      title: "Гармония в жизни",
      description: "Достижение внутреннего баланса и улучшение качества жизни"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover no-repeat fixed`}}>
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 opacity-0"></div>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover`}}></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover`}}></div>
      {/* Header */}
      <header className="shadow-lg sticky top-0 z-50 border-b border-gold-400/30 relative" style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover`}}>
        <div className="container mx-auto px-4 py-2 md:py-4 relative">
          <Navigation variant="secondary" />
        </div>
      </header>

      {/* Navigation Menu */}
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
          
          <div id="section-menu" className="hidden absolute bottom-12 md:top-12 md:bottom-auto right-0 w-64 bg-black/90 border-2 border-gold-400/50 rounded-lg shadow-2xl overflow-hidden">
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
                  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="ArrowUp" size={16} />
                В начало
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="Sparkles" size={16} />
                Услуги целительства
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="Target" size={16} />
                Результаты работы
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="Settings" size={16} />
                Процесс сеанса
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="Phone" size={16} />
                Записаться
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="MessageCircle" size={16} />
                Контакты
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="py-20 text-center relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-gold-100 mb-6">
              Перцептивные технологии <span className="text-gold-400">исцеления</span>
            </h2>
            <p className="text-emerald-100 mb-8 leading-relaxed text-center px-0 text-xl font-medium">Целительский сеанс.
Что это такое и как проходит?
Телесная практика на основе обучения "Перцептивные технологии" Школы Целителей Галины Серегиной.
Работа происходит с опорно-двигательным аппаратом, мышцами, связками тела и самое главное-психосоматическими процессами.
Это оздоровительный процесс!
Помогает при очень большом перечне заболеваний и дисфункций тела. Противопоказаний нет!
Можно детям, беременным и инвалидам.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#services">
                <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
                  <Icon name="Calendar" className="mr-2" size={20} />
                  Записаться на сеанс
                </Button>
              </a>
              <Button variant="outline" size="lg" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold" style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover`}}>
                <Icon name="Phone" className="mr-2" size={20} />
                Консультация
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 relative" style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover`}}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Услуги целительства</h3>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Индивидуальный подход к каждому клиенту с использованием различных техник
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group h-full" style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover`}} style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover`}}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-500"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover`}}>
                      <Icon name={service.icon} className="text-gold-400" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gold-400">{service.price}</span>
                  </div>
                  <CardTitle className="text-xl font-montserrat mb-2 text-gold-200">{service.title}</CardTitle>
                  <CardDescription className="text-base text-emerald-200">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-emerald-200">Длительность:</span>
                      <span className="text-emerald-200">{service.duration}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gold-200">Что включает:</h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Icon name="Check" className="text-gold-400 mt-0.5 flex-shrink-0" size={16} />
                            <span className="text-sm text-emerald-200">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full mt-6 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold transition-colors"
                      onClick={() => {
                        let serviceId = '';
                        if (service.title.includes('Энергетическое')) serviceId = 'energy-healing';
                        else if (service.title.includes('Дистанционное')) serviceId = 'remote-healing';
                        setPreselectedService(serviceId);
                        setIsBookingOpen(true);
                      }}
                    >
                      Записаться
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Techniques */}
      <section className="py-16 bg-emerald-800/20  relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Целительский сеанс.</h3>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">Что это такое и как проходит?
Телесная практика на основе обучения "Перцептивные технологии" Школы Целителей Галины Серегиной.
Работа происходит с опорно-двигательным аппаратом, мышцами, связками тела и самое главное-психосоматическими процессами.
Это оздоровительный процесс!
Помогает при очень большом перечне заболеваний и дисфункций тела. Противопоказаний нет!
Можно детям, беременным и инвалидам.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {techniques.map((technique, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow ">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-gold-400/20 to-gold-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="Sparkles" className="text-gold-400" size={28} />
                  </div>
                  <h4 className="font-montserrat font-bold text-lg text-gold-200">{technique.name}</h4>
                  <p className="text-emerald-200 text-sm leading-relaxed">{technique.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="py-16 relative" style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover`}}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Результаты работы</h3>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Что вы получите после сеансов перцептивного исцеления
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {results.map((result, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow bg-black/80 border-2 border-gold-400/50 shadow-xl">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gold-400/30 rounded-full flex items-center justify-center mx-auto">
                    <Icon name={result.icon} className="text-gold-400" size={32} />
                  </div>
                  <h4 className="font-montserrat font-bold text-lg text-gold-200">{result.title}</h4>
                  <p className="text-emerald-100 text-sm leading-relaxed">{result.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-16 bg-emerald-800/20  relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Как проходит сеанс</h3>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Диагностика", desc: "Сканирование энергетического поля" },
                { step: "2", title: "Настройка", desc: "Подготовка к исцелению" },
                { step: "3", title: "Работа", desc: "Энергетическое воздействие" },
                { step: "4", title: "Интеграция", desc: "Закрепление результата" }
              ].map((phase, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gold-400 text-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {phase.step}
                  </div>
                  <h4 className="font-semibold text-lg mb-2 text-gold-200">{phase.title}</h4>
                  <p className="text-emerald-200 text-sm">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 relative" style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover`}}>
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-montserrat font-bold text-3xl mb-6 text-gold-100">Готовы к исцелению?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-emerald-100">
            Запишитесь на консультацию, чтобы определить оптимальный план работы для вас
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+79184141221">
              <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
                <Icon name="Phone" className="mr-2" size={20} />
                +7(918) 414-1221
              </Button>
            </a>
            <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold" style={{background: `url('https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg') center/cover`}}>
              <Icon name="MessageCircle" className="mr-2" size={20} />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950/90 backdrop-blur-sm text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-montserrat font-bold text-2xl mb-4 text-gold-200">Гармония энергий</h3>
          <p className="text-emerald-200 mb-6">Перцептивные технологии</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <a href="tel:+79184141221" className="flex items-center gap-2 hover:text-gold-300 transition-colors">
              <Icon name="Phone" size={20} />
              <span>+7(918) 414-1221</span>
            </a>
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
      
      {/* Booking Form Modal */}
      <BookingForm 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        preselectedService={preselectedService}
      />
    </div>
  );
};

export default Healing;