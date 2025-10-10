import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const services = [
    {
      name: "Access Bars",
      duration: "90 мин",
      price: "от 7 000 ₽",
      description: "Телесная техника для освобождения от ментальных блоков и глубокой трансформации сознания",
      link: "/access-bars#sessions"
    },
    {
      name: "Целительство",
      duration: "60-120 мин",
      price: "от 7 000 ₽",
      description: "Энергетическое исцеление, работа с чакрами, аурой и восстановление баланса жизненных сил",
      link: "/healing#services"
    },
    {
      name: "Массаж",
      duration: "60-90 мин",
      price: "от 6 000 ₽", 
      description: "Широкий спектр массажных техник: классический, ароматерапия и другие виды",
      link: "/massage#services"
    },
    {
      name: "Обучение",
      duration: "От 4 часов", 
      price: "29 000 ₽",
      description: "Обучение технике Access Bars",
      link: "/training#courses"
    }
  ];

  return (
    <>
      <div id="services" className="scroll-target"></div>
      <section className="py-20 relative"
        style={{
          background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Наши услуги</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">Широкий спектр телесных техник для вашего здоровья и красоты</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="font-montserrat text-xl text-gold-200 group-hover:text-gold-400 transition-colors">
                      {service.name}
                    </CardTitle>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gold-400">{service.price}</div>

                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-emerald-200 leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <Link to={service.link}>
                    <Button className="w-full mt-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold">
                      <Icon name="ArrowRight" className="mr-2" size={16} />
                      Подробнее
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesSection;
