import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const testimonials = [
  {
    name: "Анна К.",
    text: "После курса Access Bars я почувствовала невероятную легкость. Ушли постоянные головные боли и улучшился сон. Рекомендую всем!",
    rating: 5
  },
  {
    name: "Михаил С.",
    text: "Сначала был скептически настроен, но техника действительно работает. Заметил, как изменилось мое отношение к стрессовым ситуациям.",
    rating: 5
  },
  {
    name: "Елена Д.",
    text: "Прекрасный инструктор и атмосфера на курсе. Получила не только знания, но и мощную энергетическую поддержку. Спасибо!",
    rating: 5
  },
  {
    name: "Дмитрий В.",
    text: "Access Bars помогли мне найти внутренний покой. Теперь регулярно практикую технику и делюсь с близкими.",
    rating: 5
  }
];

const TrainingTestimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-emerald-950/90 to-emerald-900/90">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Отзывы учеников</h3>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Узнайте, что говорят люди, которые уже освоили технику Access Bars
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-emerald-800/40 backdrop-blur-sm border-gold-400/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gold-400/20 rounded-full">
                    <Icon name="User" size={24} className="text-gold-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Icon key={i} name="Star" size={16} className="text-gold-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-emerald-100 mb-3 leading-relaxed">"{testimonial.text}"</p>
                    <p className="text-gold-200 font-semibold">{testimonial.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainingTestimonials;