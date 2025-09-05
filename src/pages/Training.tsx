import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const Training = () => {
  const courses = [
    {
      title: "Access Bars Practitioner",
      level: "Начальный уровень",
      duration: "1 день (8 часов)",
      price: "29 000 ₽",
      description: "Базовый курс для освоения техники Access Bars",
      includes: [
        "Теоретические основы методики",
        "Практическое обучение 32 точкам",
        "Сертификат международного образца",
        "Методические материалы"
      ]
    }
  ];

  const instructor = {
    name: "Наталья Великая",
    level: "Access Consciousness Certified Facilitator",
    experience: "10+ лет",
    image: "👩‍🏫",
    specialization: "Полный спектр Access Consciousness",
    about: "Сертифицированный мастер Access Consciousness с международной аккредитацией. Проводит все уровни обучения от базового Practitioner до полной системы Access Consciousness.",
    achievements: [
      "Международная сертификация Access Consciousness",
      "Более 500 обученных студентов",
      "Преподавательский стаж 6+ лет",
      "Право проведения всех курсов Access"
    ]
  };

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
    <div className="min-h-screen relative overflow-hidden" style={{
        backgroundImage: `url('https://cdn.poehali.dev/files/1dcdfac9-f41f-45e1-849d-92b17a28a596.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-emerald-900/70"></div>
      {/* Header */}
      <header className="bg-emerald-900/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gold-400/30 relative">
        <div className="container mx-auto px-4 py-2 md:py-4 relative">
          <nav className="flex justify-between items-center">
            <h1 className="font-montserrat font-bold text-xl md:text-2xl text-gold-400">Гармония энергий</h1>
            <div className="flex gap-2 sm:gap-4 md:gap-6 items-center">
              <a href="/" className="text-gold-200 hover:text-gold-400 transition-colors font-medium text-xs sm:text-sm md:text-base">Главная</a>
              <a href="/access-bars" className="text-gold-200 hover:text-gold-400 transition-colors font-medium text-xs sm:text-sm md:text-base hidden sm:block">Сессии</a>
              <a href="/training" className="text-gold-200 hover:text-gold-400 transition-colors font-semibold text-xs sm:text-sm md:text-base">Обучение</a>
              <a href="/healing" className="text-gold-200 hover:text-gold-400 transition-colors font-medium text-xs sm:text-sm md:text-base">Целительство</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="fixed top-16 md:top-20 left-2 md:left-4 z-40">
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
          
          <div id="section-menu" className="hidden absolute top-10 md:top-12 left-0 w-56 md:w-64 bg-black/90 border-2 border-gold-400/50 rounded-lg shadow-2xl overflow-hidden">
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
                  document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="BookOpen" size={16} />
                Курсы обучения
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="Star" size={16} />
                Особенности
              </button>
              
              <button 
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('section-menu')?.classList.add('hidden');
                }}
              >
                <Icon name="MessageCircle" size={16} />
                О преподавателе
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
      <section id="hero" className="py-20 text-center relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-gold-100 mb-6">
              Обучение технике <span className="text-gold-400">Access Bars</span>
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              Освойте уникальную методику энергетического исцеления и откройте новые возможности 
              для себя и помощи другим
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
                <Icon name="Calendar" className="mr-2" size={20} />
                Выбрать курс
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold backdrop-blur-sm">+7(918) 414-1221</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-16 relative" style={{
        backgroundImage: `url('https://cdn.poehali.dev/files/fd60c33c-3948-432b-92ba-2955cd2ace49.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-emerald-900/30"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Программы обучения</h3>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Выберите программу, соответствующую вашему уровню и целям
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {courses.map((course, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group bg-emerald-800/30 backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-500"></div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <CardTitle className="text-xl font-montserrat text-gold-200">{course.title}</CardTitle>
                    <span className="text-sm bg-gold-400/20 text-gold-400 px-3 py-1 rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <CardDescription className="text-base text-emerald-200">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-emerald-200">Длительность:</span>
                      <span className="text-emerald-200">{course.duration}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-emerald-200 font-semibold">Стоимость:</div>
                      <div className="space-y-1 text-sm">
                        <div className="text-gold-400 font-bold text-lg">29 000₽</div>
                        <div className="text-gold-400 font-bold">Повторно: 14 500₽</div>
                        <div className="text-emerald-200">Дети до 16 лет: бесплатно</div>
                        <div className="text-gold-400 font-bold">16-18 лет: 14 500₽</div>
                        <div className="text-emerald-300 text-xs italic">В сопровождении родителей</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gold-200">Включено в курс:</h4>
                      <ul className="space-y-2">
                        {course.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Icon name="Check" className="text-gold-400 mt-0.5 flex-shrink-0" size={16} />
                            <span className="text-sm text-emerald-200">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full mt-6 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold transition-colors">
                      Записаться на курс
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Отдельная информационная секция */}
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group bg-emerald-800/30 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-500"></div>
              <CardHeader>
                <CardTitle className="text-xl font-montserrat text-gold-200">О технике Access Bars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-emerald-100 text-sm leading-relaxed space-y-3">
                  <p className="font-semibold text-gold-200">Приглашаю вас на обучение Access Bars💆‍♀️</p>
                  <p className="font-bold">Всего 1 день!</p>
                  <p>Что в переводе означает Доступ к осознанности</p>
                  <p>Где осознанность- способность постоянно открываться большим возможностям, большему выбору и большему в жизни.</p>
                  <p>А Бары это 32 точки на голове, которые отвечают за основные сферы жизни:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-emerald-200">
                    <div>• Деньги</div>
                    <div>• Контроль</div>
                    <div>• Созидание</div>
                    <div>• Создание связей</div>
                    <div>• Тело</div>
                    <div>• Исцеление</div>
                    <div>• Сексуальность</div>
                    <div>• Благодарность</div>
                    <div>• Коммуникации</div>
                    <div>• И т.д...</div>
                  </div>
                  <p>Прикасаясь к этим точкам, происходит удаление ненужных программ и ограничений...</p>
                  <p>После чего в вашей жизни происходят чудеса и все что вы хотите максимально легко и просто появляется в вашей жизни💫</p>
                  <p className="font-bold text-gold-200">Обучение всего 1 день!</p>
                  <div className="space-y-1 text-xs">
                    <div>✔ Вы получаете новую профессию</div>
                    <div>✔ Сертификат международного образца</div>
                    <div>✔ Учебное пособие</div>
                    <div>✔ Инструмент на всю жизнь</div>
                    <div>✔ 2 сессии баров за одно обучение</div>
                  </div>
                  <p className="text-gold-300 font-semibold">И безграничные возможности💫</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Master Instructor */}
      <section className="py-16 relative" style={{
        backgroundImage: `url('https://cdn.poehali.dev/files/fd60c33c-3948-432b-92ba-2955cd2ace49.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-emerald-900/40"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Ваш преподаватель</h3>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Сертифицированный мастер с международной аккредитацией
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow bg-emerald-800/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-gold-400/20 to-gold-500/20 rounded-full flex items-center justify-center text-6xl mx-auto mb-4">
                      {instructor.image}
                    </div>
                    <h4 className="font-montserrat font-bold text-2xl text-gold-200 mb-2">{instructor.name}</h4>
                    <p className="text-gold-400 font-semibold text-lg mb-2">{instructor.level}</p>
                    <p className="text-emerald-200 font-medium">Опыт: 6+ лет</p>
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h5 className="font-semibold text-lg text-gold-200 mb-3">О преподавателе</h5>
                      <p className="text-emerald-200 leading-relaxed">{instructor.about}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-lg text-gold-200 mb-3">Достижения и квалификация</h5>
                      <ul className="space-y-2">
                        {instructor.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Icon name="Award" className="text-gold-400 mt-0.5 flex-shrink-0" size={18} />
                            <span className="text-emerald-200">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
                        <Icon name="MessageCircle" className="mr-2" size={18} />
                        Задать вопрос мастеру
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="features" className="py-16 relative" style={{
        backgroundImage: `url('https://cdn.poehali.dev/files/fd60c33c-3948-432b-92ba-2955cd2ace49.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-emerald-900/35"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Преимущества обучения у нас</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow bg-emerald-800/30 backdrop-blur-sm">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-gold-400/20 to-gold-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Icon name={benefit.icon} className="text-gold-400" size={32} />
                  </div>
                  <h4 className="font-montserrat font-bold text-lg text-gold-200">{benefit.title}</h4>
                  <p className="text-emerald-200 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 relative" style={{
        backgroundImage: `url('https://cdn.poehali.dev/files/fd60c33c-3948-432b-92ba-2955cd2ace49.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-emerald-900/30"></div>
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-montserrat font-bold text-3xl mb-6 text-gold-100">Готовы начать обучение?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-emerald-100">
            Свяжитесь с нами для консультации и выбора подходящей программы
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
              <Icon name="Phone" className="mr-2" size={20} />
              Позвонить
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold backdrop-blur-sm">
              <Icon name="MessageCircle" className="mr-2" size={20} />
              Написать в WhatsApp
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
              <p className="text-emerald-200 mb-4">Обучения и практики Access Bars в Москве</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gold-200">Контакты</h4>
              <div className="space-y-2 text-emerald-200">
                <p>+7(918) 414-1221</p>
                <p>info@harmony-energy.ru</p>
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

export default Training;