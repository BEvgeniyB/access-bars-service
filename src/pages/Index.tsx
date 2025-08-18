import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const MassageWebsite = () => {
  const services = [
    {
      name: "Access Bars",
      duration: "90 мин",
      price: "от 5 000 ₽",
      description: "Энергетическая техника для освобождения от ментальных блоков и глубокой трансформации сознания",
      link: "/access-bars"
    },
    {
      name: "Обучение",
      duration: "От 4 часов", 
      price: "от 15 000 ₽",
      description: "Курсы по энергетическим практикам, массажу и целительству для начинающих и практикующих",
      link: "/training"
    },
    {
      name: "Массаж",
      duration: "60-90 мин",
      price: "от 3 500 ₽", 
      description: "Широкий спектр массажных техник: классический, ароматерапия, горячими камнями и другие виды",
      link: "/massage"
    },
    {
      name: "Целительство",
      duration: "60-120 мин",
      price: "от 4 000 ₽",
      description: "Энергетическое исцеление, работа с чакрами, аурой и восстановление баланса жизненных сил",
      link: "/healing"
    }
  ];

  return (
    <div 
      className="min-h-screen font-openSans relative overflow-hidden"
      style={{
        background: `url('https://cdn.poehali.dev/files/d701186a-e2c5-485d-b82a-f33656271ae8.jpg') center/cover no-repeat fixed`,
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-[0.5px]"></div>
      {/* Header */}
      <header className="bg-transparent backdrop-blur-none shadow-lg sticky top-0 z-50 border-b border-gold-400/30 relative">
        <div className="container mx-auto px-4 relative">
          {/* Logo */}
          <div className="text-center py-3 border-b border-gold-400/20 relative">
            {/* Natalia Logo in top left */}
            <img 
              src="/img/d400ba6e-3090-41d0-afab-e8e8c2a5655b.jpg" 
              alt="Natalia" 
              className="absolute top-1/2 left-0 -translate-y-1/2 w-20 h-12 opacity-95 hover:opacity-100 transition-opacity mix-blend-screen object-fill rounded-0"
              style={{filter: 'invert(1) brightness(1.5) sepia(1) saturate(4) hue-rotate(15deg) contrast(1.3)'}}
            />
            {/* Natalia Logo in top right */}
            <img 
              src="/img/d400ba6e-3090-41d0-afab-e8e8c2a5655b.jpg" 
              alt="Natalia" 
              className="absolute top-1/2 right-0 -translate-y-1/2 w-20 h-12 object-contain opacity-95 hover:opacity-100 transition-opacity mix-blend-screen"
              style={{filter: 'invert(1) brightness(1.5) sepia(1) saturate(4) hue-rotate(15deg) contrast(1.3)'}}
            />
            <h1 className="font-montserrat font-bold text-3xl text-gold-400">Гармония энергий</h1>
          </div>
          {/* Navigation */}
          <nav className="flex justify-center items-center py-4">
            <div className="flex gap-8 items-center">
              <a href="/access-bars" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Access Bars</a>
              <a href="/training" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Обучение</a>
              <a href="/massage" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Массаж</a>
              <a href="/healing" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Целительство</a>
              <a href="#about" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">О нас</a>
              <a href="#contact" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Контакты</a>
              <Button className="bg-gold-500 hover:bg-gold-600 text-emerald-900 font-bold border-2 border-gold-400 shadow-lg ml-4">
                Записаться
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Single Watermark N */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        <div 
          className="text-gold-400 text-[15rem] select-none"
          style={{
            fontFamily: 'Dancing Script, cursive', 
            fontWeight: 700,
          }}
        >
          N
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-32 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="animate-fade-in">
            <h2 className="font-montserrat font-bold text-6xl md:text-7xl text-gold-100 mb-8 leading-tight drop-shadow-2xl">
              Найдите свой
              <span className="text-gold-400 block bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">внутренний покой</span>
            </h2>
            <p className="text-xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed">Глубокие энергетические практики и исцеление в атмосфере абсолютного спокойствия и гармонии</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold px-10 py-4 text-lg shadow-2xl border-2 border-gold-400">
                <Icon name="Calendar" className="mr-3" size={24} />
                Записаться на сеанс
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold px-10 py-4 text-lg backdrop-blur-sm">
                <Icon name="Phone" className="mr-2" size={20} />
                +7 (495) 123-45-67
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="mt-16 relative">
          <div className="max-w-4xl mx-auto">
            <img 
              src="/img/a58463d0-dcdb-4e5c-9e75-59fff97e775a.jpg"
              alt="Spa massage stones"
              className="w-full h-96 object-cover rounded-3xl shadow-2xl animate-slide-up"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section 
        id="services" 
        className="py-20 relative"
        style={{
          background: `url('https://cdn.poehali.dev/files/8a7413c3-969a-448c-ba9d-ed0ecea21ba7.jpg') center/cover`,
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
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-emerald-800/30 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="font-montserrat text-xl text-gold-200 group-hover:text-gold-400 transition-colors">
                      {service.name}
                    </CardTitle>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gold-400">{service.price}</div>
                      <div className="text-sm text-emerald-200">{service.duration}</div>
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
      <section id="about" className="py-20 bg-gradient-to-r from-emerald-700/20 to-emerald-600/20 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-6">О ....</h2>
              <p className="text-lg text-emerald-100 mb-6 leading-relaxed">
                Гармония энергий — это оазис спокойствия в центре города. 
              </p>
              <p className="text-lg text-emerald-100 mb-4 leading-relaxed">
                Мастер Наталья — сертифицированный специалист с многолетним опытом в области энергетического исцеления и целительства. Владея уникальными техниками Access Bars, различными видами массажа и энергетического целительства, она создает индивидуальный подход для каждого клиента.
              </p>
              <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
                После сеансов с Натальей вы почувствуете глубокое расслабление и внутренний покой. Освободитесь от стресса и ментальных блоков, восстановите энергетический баланс и гармонию. Ваше тело обретет легкость, разум — ясность, а душа — спокойствие. Многие клиенты отмечают улучшение сна, повышение жизненной энергии и общее ощущение благополучия.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-emerald-800/30 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="text-3xl font-bold text-gold-400 mb-2">500+</div>
                  <div className="text-emerald-200">Довольных клиентов</div>
                </div>
                <div className="text-center p-6 bg-emerald-800/30 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="text-3xl font-bold text-gold-400 mb-2">5</div>
                  <div className="text-emerald-200">Лет опыта</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-emerald-800/30 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center">
                  <Icon name="Leaf" className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">100% натуральные компоненты</h3>
                  <p className="text-emerald-200">Только органические масла и экстракты</p>
                </div>
              </div>
              
              <div className="bg-emerald-800/30 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center">
                  <Icon name="Award" className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">Сертифицированный мастер</h3>
                  <p className="text-emerald-200">Международные дипломы и постоянное обучение</p>
                </div>
              </div>
              
              <div className="bg-emerald-800/30 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex items-center gap-4">
                <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center">
                  <Icon name="Heart" className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">Индивидуальный подход</h3>
                  <p className="text-emerald-200">Персональные программы для каждого клиента</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-emerald-800/30 backdrop-blur-sm relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-8">Записаться на сеанс</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Подарите себе момент полного расслабления и восстановления сил
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-3 text-lg">
              <Icon name="MapPin" className="text-gold-400" size={24} />
              <span className="text-emerald-200">ул. Спокойная, 15, Москва</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <Icon name="Clock" className="text-gold-400" size={24} />
              <span className="text-emerald-200">Ежедневно 9:00-21:00</span>
            </div>
          </div>
          
          <Button size="lg" className="mt-8 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-medium px-12 py-4 text-lg">
            <Icon name="Phone" className="mr-2" size={20} />
            Позвонить: +7 (495) 123-45-67
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950/90 backdrop-blur-sm text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-montserrat font-bold text-2xl mb-4 text-gold-200">Гармония энергий</h3>
          <p className="text-emerald-200 mb-6">Ваш путь к внутренней гармонии и красоте</p>
          
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <Icon name="Instagram" size={20} />
              <span>@spa_harmony</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Mail" size={20} />
              <span>info@spaharmony.ru</span>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-emerald-700">
            <p className="text-emerald-300">© 2024 Гармония энергий. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MassageWebsite;