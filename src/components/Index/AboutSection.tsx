import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BusinessCard from "@/components/BusinessCard";

const AboutSection = () => {
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <>
      <div id="about" className="scroll-target"></div>
      <section className="py-20 relative"
        style={{
          background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-montserrat font-bold text-4xl text-gold-100">Обо мне ...</h2>
            <Button
              onClick={() => setIsCardOpen(true)}
              className="bg-gold-400 hover:bg-gold-500 text-emerald-900 font-medium"
            >
              <Icon name="CreditCard" className="mr-2" size={18} />
              Моя визитка
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div className="animate-fade-in">
              <div className="text-lg text-emerald-100 mb-8 leading-relaxed space-y-4">
                <p className="text-xl text-gold-200 font-semibold">
                  Духовный Наставник не по Образу, а по предназначению! 💫
                </p>
                
                <p>
                  Мой Дар уникальный и очень сильный!<br/>
                  Перешел как по маминой, так и по папиной линии Рода.<br/>
                  Две противоположные энергии соединились во мне и раскрыли необычную синергию энергий 💫
                </p>
                
                <p>
                  Ценность энергии в том, что я корректирую дисфункцию человека, как на физическом, так и на психическом и энергетическом уровнях.
                </p>
                
                <p>
                  После сеанса человек находит опору в себе, трезво смотрит на мир и при этом чувствует свободу и расширение своей энергии 💫
                </p>
                
                <p>
                  Более 6 лет я профессионально работаю с людьми и получаю хорошие результаты.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-emerald-800/30 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="text-3xl font-bold text-gold-400 mb-2">200+</div>
                  <div className="text-emerald-200">Довольных клиентов</div>
                </div>
                <div className="text-center p-6 bg-emerald-800/30 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="text-3xl font-bold text-gold-400 mb-2">6</div>
                  <div className="text-emerald-200">Лет опыта</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <p className="font-semibold text-center text-amber-400">
                  Позвольте себе погрузиться в мир гармонии и исцеления. Запишитесь на сеанс прямо сейчас!
                </p>
              </div>
              <div className="p-6 rounded-2xl shadow-lg flex items-center gap-4" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                  <Icon name="Heart" className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">Индивидуальный подход</h3>
                  <p className="text-emerald-200">Персональные программы для каждого клиента</p>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl shadow-lg flex items-center gap-4" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                  <Icon name="Award" className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">Сертифицированный мастер</h3>
                  <p className="text-emerald-200">Международные дипломы и постоянное обучение</p>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl shadow-lg flex items-center gap-4" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: `url('https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg') center/cover`}}>
                  <Icon name="Leaf" className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-gold-200">100% натуральные компоненты</h3>
                  <p className="text-emerald-200">Только органические масла и экстракты</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isCardOpen && <BusinessCard onClose={() => setIsCardOpen(false)} />}
    </>
  );
};

export default AboutSection;