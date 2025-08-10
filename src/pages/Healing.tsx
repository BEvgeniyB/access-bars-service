import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const Healing = () => {
  const services = [
    {
      title: "Энергетическая диагностика",
      duration: "45 мин",
      price: "4 500 ₽",
      description: "Глубокое сканирование энергетического поля и выявление блоков",
      benefits: [
        "Определение энергетических блоков",
        "Анализ чакральной системы",
        "Выявление причин дисбаланса",
        "Персональные рекомендации"
      ],
      icon: "Search"
    },
    {
      title: "Энергетическое исцеление",
      duration: "60 мин",
      price: "6 000 ₽",
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
      title: "Исцеление травм",
      duration: "90 мин",
      price: "8 500 ₽",
      description: "Работа с глубокими эмоциональными и энергетическими травмами",
      benefits: [
        "Проработка детских травм",
        "Освобождение от страхов",
        "Исцеление отношений",
        "Трансформация паттернов"
      ],
      icon: "Heart"
    },
    {
      title: "Родовое исцеление",
      duration: "120 мин",
      price: "10 000 ₽",
      description: "Работа с родовыми программами и семейными паттернами",
      benefits: [
        "Очищение родовых программ",
        "Исцеление семейных травм",
        "Трансформация негативных сценариев",
        "Восстановление родовой силы"
      ],
      icon: "Users"
    },
    {
      title: "Дистанционное исцеление",
      duration: "60 мин",
      price: "5 500 ₽",
      description: "Энергетическая работа на расстоянии с фото или видеосвязью",
      benefits: [
        "Работа из любой точки мира",
        "Энергетическая настройка",
        "Очищение пространства",
        "Защитные практики"
      ],
      icon: "Wifi"
    },
    {
      title: "Кармическое исцеление",
      duration: "90 мин",
      price: "9 000 ₽",
      description: "Работа с кармическими узлами и прошлыми воплощениями",
      benefits: [
        "Проработка кармических долгов",
        "Исцеление прошлых жизней",
        "Освобождение от негативных связей",
        "Активация духовных даров"
      ],
      icon: "Infinity"
    }
  ];

  const techniques = [
    {
      name: "Квантовое исцеление",
      description: "Работа на квантовом уровне с информационными полями"
    },
    {
      name: "Рейки и праническое исцеление",
      description: "Универсальная энергия жизни для восстановления баланса"
    },
    {
      name: "Кристаллотерапия",
      description: "Использование силы кристаллов для гармонизации энергий"
    },
    {
      name: "Звукотерапия",
      description: "Исцеление через вибрации и звуковые частоты"
    },
    {
      name: "Ароматерапия",
      description: "Работа с эфирными маслами для энергетической очистки"
    },
    {
      name: "Медитативные практики",
      description: "Глубокие состояния сознания для самоисцеления"
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <h1 className="font-montserrat font-bold text-2xl text-primary">Гармония энергий</h1>
            <div className="flex gap-6 items-center">
              <a href="/" className="text-gray-700 hover:text-primary transition-colors">Главная</a>
              <a href="/access-bars" className="text-gray-700 hover:text-primary transition-colors">Access Bars</a>
              <a href="/training" className="text-gray-700 hover:text-primary transition-colors">Обучение</a>
              <a href="/healing" className="text-gray-700 hover:text-primary transition-colors font-semibold">Целительство</a>
              <Button variant="default">Записаться</Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-gray-800 mb-6">
              Перцептивные технологии <span className="text-primary">исцеления</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Уникальные методы энергетического целительства для глубокого исцеления 
              на всех уровнях: физическом, эмоциональном, ментальном и духовном
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Icon name="Calendar" className="mr-2" size={20} />
                Записаться на сеанс
              </Button>
              <Button variant="outline" size="lg">
                <Icon name="Phone" className="mr-2" size={20} />
                Консультация
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gray-800 mb-4">Услуги целительства</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Индивидуальный подход к каждому клиенту с использованием различных техник
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                      <Icon name={service.icon} className="text-primary" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-primary">{service.price}</span>
                  </div>
                  <CardTitle className="text-xl font-montserrat mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-700">Длительность:</span>
                      <span>{service.duration}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Что включает:</h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Icon name="Check" className="text-emerald-500 mt-0.5 flex-shrink-0" size={16} />
                            <span className="text-sm text-gray-600">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full mt-6 bg-primary hover:bg-primary/90 transition-colors">
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
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gray-800 mb-4">Используемые техники</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Комплексный подход с применением различных методов целительства
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {techniques.map((technique, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="Sparkles" className="text-primary" size={28} />
                  </div>
                  <h4 className="font-montserrat font-bold text-lg text-gray-800">{technique.name}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{technique.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gray-800 mb-4">Результаты работы</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Что вы получите после сеансов перцептивного исцеления
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {results.map((result, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon name={result.icon} className="text-primary" size={32} />
                  </div>
                  <h4 className="font-montserrat font-bold text-lg text-gray-800">{result.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{result.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gray-800 mb-4">Как проходит сеанс</h3>
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
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {phase.step}
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{phase.title}</h4>
                  <p className="text-gray-600 text-sm">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-montserrat font-bold text-3xl mb-6">Готовы к исцелению?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Запишитесь на консультацию, чтобы определить оптимальный план работы для вас
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="outline" className="bg-white text-emerald-600 hover:bg-gray-50">
              <Icon name="Phone" className="mr-2" size={20} />
              +7 (495) 123-45-67
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-emerald-600 hover:bg-gray-50">
              <Icon name="MessageCircle" className="mr-2" size={20} />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-montserrat font-bold text-xl mb-4">Гармония энергий</h4>
              <p className="text-gray-300 mb-4">
                Центр энергетического исцеления и духовного развития
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Контакты</h4>
              <div className="space-y-2 text-gray-300">
                <p>+7 (495) 123-45-67</p>
                <p>healing@harmony-energy.ru</p>
                <p>Москва, ул. Примерная, 123</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Следите за нами</h4>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
                  <Icon name="Instagram" size={20} />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
                  <Icon name="MessageCircle" size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Гармония энергий. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Healing;