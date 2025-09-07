import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

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

const AccessBarsSessions = () => {
  return (
    <section id="sessions" className="py-20 relative" style={{backgroundImage: `url('https://cdn.poehali.dev/files/8257b36c-01da-4ea7-8a9a-76326d9b58b0.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
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
                <Button 
                  className="w-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold"
                  onClick={() => {
                    let serviceId = '';
                    if (session.name.includes('Первая')) serviceId = 'access-bars-first';
                    else if (session.name.includes('Стандартная')) serviceId = 'access-bars-standard';  
                    else if (session.name.includes('Интенсивная')) serviceId = 'access-bars-intensive';
                    window.location.href = `/?service=${serviceId}#contact`;
                  }}
                >
                  <Icon name="Calendar" className="mr-2" size={16} />
                  Записаться
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccessBarsSessions;