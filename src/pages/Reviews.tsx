import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import ShareButton from "@/components/ShareButton";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const Reviews = () => {
  const [selectedService, setSelectedService] = useState<string>("Все");
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    rating: 5,
    text: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const services = ["Все", "Access Bars", "Массаж", "Целительство", "Обучение"];
  const serviceOptions = ["Access Bars", "Массаж", "Целительство", "Обучение"];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Проверяем кеш (действителен 24 часа)
        const cached = localStorage.getItem('all_reviews_cache');
        const cacheTime = localStorage.getItem('all_reviews_cache_time');
        const now = Date.now();
        
        if (cached && cacheTime && (now - parseInt(cacheTime)) < 24 * 60 * 60 * 1000) {
          setAllReviews(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // Загружаем с сервера
        const response = await fetch(`${REVIEWS_API_URL}?status=approved`);
        const data = await response.json();
        
        if (data.success && data.reviews) {
          setAllReviews(data.reviews);
          
          // Сохраняем в кеш
          localStorage.setItem('all_reviews_cache', JSON.stringify(data.reviews));
          localStorage.setItem('all_reviews_cache_time', now.toString());
        }
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);
  
  const filteredReviews = selectedService === "Все" 
    ? allReviews 
    : allReviews.filter(review => 
        review.service.toLowerCase().includes(selectedService.toLowerCase())
      );

  const averageRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : "5.0";

  const clearReviewsCache = () => {
    localStorage.removeItem('reviews_cache');
    localStorage.removeItem('reviews_cache_time');
    localStorage.removeItem('all_reviews_cache');
    localStorage.removeItem('all_reviews_cache_time');
  };

  const handleSubmitReview = async () => {
    if (!formData.name.trim() || !formData.service || !formData.text.trim()) {
      setSubmitMessage('Пожалуйста, заполните все поля');
      return;
    }

    setSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch(REVIEWS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage('✅ Спасибо! Ваш отзыв отправлен на модерацию.');
        setFormData({ name: '', service: '', rating: 5, text: '' });
        setTimeout(() => {
          setShowForm(false);
          setSubmitMessage('');
        }, 3000);
      } else {
        setSubmitMessage('❌ ' + (data.error || 'Ошибка отправки'));
      }
    } catch (error) {
      console.error('Ошибка отправки отзыва:', error);
      setSubmitMessage('❌ Ошибка отправки. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Гармония энергий - Наталья Великая",
    "image": "https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Москва",
      "addressCountry": "RU"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": allReviews.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": allReviews.slice(0, 10).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "datePublished": review.date,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.text
    }))
  };

  return (
    <>
      <SEOHead 
        title="Отзывы клиентов - Гармония энергий"
        description="Реальные отзывы клиентов о услугах Access Bars, массажа, целительства и обучения. Читайте истории трансформации и исцеления."
        keywords="отзывы Access Bars, отзывы массаж Москва, отзывы целительство, отзывы Наталья Великая"
        url="https://velikaya-nataliya.ru/reviews"
        image={BACKGROUND_IMAGES.PRIMARY}
        structuredData={structuredData}
      />
      <div 
        className="min-h-screen font-openSans relative overflow-hidden"
        style={getBackgroundStyle(BACKGROUND_IMAGES.PRIMARY, { fixed: true })}
      >
        <div className="absolute inset-0 opacity-0"></div>
        
        <Header />
        
        {/* Share Button */}
        <ShareButton />

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
            {loading ? (
              <div className="text-center py-12">
                <p className="text-emerald-200 text-lg">Загрузка отзывов...</p>
              </div>
            ) : (
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
            )}

            {!loading && filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-emerald-200 text-lg">
                  Отзывов по выбранной категории пока нет
                </p>
              </div>
            )}

            {/* Форма отзыва */}
            <div className="mt-16 max-w-2xl mx-auto">
              {!showForm ? (
                <Card className="border-2 border-gold-400/50 shadow-2xl" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                  <CardContent className="p-8 text-center">
                    <Icon name="MessageSquarePlus" className="mx-auto text-gold-400 mb-4" size={48} />
                    <h2 className="font-montserrat font-bold text-2xl text-gold-200 mb-4">
                      Поделитесь своим опытом
                    </h2>
                    <p className="text-emerald-100 mb-6">
                      Ваш отзыв поможет другим людям найти путь к гармонии
                    </p>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold px-10"
                      onClick={() => setShowForm(true)}
                    >
                      <Icon name="Star" className="mr-2" size={20} />
                      Оставить отзыв
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-gold-400/50 shadow-2xl" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-montserrat font-bold text-2xl text-gold-200">
                        Оставить отзыв
                      </h2>
                      <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-gold-400">
                        <Icon name="X" size={20} />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-emerald-100 mb-2">Ваше имя</Label>
                        <Input 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Как к вам обращаться?"
                          className="bg-emerald-950/50 border-gold-400/30 text-emerald-100"
                        />
                      </div>

                      <div>
                        <Label className="text-emerald-100 mb-2">Услуга</Label>
                        <select 
                          value={formData.service}
                          onChange={(e) => setFormData({...formData, service: e.target.value})}
                          className="w-full h-10 px-3 rounded-md bg-emerald-950/50 border border-gold-400/30 text-emerald-100"
                        >
                          <option value="">Выберите услугу</option>
                          {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <Label className="text-emerald-100 mb-2">Оценка</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setFormData({...formData, rating: star})}
                              className="transition-transform hover:scale-110"
                            >
                              <Icon 
                                name="Star" 
                                size={32}
                                className={star <= formData.rating ? "text-gold-400 fill-gold-400" : "text-gray-400"}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-emerald-100 mb-2">Ваш отзыв</Label>
                        <Textarea 
                          value={formData.text}
                          onChange={(e) => setFormData({...formData, text: e.target.value})}
                          placeholder="Поделитесь своими впечатлениями..."
                          rows={5}
                          className="bg-emerald-950/50 border-gold-400/30 text-emerald-100"
                        />
                      </div>

                      {submitMessage && (
                        <p className="text-center text-emerald-100 font-medium">{submitMessage}</p>
                      )}

                      <Button 
                        onClick={handleSubmitReview}
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold"
                      >
                        {submitting ? 'Отправка...' : 'Отправить отзыв'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

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