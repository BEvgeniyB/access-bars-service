import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const AccessBars = () => {
  const benefits = [
    {
      icon: "Brain",
      title: "Снижение стресса",
      description: "Глубокое расслабление и освобождение от накопленного напряжения"
    },
    {
      icon: "Heart",
      title: "Эмоциональное равновесие", 
      description: "Гармонизация эмоционального состояния и внутреннего баланса"
    },
    {
      icon: "Zap",
      title: "Повышение энергии",
      description: "Восстановление энергетических ресурсов и жизненных сил"
    },
    {
      icon: "Moon",
      title: "Улучшение сна",
      description: "Нормализация сна и восстановление естественных биоритмов"
    },
    {
      icon: "Sparkles",
      title: "Ясность мышления",
      description: "Освобождение от ментального напряжения и повышение концентрации"
    },
    {
      icon: "Smile",
      title: "Общее благополучие",
      description: "Улучшение качества жизни и ощущение внутренней гармонии"
    }
  ];

  const sessions = [
    {
      name: "Первая сессия Access Bars",
      duration: "90 мин",
      price: "8 000 ₽",
      description: "Знакомство с методикой, полная диагностика и первый сеанс"
    },
    {
      name: "Стандартная сессия", 
      duration: "60 мин",
      price: "8 000 ₽",
      description: "Классический сеанс Access Bars для регулярной практики"
    },
    {
      name: "Интенсивная программа",
      duration: "3 сессии",
      price: "21 000 ₽", 
      description: "Курс из 3 сессий со скидкой для максимального эффекта"
    }
  ];

  return (
    <div className="min-h-screen font-openSans relative overflow-hidden" style={{backgroundImage: `url('https://cdn.poehali.dev/files/58c024e8-2d2e-49a9-ac0e-19692c531870.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-emerald-900/80"></div>
      {/* Header */}
      <header className="bg-emerald-900/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gold-400/30 relative">
        <div className="container mx-auto px-4 py-4 relative">
          <nav className="flex justify-between items-center">
            <h1 className="font-montserrat font-bold text-2xl text-gold-400">Гармония энергий</h1>
            <div className="flex gap-6 items-center">
              <a href="/" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Главная</a>
              <a href="#about" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">О методике</a>
              <a href="#benefits" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Польза</a>
              <a href="#sessions" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Сессии</a>
              <a href="/training" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Обучение</a>
              <a href="/healing" className="text-gold-200 hover:text-gold-400 transition-colors font-medium">Целительство</a>
              <Button className="bg-gold-500 hover:bg-gold-600 text-emerald-900 font-bold border-2 border-gold-400 shadow-lg">
                Записаться
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden" style={{backgroundImage: `url('https://cdn.poehali.dev/files/12b737b3-bf4d-499d-8f9a-ff594a4f705f.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-emerald-900/40"></div>
        <div className="container mx-auto relative z-10">
          <div className="animate-fade-in">
            <h2 className="font-montserrat font-bold text-5xl md:text-6xl text-gold-100 mb-6 leading-tight drop-shadow-2xl">
              Access Bars
              <span className="text-gold-400 block bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">Энергетическая терапия</span>
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Уникальная методика работы с энергетическими точками головы для глубокого расслабления, 
              освобождения от стресса и активации внутренних ресурсов организма
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#sessions">
                <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold px-8 py-3 text-lg shadow-2xl border-2 border-gold-400">
                  <Icon name="Calendar" className="mr-2" size={20} />
                  Выбрать сессию
                </Button>
              </a>
              <a href="#benefits">
                <Button size="lg" variant="outline" className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 font-bold px-8 py-3 text-lg backdrop-blur-sm">
                  <Icon name="Heart" className="mr-2" size={20} />
                  Польза Access Bars
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        {/* Hero Images */}
        <div className="mt-16 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <img 
                src="https://cdn.poehali.dev/files/ce1034c3-ae7a-425f-9eb0-7c2712c3c240.jpg"
                alt="Специалист Access Bars"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl animate-slide-up"
              />
              <img 
                src="https://cdn.poehali.dev/files/40e60d43-5726-43aa-869b-a862f9704781.jpg"
                alt="Access Bars therapy session"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl animate-slide-up"
              />
              <img 
                src="https://cdn.poehali.dev/files/2e7c5f05-7502-4d70-8942-b7055e5a89f5.jpg"
                alt="Консультация Access Bars"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl animate-slide-up"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative" style={{backgroundImage: `url('https://cdn.poehali.dev/files/4e668bb9-7ccd-46e9-9329-0f7414a65ea0.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-6">Что такое Access Bars?</h2>
              <p className="text-lg text-emerald-100 mb-6 leading-relaxed">Access Bars — это набор инструментов и техник, разработанных для развития осознанности в каждом человеке.
Осознанность - охватывает всё сущее без осуждения. Это готовность и способность быть полностью присутствующим и осознающим во всех сферах своей жизни.
Осознанность — это способность постоянно открывать для себя новые возможности, расширять выбор и улучшать качество жизни.
Осознанность - позволяет присутствовать в каждом моменте жизни, не осуждая себя или других. Это умение принимать всё без отвержения и создавать именно то, чего вы желаете.
Вы можете иметь больше, чем имеете сейчас, и даже больше, чем можете представить.
А что, если вы готовы начать заботиться о себе и питать свою душу?
А что, если вы откроете дверь ко всему, что раньше казалось невозможным?
Как вы можете осознать свою жизненно важную роль в создании возможностей этого мира?</p>
              <p className="text-lg text-emerald-100 mb-6 leading-relaxed"></p>
              
              <div className="bg-gradient-to-r from-gold-500/20 to-emerald-600/20 p-6 rounded-2xl border border-gold-400/30 backdrop-blur-sm">
                <h3 className="font-montserrat font-semibold text-xl text-gold-200 mb-3">
                  Как это работает?
                </h3>
                <p className="text-emerald-200 leading-relaxed">
                  Специалист мягко касается определенных точек на вашей голове, активируя процесс 
                  энергетического очищения. Это безопасно, расслабляюще и не требует никаких усилий с вашей стороны.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gold-500/20 to-emerald-600/20 p-8 rounded-3xl border border-gold-400/30 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center">
                    <Icon name="Timer" className="text-gold-400" size={28} />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-semibold text-xl text-gold-200">32 точки</h3>
                    <p className="text-emerald-200">Энергетические центры на голове</p>
                  </div>
                </div>
                <p className="text-emerald-200">
                  Каждая точка отвечает за определенную сферу жизни: отношения, деньги, 
                  творчество, здоровье и многое другое.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gold-500/20 to-emerald-600/20 p-8 rounded-3xl border border-gold-400/30 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center">
                    <Icon name="Waves" className="text-gold-400" size={28} />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-semibold text-xl text-gold-200">Мягкое воздействие</h3>
                    <p className="text-emerald-200">Деликатная энергетическая работа</p>
                  </div>
                </div>
                <p className="text-emerald-200">
                  Процедура проходит в комфортной обстановке, вы просто расслабляетесь 
                  и позволяете энергии течь свободно.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-r from-emerald-700/20 to-emerald-600/20 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Польза Access Bars</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Многогранное положительное влияние на физическое и эмоциональное состояние
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-emerald-800/30 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-400/30 transition-colors">
                    <Icon name={benefit.icon as any} className="text-gold-400" size={28} />
                  </div>
                  <CardTitle className="font-montserrat text-xl text-gold-200 group-hover:text-gold-400 transition-colors">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-emerald-200 leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sessions Section */}
      <section id="sessions" className="py-20 relative" style={{backgroundImage: `url('https://cdn.poehali.dev/files/8257b36c-01da-4ea7-8a9a-76326d9b58b0.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Варианты сессий</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Выберите подходящий формат для знакомства с Access Bars
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sessions.map((session, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 relative overflow-hidden bg-emerald-800/30 backdrop-blur-sm">
                {session.name.includes('Интенсивная') && (
                  <div className="absolute top-4 right-4 bg-gold-400 text-emerald-900 px-3 py-1 rounded-full text-sm font-medium">
                    Популярно
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="font-montserrat text-xl text-gold-200 group-hover:text-gold-400 transition-colors mb-2">
                    {session.name}
                  </CardTitle>
                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold text-gold-400">{session.price}</div>
                    <div className="text-sm text-emerald-200">{session.duration}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-emerald-200 leading-relaxed mb-6">
                    {session.description}
                  </CardDescription>
                  <Button className="w-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
                    <Icon name="Calendar" className="mr-2" size={16} />
                    Записаться
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-700/20 to-emerald-600/20 backdrop-blur-sm relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Частые вопросы</h2>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-emerald-800/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-montserrat text-lg text-gold-200">
                  Безопасна ли процедура Access Bars?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-200">
                  Да, Access Bars абсолютно безопасна. Это неинвазивная методика, которая включает 
                  только легкие прикосновения к точкам на голове. Никаких побочных эффектов не наблюдается.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-emerald-800/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-montserrat text-lg text-gold-200">
                  Что я буду чувствовать во время сессии?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-200">
                  Большинство людей испытывают глубокое расслабление, некоторые засыпают. 
                  Вы можете почувствовать тепло, покалывание или просто приятное спокойствие.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-emerald-800/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-montserrat text-lg text-gold-200">
                  Сколько сессий нужно для результата?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-200">
                  Многие клиенты замечают положительные изменения уже после первой сессии. 
                  Для устойчивого эффекта рекомендуется курс из 3-5 сессий.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-emerald-800/30 backdrop-blur-sm relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-8">Записаться на Access Bars</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Откройте для себя новый уровень расслабления и внутренней гармонии
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <div className="flex items-center gap-3 text-lg">
              <Icon name="User" className="text-gold-400" size={24} />
              <span className="text-emerald-200">Сертифицированный специалист</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <Icon name="Shield" className="text-gold-400" size={24} />
              <span className="text-emerald-200">100% безопасность</span>
            </div>
          </div>
          
          <Button size="lg" className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-medium px-12 py-4 text-lg">
            <Icon name="Phone" className="mr-2" size={20} />
            Позвонить: +7 (495) 123-45-67
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950/90 backdrop-blur-sm text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-montserrat font-bold text-2xl mb-4 text-gold-200">Гармония энергий</h3>
          <p className="text-emerald-200 mb-6">Access Bars и классический массаж для вашего благополучия</p>
          
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

export default AccessBars;