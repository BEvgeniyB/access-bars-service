import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import ReviewsCarousel from "@/components/reviews/ReviewsCarousel";

const ReviewsSection = () => {
  return (
    <>
      <div id="reviews" className="scroll-target"></div>
      <section className="py-20 relative"
        style={{
          background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start mb-12 animate-fade-in">
            <div className="flex-1">
              <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Отзывы клиентов</h2>
              <p className="text-xl text-emerald-100">Истории тех, кто уже нашел свой путь к гармонии</p>
            </div>
            <Link to="/reviews">
              <Button 
                variant="outline" 
                className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400/10 px-8 py-3 whitespace-nowrap"
              >
                <Icon name="Star" className="mr-2" size={16} />
                Все отзывы
              </Button>
            </Link>
          </div>

          <ReviewsCarousel />
        </div>
      </section>
    </>
  );
};

export default ReviewsSection;