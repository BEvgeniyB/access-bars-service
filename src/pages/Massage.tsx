import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';

export default function Massage() {
  const services = [
    {
      title: "Классический массаж",
      description: "Глубокая проработка мышц и суставов для снятия напряжения и восстановления",
      duration: "60-90 минут",
      benefits: ["Улучшение кровообращения", "Снятие мышечного напряжения", "Восстановление подвижности"]
    },
    {
      title: "Ароматерапия",
      description: "Расслабляющий массаж с натуральными эфирными маслами",
      duration: "60 минут", 
      benefits: ["Глубокое расслабление", "Снятие стресса", "Гармонизация эмоций"]
    },
    {
      title: "Комплексная программа",
      description: "Сочетание классических техник с ароматерапией",
      duration: "90 минут",
      benefits: ["Комплексное оздоровление", "Максимальный эффект", "Индивидуальный подход"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-4 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-blue-100">
            <Icon name="Sparkles" className="text-blue-600" size={16} />
            <span className="text-sm font-medium text-blue-700">Профессиональный массаж</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Массаж и
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block">
              Ароматерапия
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Восстановите гармонию тела и души с помощью классических техник массажа 
            и целебной силы натуральных эфирных масел
          </p>

          {/* Мастер инфо */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto mb-8 border border-blue-100">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Icon name="Award" className="text-white" size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-800">Сертифицированный мастер</h3>
                <p className="text-sm text-slate-600">6 лет опыта</p>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Профессиональное образование и многолетний опыт для вашего здоровья
            </p>
          </div>
        </motion.div>

        {/* Декоративные элементы */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Услуги массажа</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Выберите подходящую программу для восстановления и оздоровления
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Icon name="Heart" className="text-white" size={20} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Clock" className="text-blue-500" size={16} />
                  <span className="text-sm text-slate-600">{service.duration}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-700 text-sm">Эффект:</h4>
                  {service.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Icon name="Check" className="text-green-500" size={14} />
                      <span className="text-xs text-slate-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Преимущества массажа</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Научно доказанные эффекты массажной терапии для здоровья
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "Zap", title: "Энергия", desc: "Восстановление жизненных сил" },
              { icon: "Shield", title: "Иммунитет", desc: "Укрепление защитных функций" },
              { icon: "Moon", title: "Сон", desc: "Улучшение качества отдыха" },
              { icon: "Smile", title: "Настроение", desc: "Снятие стресса и тревог" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={item.icon as any} className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white"
          >
            <Icon name="Calendar" className="mx-auto mb-4" size={48} />
            <h2 className="text-3xl font-bold mb-4">Запишитесь на сеанс</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Доверьтесь опытному мастеру с 6-летним стажем для восстановления 
              вашего здоровья и гармонии
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              Записаться на массаж
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}