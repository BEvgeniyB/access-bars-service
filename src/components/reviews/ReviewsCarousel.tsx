import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { BACKGROUND_IMAGES, getBackgroundStyle } from "@/constants/images";
import API_ENDPOINTS from "@/config/api";

interface Review {
  id: number;
  name: string;
  service: string;
  rating: number;
  text: string;
  date: string;
}

const REVIEWS_API_URL = API_ENDPOINTS.reviews;

const ReviewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Проверяем кеш (действителен 24 часа)
        const cached = localStorage.getItem('reviews_cache');
        const cacheTime = localStorage.getItem('reviews_cache_time');
        const now = Date.now();
        
        if (cached && cacheTime && (now - parseInt(cacheTime)) < 24 * 60 * 60 * 1000) {
          setReviews(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // Загружаем с сервера
        const response = await fetch(`${REVIEWS_API_URL}?endpoint=reviews&status=approved`);
        const data = await response.json();
        
        if (data.success && data.reviews) {
          const reviewsData = data.reviews.slice(0, 5);
          setReviews(reviewsData);
          
          // Сохраняем в кеш
          localStorage.setItem('reviews_cache', JSON.stringify(reviewsData));
          localStorage.setItem('reviews_cache_time', now.toString());
        }
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-emerald-200">Загрузка отзывов...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-emerald-200">Отзывов пока нет</p>
      </div>
    );
  }

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
      <Card className="border-2 border-gold-400/30 shadow-2xl overflow-hidden" style={getBackgroundStyle(BACKGROUND_IMAGES.PRIMARY)}>
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