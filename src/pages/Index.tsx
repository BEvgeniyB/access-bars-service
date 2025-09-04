import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const MassageWebsite = () => {
  const services = [
    {
      name: "Access Bars",
      duration: "90 мин",
      price: "от 8 000 ₽",
      description: "Энергетическая техника для освобождения от ментальных блоков и глубокой трансформации сознания",
      link: "/access-bars"
    },
    {
      name: "Целительство",
      duration: "60-120 мин",
      price: "от 7 000 ₽",
      description: "Энергетическое исцеление, работа с чакрами, аурой и восстановление баланса жизненных сил",
      link: "/healing"
    },
    {
      name: "Массаж",
      duration: "60-90 мин",
      price: "от 6 000 ₽", 
      description: "Широкий спектр массажных техник: классический, ароматерапия, горячими камнями и другие виды",
      link: "/massage"
    },
    {
      name: "Обучение",
      duration: "От 4 часов", 
      price: "от 29 000 ₽",
      description: "Курсы по энергетическим практикам, массажу и целительству для начинающих и практикующих",
      link: "/training"
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
              <a href="#about" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Обо мне
</a>
              <a href="#contact" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Контакты</a>
              <Button className="bg-gold-500 hover:bg-gold-600 text-emerald-900 font-bold border-2 border-gold-400 shadow-lg ml-4">
                Записаться
              </Button>
            </div>
          </nav>
        </div>
      </header>



      {/* Navigation Menu */}
      <div className="fixed top-20 left-4 z-40">
        <div className="group">
          <Button 
            className="border-2 border-gold-400/50 text-gold-400 hover:bg-gold-400/10 shadow-xl" 
            style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}
            onClick={() => {
              const menu = document.getElementById('section-menu');
              menu?.classList.toggle('hidden');
            }}
          >
            <Icon name="Menu" size={20} />
            <span className="ml-2 hidden sm:inline">Разделы</span>
          </Button>
          
          <div id="section-menu" className="hidden absolute top-12 left-0 w-64 border-2 border-gold-400/50 rounded-lg shadow-2xl overflow-hidden" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
            <div className="p-2 space-y-1">
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
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
      <section id="hero" className="py-32 px-4 text-center relative overflow-hidden">
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
            <h2 className="font-montserrat font-bold text-6xl md:text-7xl text-gold-100 mb-8 leading-tight drop-shadow-2xl">
              Найдите свой
              <span className="text-gold-400 block bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">внутренний покой</span>
            </h2>
            <p className="text-xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed">Глубокие энергетические практики и исцеление в атмосфере абсолютного спокойствия и гармонии</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold px-10 py-4 text-lg shadow-2xl border-2 border-gold-400" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>ЗАПИСАТЬСЯ</Button>
              <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold px-10 py-4 text-lg" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <Icon name="Phone" className="mr-2" size={20} />
                +7(918)4141221
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
        id="services" 
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
        id="about" 
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
              <p className="text-lg text-emerald-100 mb-6 leading-relaxed">
                Гармония энергий — это оазис спокойствия в центре города. 
              </p>
              <div className="text-lg text-emerald-100 mb-8 leading-relaxed space-y-2">
                <div className="mb-3">
                  <h3 className="font-montserrat font-semibold text-2xl text-gold-200 mb-2">Профессиональный целитель и наставник</h3>
                  <p className="text-lg text-emerald-100">Ваш путь к гармонии тела и души</p>
                </div>

                <div className="mb-3">
                  <h4 className="font-montserrat font-semibold text-xl text-gold-300 mb-1">О специалисте</h4>
                  <ul className="list-disc list-inside space-y-1 text-emerald-100">
                    <li>Сертифицированный мастер с 6-летним опытом работы</li>
                    <li>Духовный наставник по призванию</li>
                    <li>Эксперт в области энергетического целительства</li>
                    <li>Владею техниками Access Bars, перцептивными технологиями и массажем</li>
                  </ul>
                </div>

                <div className="mb-3">
                  <h4 className="font-montserrat font-semibold text-xl text-gold-300 mb-1">Уникальное наследие</h4>
                  <ul className="list-disc list-inside space-y-1 text-emerald-100">
                    <li>Двойная энергия — дар, переданный по материнской и отцовской линии</li>
                    <li>Особая синергия противоположных энергий</li>
                    <li>Индивидуальный подход к каждому клиенту</li>
                  </ul>
                </div>

                <div className="mb-3">
                  <h4 className="font-montserrat font-semibold text-xl text-gold-300 mb-1">Ключевые направления работы</h4>
                  <ul className="list-disc list-inside space-y-1 text-emerald-100">
                    <li>Access Bars — освобождение разума от ментальных блоков</li>
                    <li>Энергетическое целительство</li>
                    <li>Различные техники массажа</li>
                    <li>Перцептивные технологии</li>
                  </ul>
                </div>

                <div className="mb-3">
                  <h4 className="font-montserrat font-semibold text-xl text-gold-300 mb-1">Результаты работы</h4>
                  <ul className="list-disc list-inside space-y-1 text-emerald-100">
                    <li>Глубокое расслабление и внутренний покой</li>
                    <li>Освобождение от стресса и ментальных блоков</li>
                    <li>Восстановление энергетического баланса</li>
                    <li>Улучшение качества сна</li>
                    <li>Повышение жизненной энергии</li>
                    <li>Гармония тела, разума и души</li>
                  </ul>
                </div>

                <div className="mb-3">
                  <h4 className="font-montserrat font-semibold text-xl text-gold-300 mb-1">Что вы получите</h4>
                  <ul className="list-disc list-inside space-y-1 text-emerald-100">
                    <li>Коррекцию дисфункций на физическом, психическом и энергетическом уровнях</li>
                    <li>Внутреннюю опору и уверенность</li>
                    <li>Трезвый взгляд на мир</li>
                    <li>Чувство свободы и расширения энергии</li>
                    <li>Легкость в теле и ясность разума</li>
                  </ul>
                </div>

                <div className="mb-3">
                  <h4 className="font-montserrat font-semibold text-xl text-gold-300 mb-1">Отзывы клиентов</h4>
                  <p className="text-emerald-100 mb-1">Многие отмечают:</p>
                  <ul className="list-disc list-inside space-y-1 text-emerald-100">
                    <li>Общее улучшение самочувствия</li>
                    <li>Повышение уровня энергии</li>
                    <li>Ощущение внутреннего благополучия</li>
                    <li>Гармонию в жизни</li>
                  </ul>
                </div>


              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-emerald-800/30 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="text-3xl font-bold text-gold-400 mb-2">500+</div>
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
                  <Icon name="Leaf" className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">100% натуральные компоненты</h3>
                  <p className="text-emerald-200">Только органические масла и экстракты</p>
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
      <section id="contact" className="py-20 relative" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
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
            Позвонить: +7(918)4141221
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
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