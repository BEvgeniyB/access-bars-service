import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const MassageWebsite = () => {
  const services = [
    {
      name: "Классический массаж",
      duration: "60 мин",
      price: "3 500 ₽",
      description: "Расслабляющий массаж всего тела с использованием натуральных масел"
    },
    {
      name: "Ароматерапия",
      duration: "90 мин", 
      price: "4 500 ₽",
      description: "Глубокое расслабление с эфирными маслами лаванды и эвкалипта"
    },
    {
      name: "Лимфодренажный массаж",
      duration: "75 мин",
      price: "4 000 ₽", 
      description: "Детокс-массаж для выведения лишней жидкости и улучшения обмена веществ"
    },
    {
      name: "Массаж горячими камнями",
      duration: "90 мин",
      price: "5 500 ₽",
      description: "Уникальная техника с разогретыми базальтовыми камнями"
    },
    {
      name: "Антицеллюлитный массаж",
      duration: "60 мин", 
      price: "3 800 ₽",
      description: "Интенсивный массаж для коррекции фигуры и улучшения тонуса кожи"
    },
    {
      name: "Массаж лица",
      duration: "45 мин",
      price: "2 800 ₽",
      description: "Омолаживающий массаж для повышения тонуса и эластичности кожи лица"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 font-openSans relative overflow-hidden">
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-emerald-950/90"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gold-300/10 rounded-full blur-2xl"></div>
      {/* Header */}
      <header className="bg-emerald-900/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gold-400/30 relative">
        <div className="container mx-auto px-4 py-4 relative">
          <nav className="flex justify-between items-center">
            <h1 className="font-montserrat font-bold text-2xl text-gold-400">Гармония энергий</h1>
            <div className="flex gap-6 items-center">
              <a href="#services" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Услуги</a>
              <a href="/access-bars" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Access Bars</a>
              <a href="/training" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Обучение</a>
              <a href="/healing" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Целительство</a>
              <a href="#about" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">О нас</a>
              <a href="#contact" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Контакты</a>
              <Button className="bg-gold-500 hover:bg-gold-600 text-emerald-900 font-bold border-2 border-gold-400 shadow-lg">
                Записаться
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-32 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="animate-fade-in">
            <h2 className="font-montserrat font-bold text-6xl md:text-7xl text-gold-100 mb-8 leading-tight drop-shadow-2xl">
              Найдите свой
              <span className="text-gold-400 block bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">внутренний покой</span>
            </h2>
            <p className="text-xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Роскошные энергетические практики и исцеление в атмосфере абсолютного спокойствия и гармонии
            </p>
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
      <section id="services" className="py-20 bg-emerald-800/30 backdrop-blur-sm relative">
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
                  {(service.name === "Классический массаж" || service.name === "Ароматерапия") ? (
                    <Link to="/massage">
                      <Button className="w-full mt-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
                        <Icon name="ArrowRight" className="mr-2" size={16} />
                        Подробнее
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full mt-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
                      <Icon name="Clock" className="mr-2" size={16} />
                      Записаться
                    </Button>
                  )}
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
              <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-6">О нас</h2>
              <p className="text-lg text-emerald-100 mb-6 leading-relaxed">
                Гармония энергий — это оазис спокойствия в центре города. Мы создали пространство, 
                где каждый может найти баланс между телом и душой.
              </p>
              <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
                Наши мастера имеют международные сертификаты и многолетний опыт работы. 
                Мы используем только натуральные масла и экологически чистые материалы.
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
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">Сертифицированные мастера</h3>
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