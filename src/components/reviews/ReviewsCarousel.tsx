import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface Review {
  id: number;
  name: string;
  service: string;
  rating: number;
  text: string;
  date: string;
}

const MOCK_REVIEWS: Review[] = [
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
  }
];

const ReviewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews] = useState<Review[]>(MOCK_REVIEWS);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentReview = reviews[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="border-2 border-gold-400/30 shadow-2xl overflow-hidden" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
        <CardContent className="p-8 md:p-12 relative min-h-[300px]">
          <div className="absolute top-4 left-4">
            <Icon name="Quote" className="text-gold-400/30" size={48} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-1 mb-4 justify-center">
              {[...Array(5)].map((_, i) => (
                <Icon 
                  key={i} 
                  name="Star" 
                  className={i < currentReview.rating ? "text-gold-400 fill-gold-400" : "text-gray-400"} 
                  size={20} 
                />
              ))}
            </div>

            <p className="text-emerald-100 text-lg md:text-xl leading-relaxed mb-6 text-center italic min-h-[120px]">
              "{currentReview.text}"
            </p>

            <div className="text-center">
              <p className="text-gold-300 font-semibold text-lg mb-1">{currentReview.name}</p>
              <p className="text-emerald-300 text-sm">{currentReview.service}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gold-400 hover:text-gold-300 hover:bg-gold-400/10"
          >
            <Icon name="ChevronLeft" size={32} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gold-400 hover:text-gold-300 hover:bg-gold-400/10"
          >
            <Icon name="ChevronRight" size={32} />
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-2 mt-6">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gold-400 w-8' 
                : 'bg-gold-400/30 hover:bg-gold-400/50'
            }`}
            aria-label={`Перейти к отзыву ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsCarousel;
