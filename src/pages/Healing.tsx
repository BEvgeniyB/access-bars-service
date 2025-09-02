import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const Healing = () => {
  const services = [
    {
      title: "Энергетическое исцеление",
      duration: "60 мин",
      price: "7 000 ₽",
      description: "Работа с энергетическими блоками и восстановление баланса",
      benefits: [
        "Снятие энергетических блоков",
        "Балансировка чакр",
        "Очищение ауры",
        "Активация самоисцеления"
      ],
      icon: "Sparkles"
    },
    {
      title: "Дистанционное исцеление",
      duration: "60 мин",
      price: "6 000 ₽",
      description: "Энергетическая работа на расстоянии с фото или видеосвязью",
      benefits: [
        "Работа из любой точки мира",
        "Энергетическая настройка",
        "Очищение пространства",
        "Защитные практики"
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 relative overflow-hidden">
      {/* Luxury Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-emerald-950/90"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl"></div>
      {/* Header */}
      <header className="bg-emerald-900/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gold-400/30 relative">
        <div className="container mx-auto px-4 py-4 relative">
          <nav className="flex justify-between items-center">
            <h1 className="font-montserrat font-bold text-2xl text-gold-400">Гармония энергий</h1>
            <div className="flex gap-6 items-center">
              <a href="/" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Главная</a>
              <a href="/access-bars" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Access Bars</a>
              <a href="/training" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Обучение</a>
              <a href="/healing" className="text-gold-200 hover:text-gold-400 transition-colors font-semibold">Целительство</a>
              <Button className="bg-gold-500 hover:bg-gold-600 text-emerald-900 font-bold border-2 border-gold-400 shadow-lg">Записаться</Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-gold-100 mb-6">
              Перцептивные технологии <span className="text-gold-400">исцеления</span>
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              Уникальные методы энергетического целительства для глубокого исцеления 
              на всех уровнях: физическом, эмоциональном, ментальном и духовном
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
                <Icon name="Calendar" className="mr-2" size={20} />
                Записаться на сеанс
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold backdrop-blur-sm">
                <Icon name="Phone" className="mr-2" size={20} />
                Консультация
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-emerald-800/30 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Услуги целительства</h3>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Индивидуальный подход к каждому клиенту с использованием различных техник
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group h-full bg-emerald-800/30 backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-500"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-gold-400/20 to-gold-500/20 rounded-full flex items-center justify-center">
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
                    
                    <Button className="w-full mt-6 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold transition-colors">
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
      <section className="py-16 bg-emerald-800/20 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Используемые техники</h3>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Комплексный подход с применением различных методов целительства
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {techniques.map((technique, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow bg-emerald-800/30 backdrop-blur-sm">
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
      <section className="py-16 bg-emerald-800/30 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Результаты работы</h3>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Что вы получите после сеансов перцептивного исцеления
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {results.map((result, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow bg-emerald-800/30 backdrop-blur-sm">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-gold-400/20 to-gold-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Icon name={result.icon} className="text-gold-400" size={32} />
                  </div>
                  <h4 className="font-montserrat font-bold text-lg text-gold-200">{result.title}</h4>
                  <p className="text-emerald-200 text-sm leading-relaxed">{result.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-emerald-800/20 backdrop-blur-sm relative">
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
      <section className="py-20 bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 backdrop-blur-sm relative">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-montserrat font-bold text-3xl mb-6 text-gold-100">Готовы к исцелению?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-emerald-100">
            Запишитесь на консультацию, чтобы определить оптимальный план работы для вас
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
              <Icon name="Phone" className="mr-2" size={20} />
              +7 (495) 123-45-67
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold backdrop-blur-sm">
              <Icon name="MessageCircle" className="mr-2" size={20} />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950/90 backdrop-blur-sm text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-montserrat font-bold text-xl mb-4 text-gold-200">Гармония энергий</h4>
              <p className="text-emerald-200 mb-4">
                Центр энергетического исцеления и духовного развития
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gold-200">Контакты</h4>
              <div className="space-y-2 text-emerald-200">
                <p>+7 (495) 123-45-67</p>
                <p>healing@harmony-energy.ru</p>
                <p>Москва, ул. Примерная, 123</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gold-200">Следите за нами</h4>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="text-emerald-200 hover:text-gold-400 p-2">
                  <Icon name="Instagram" size={20} />
                </Button>
                <Button variant="ghost" size="sm" className="text-emerald-200 hover:text-gold-400 p-2">
                  <Icon name="MessageCircle" size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-700 mt-8 pt-8 text-center text-emerald-300">
            <p>&copy; 2024 Гармония энергий. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Healing;