import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const Massage = () => {
  const services = [
    {
      title: "Классический массаж",
      duration: "60 мин",
      price: "6 000 ₽",
      description: "Глубокая проработка мышц и суставов для снятия напряжения и восстановления",
      benefits: [
        "Улучшение кровообращения",
        "Снятие мышечного напряжения", 
        "Восстановление подвижности",
        "Общее оздоровление организма"
      ],
      icon: "Heart"
    },
    {
      title: "Ароматерапия",
      duration: "60 мин",
      price: "5 000 ₽",
      description: "Расслабляющий массаж с натуральными эфирными маслами",
      benefits: [
        "Глубокое расслабление",
        "Снятие стресса и тревоги",
        "Гармонизация эмоций",
        "Улучшение сна"
      ],
      icon: "Flower"
    },
    {
      title: "Комплексная программа",
      duration: "90 мин",
      price: "6 500 ₽",
      description: "Сочетание классических техник с ароматерапией",
      benefits: [
        "Комплексное оздоровление",
        "Максимальный терапевтический эффект",
        "Индивидуальный подход",
        "Долговременный результат"
      ],
      icon: "Sparkles"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="font-montserrat font-bold text-2xl text-gold-400">
            Гармония энергий
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="/#services" className="text-emerald-100 hover:text-gold-400 transition-colors font-medium">Главная
</a>
            <a href="/#about" className="text-emerald-100 hover:text-gold-400 transition-colors font-medium">О нас</a>
            <a href="/#contact" className="text-emerald-100 hover:text-gold-400 transition-colors font-medium">Контакты</a>
          </nav>
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="fixed top-20 left-4 z-40">
        <div className="group">
          <Button 
            className="bg-black/80 border-2 border-gold-400/50 text-gold-400 hover:bg-gold-400/10 shadow-xl"
            onClick={() => {
              const menu = document.getElementById('section-menu');
              menu?.classList.toggle('hidden');
            }}
          >
            <Icon name="Menu" size={20} />
            <span className="ml-2 hidden sm:inline">Разделы</span>
          </Button>
          
          <div id="section-menu" className="hidden absolute top-12 left-0 w-64 bg-black/90 border-2 border-gold-400/50 rounded-lg shadow-2xl overflow-hidden">
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
                Виды массажа
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="Heart" size={16} />
                Польза массажа
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="Phone" size={16} />
                Записаться
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="py-32 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-emerald-800/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-gold-400/20">
              <Icon name="Heart" className="text-gold-400" size={16} />
              <span className="text-sm font-medium text-gold-200">Профессиональный массаж</span>
            </div>
            
            <h1 className="font-montserrat font-bold text-6xl md:text-7xl text-gold-100 mb-8 leading-tight drop-shadow-2xl">
              Массаж и
              <span className="text-gold-400 block bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">Ароматерапия</span>
            </h1>
            
            <p className="text-xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Восстановите гармонию тела и души с помощью классических техник массажа 
              и целебной силы натуральных эфирных масел
            </p>

            {/* Мастер инфо */}
            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto mb-8 border border-gold-400/20 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center">
                  <Icon name="Award" className="text-gold-400" size={20} />
                </div>
                <div className="text-left">
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">Сертифицированный мастер</h3>
                  <p className="text-sm text-emerald-200">6 лет профессионального опыта</p>
                </div>
              </div>
              <p className="text-sm text-emerald-200">
                Профессиональное образование и многолетний опыт для вашего здоровья
              </p>
            </div>
          </div>
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-gold-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-gold-400/5 to-transparent rounded-full blur-3xl"></div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-emerald-800/30 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Услуги массажа</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Выберите подходящую программу для восстановления и оздоровления
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-emerald-800/30 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gold-400/20 rounded-xl flex items-center justify-center">
                      <Icon name={service.icon as any} className="text-gold-400" size={20} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gold-400">{service.price}</div>
                      <div className="text-sm text-emerald-200">{service.duration}</div>
                    </div>
                  </div>
                  <CardTitle className="font-montserrat text-xl text-gold-200 group-hover:text-gold-400 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-emerald-200 leading-relaxed mb-4">
                    {service.description}
                  </CardDescription>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gold-200 text-sm mb-3">Эффект:</h4>
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Icon name="Check" className="text-gold-400" size={14} />
                        <span className="text-xs text-emerald-200">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-6 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
                    <Icon name="Calendar" className="mr-2" size={16} />
                    Записаться
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-700/20 to-emerald-600/20 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Преимущества массажа</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Научно доказанные эффекты массажной терапии для здоровья
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "Zap", title: "Энергия", desc: "Восстановление жизненных сил" },
              { icon: "Shield", title: "Иммунитет", desc: "Укрепление защитных функций" },
              { icon: "Moon", title: "Сон", desc: "Улучшение качества отдыха" },
              { icon: "Smile", title: "Настроение", desc: "Снятие стресса и тревог" }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-emerald-800/30 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gold-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={item.icon as any} className="text-gold-400" size={24} />
                </div>
                <h3 className="font-montserrat font-bold text-gold-200 mb-2">{item.title}</h3>
                <p className="text-sm text-emerald-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-800 to-emerald-700 rounded-3xl p-12 text-center border-2 border-gold-400/30 shadow-2xl animate-fade-in">
            <div className="w-20 h-20 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Calendar" className="text-gold-400" size={32} />
            </div>
            <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-6">Запишитесь на сеанс</h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Доверьтесь опытному мастеру с 6-летним стажем для восстановления 
              вашего здоровья и гармонии
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold px-10 py-4 text-lg shadow-xl">
                <Icon name="Heart" className="mr-3" size={20} />
                Записаться на массаж
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold px-10 py-4 text-lg backdrop-blur-sm">
                <Icon name="Phone" className="mr-2" size={18} />
                +7(918) 414-1221
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Massage;