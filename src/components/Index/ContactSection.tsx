import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import PhoneLink from "@/components/ui/phone-link";

const ContactSection = () => {
  return (
    <>
      <div id="contact" className="scroll-target"></div>
      <section className="py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-8">Записаться на сеанс</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Подарите себе момент полного расслабления и восстановления сил
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-3 text-lg">
              <Icon name="MapPin" className="text-gold-400" size={24} />
              <span className="text-emerald-200">Район Нагатино-Садовники
адрес уточню по телефону</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <Icon name="Clock" className="text-gold-400" size={24} />
              <span className="text-emerald-200">Ежедневно 12:00-22:00</span>
            </div>
          </div>
          
          <PhoneLink>
            <Button size="lg" className="mt-8 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-medium px-12 py-4 text-lg hover:scale-105 transition-all duration-300">
              <Icon name="Phone" className="mr-2" size={20} />
              Позвонить: +7(918) 414-1221
            </Button>
          </PhoneLink>
        </div>
      </section>
    </>
  );
};

export default ContactSection;