import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { useState } from "react";

interface Review {
  id: number;
  name: string;
  service: string;
  rating: number;
  text: string;
  date: string;
}

const ALL_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Елена М.",
    service: "Access Bars",
    rating: 5,
    text: "После первой сессии Access Bars я почувствовала невероятное облегчение. Ушли тревожность и напряжение, которые копились месяцами. Наталья - профессионал с большой буквы!",
    date: "2025-01-15"
  },
  {
    id: 2,
    name: "Дмитрий К.",
    service: "Классический массаж",
    rating: 5,
    text: "Занимаюсь спортом, постоянно были боли в спине. После курса массажа у Натальи состояние улучшилось на 100%. Глубокая проработка мышц, профессиональный подход. Рекомендую!",
    date: "2025-01-10"
  },
  {
    id: 3,
    name: "Ирина В.",
    service: "Целительство",
    rating: 5,
    text: "Дистанционное исцеление превзошло все ожидания! Не верила, что на расстоянии может быть такой эффект. Но после сеанса ушли хронические боли в суставах. Наталья - уникальный специалист!",
    date: "2024-12-28"
  },
  {
    id: 4,
    name: "Анна С.",
    service: "Обучение Access Bars",
    rating: 5,
    text: "Прошла обучение Access Bars у Натальи. Очень доступно объясняет, практика под контролем, все понятно даже новичку. Теперь применяю технику на себе и близких. Спасибо!",
    date: "2024-12-20"
  },
  {
    id: 5,
    name: "Михаил Л.",
    service: "Телесное исцеление",
    rating: 5,
    text: "После травмы долго не мог восстановиться. Наталья буквально поставила меня на ноги! Её энергия и профессионализм творят чудеса. Пакет из 3 сеансов дал потрясающий результат.",
    date: "2024-12-15"
  },
  {
    id: 6,
    name: "Светлана Р.",
    service: "Access Bars",
    rating: 5,
    text: "Хочу выразить огромную благодарность! После Access Bars у меня улучшился сон, ушла бессонница. Появилась ясность мыслей и спокойствие. Очень рекомендую Наталью!",
    date: "2024-12-05"
  },
  {
    id: 7,
    name: "Олег Н.",
    service: "Комплексная программа массажа",
    rating: 5,
    text: "Комплексная программа массажа с ароматерапией - это что-то невероятное! Расслабление на всех уровнях. Наталья знает свое дело. Буду ходить регулярно!",
    date: "2024-11-28"
  },
  {
    id: 8,
    name: "Мария З.",
    service: "Целительство",
    rating: 5,
    text: "Долго искала специалиста по энергетическому целительству. Наталья превзошла все ожидания! Ее дар уникален. После сеанса чувствую себя заново родившейся!",
    date: "2024-11-20"
  }
];

const Reviews = () => {
  const [selectedService, setSelectedService] = useState<string>("Все");
  
  const services = ["Все", "Access Bars", "Массаж", "Целительство", "Обучение"];
  
  const filteredReviews = selectedService === "Все" 
    ? ALL_REVIEWS 
    : ALL_REVIEWS.filter(review => 
        review.service.toLowerCase().includes(selectedService.toLowerCase())
      );

  return (
    <>
      <SEOHead 
        title="Отзывы клиентов - Гармония энергий"
        description="Реальные отзывы клиентов о услугах Access Bars, массажа, целительства и обучения. Читайте истории трансформации и исцеления."
        keywords="отзывы Access Bars, отзывы массаж Москва, отзывы целительство, отзывы Наталья Великая"
      />
      <div 
        className="min-h-screen font-openSans relative overflow-hidden"
        style={{
          background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover no-repeat fixed`,
        }}
      >
        <div className="absolute inset-0 opacity-0"></div>
        
        <Header />

        <main className="pt-32 pb-20 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 animate-fade-in">
              <Link to="/" className="inline-flex items-center text-gold-400 hover:text-gold-300 mb-6">
                <Icon name="ArrowLeft" className="mr-2" size={20} />
                На главную
              </Link>
              <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-gold-100 mb-4">
                Отзывы клиентов
              </h1>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                Истории тех, кто уже нашел свой путь к гармонии
              </p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {services.map((service) => (
                <Button
                  key={service}
                  onClick={() => setSelectedService(service)}
                  variant={selectedService === service ? "default" : "outline"}
                  className={
                    selectedService === service
                      ? "bg-gradient-to-r from-gold-400 to-gold-500 text-emerald-900 border-0"
                      : "border-2 border-gold-400/50 text-gold-400 hover:bg-gold-400/10"
                  }
                >
                  {service}
                </Button>
              ))}
            </div>

            {/* Reviews Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredReviews.map((review) => (
                <Card 
                  key={review.id} 
                  className="border-2 border-gold-400/30 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gold-300 mb-1">
                          {review.name}
                        </h3>
                        <p className="text-emerald-300 text-sm">{review.service}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Icon 
                            key={i} 
                            name="Star" 
                            className={i < review.rating ? "text-gold-400 fill-gold-400" : "text-gray-400"} 
                            size={16} 
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative mb-4">
                      <Icon name="Quote" className="absolute -top-2 -left-2 text-gold-400/20" size={32} />
                      <p className="text-emerald-100 leading-relaxed pl-6">
                        {review.text}
                      </p>
                    </div>

                    <div className="text-emerald-400 text-sm">
                      {new Date(review.date).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-emerald-200 text-lg">
                  Отзывов по выбранной категории пока нет
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="text-center mt-16">
              <Card className="max-w-2xl mx-auto border-2 border-gold-400/50 shadow-2xl" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <CardContent className="p-8">
                  <h2 className="font-montserrat font-bold text-2xl text-gold-200 mb-4">
                    Станьте частью нашей истории
                  </h2>
                  <p className="text-emerald-100 mb-6">
                    Запишитесь на сеанс и поделитесь своим опытом трансформации
                  </p>
                  <Link to="/">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold px-10"
                    >
                      Записаться на сеанс
                      <Icon name="ArrowRight" className="ml-2" size={20} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-emerald-950/90 backdrop-blur-sm text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-emerald-300">© 2025 Гармония энергий. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Reviews;
