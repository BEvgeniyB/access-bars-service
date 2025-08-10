import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const Training = () => {
  const courses = [
    {
      title: "Access Bars Practitioner",
      level: "Начальный уровень",
      duration: "1 день (8 часов)",
      price: "25 000 ₽",
      description: "Базовый курс для освоения техники Access Bars",
      includes: [
        "Теоретические основы методики",
        "Практическое обучение 32 точкам",
        "Сертификат международного образца",
        "Методические материалы",
        "Пожизненная поддержка"
      ]
    },
    {
      title: "Access Bars Facilitator",
      level: "Продвинутый уровень",
      duration: "3 дня",
      price: "45 000 ₽",
      description: "Курс для тех, кто хочет обучать других",
      includes: [
        "Методика преподавания",
        "Психология обучения взрослых",
        "Право проводить сертификацию",
        "Бизнес-аспекты практики",
        "Углубленная практика"
      ]
    },
    {
      title: "Access Consciousness",
      level: "Мастерский уровень",
      duration: "5 дней",
      price: "75 000 ₽",
      description: "Полная система Access Consciousness",
      includes: [
        "Все инструменты Access",
        "Clearing Statements",
        "Body Processes",
        "Международная аккредитация",
        "Право вести все курсы"
      ]
    }
  ];

  const instructors = [
    {
      name: "Елена Волкова",
      level: "Certified Facilitator",
      experience: "8+ лет",
      image: "👩‍🏫",
      specialization: "Access Bars, Body Processes"
    },
    {
      name: "Михаил Серов",
      level: "Access Consciousness CF",
      experience: "12+ лет",
      image: "👨‍🎓",
      specialization: "Полный спектр Access Consciousness"
    }
  ];

  const benefits = [
    {
      icon: "GraduationCap",
      title: "Международная сертификация",
      description: "Получите признанный во всем мире сертификат"
    },
    {
      icon: "Users",
      title: "Малые группы",
      description: "Персональный подход, максимум 8 человек в группе"
    },
    {
      icon: "BookOpen",
      title: "Полные материалы",
      description: "Все учебные пособия и методички включены"
    },
    {
      icon: "LifeBuoy",
      title: "Поддержка",
      description: "Пожизненная поддержка и консультации"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <h1 className="font-montserrat font-bold text-2xl text-primary">Гармония энергий</h1>
            <div className="flex gap-6 items-center">
              <a href="/" className="text-gray-700 hover:text-primary transition-colors">Главная</a>
              <a href="/access-bars" className="text-gray-700 hover:text-primary transition-colors">Сессии</a>
              <a href="/training" className="text-gray-700 hover:text-primary transition-colors font-semibold">Обучение</a>
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
              Обучение технике <span className="text-primary">Access Bars</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Освойте уникальную методику энергетического исцеления и откройте новые возможности 
              для себя и помощи другим
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Icon name="Calendar" className="mr-2" size={20} />
                Выбрать курс
              </Button>
              <Button variant="outline" size="lg">
                <Icon name="Download" className="mr-2" size={20} />
                Скачать программу
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gray-800 mb-4">Программы обучения</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Выберите программу, соответствующую вашему уровню и целям
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {courses.map((course, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <CardTitle className="text-xl font-montserrat">{course.title}</CardTitle>
                    <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <CardDescription className="text-base">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Длительность:</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Стоимость:</span>
                      <span className="text-2xl font-bold text-primary">{course.price}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Включено в курс:</h4>
                      <ul className="space-y-2">
                        {course.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Icon name="Check" className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                            <span className="text-sm text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full mt-6 group-hover:bg-primary/90 transition-colors">
                      Записаться на курс
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gray-800 mb-4">Наши преподаватели</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Сертифицированные мастера с многолетним опытом практики и преподавания
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {instructors.map((instructor, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-4xl">
                      {instructor.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-montserrat font-bold text-xl text-gray-800">{instructor.name}</h4>
                      <p className="text-primary font-semibold">{instructor.level}</p>
                      <p className="text-gray-600">Опыт: {instructor.experience}</p>
                      <p className="text-sm text-gray-500 mt-2">{instructor.specialization}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gray-800 mb-4">Преимущества обучения у нас</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon name={benefit.icon} className="text-primary" size={32} />
                  </div>
                  <h4 className="font-montserrat font-bold text-lg text-gray-800">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-montserrat font-bold text-3xl mb-6">Готовы начать обучение?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Свяжитесь с нами для консультации и выбора подходящей программы
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-50">
              <Icon name="Phone" className="mr-2" size={20} />
              Позвонить
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-50">
              <Icon name="MessageCircle" className="mr-2" size={20} />
              Написать в WhatsApp
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
                Центр обучения и практики Access Bars в Москве
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Контакты</h4>
              <div className="space-y-2 text-gray-300">
                <p>+7 (495) 123-45-67</p>
                <p>info@harmony-energy.ru</p>
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

export default Training;