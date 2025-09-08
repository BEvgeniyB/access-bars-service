import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const benefits = [
  {
    icon: "Brain",
    title: "Снижение стресса",
    description: "Глубокое расслабление и освобождение от накопленного напряжения"
  },
  {
    icon: "Heart",
    title: "Эмоциональное равновесие", 
    description: "Гармонизация эмоционального состояния и внутреннего баланса"
  },
  {
    icon: "Zap",
    title: "Повышение энергии",
    description: "Восстановление энергетических ресурсов и жизненных сил"
  },
  {
    icon: "Moon",
    title: "Улучшение сна",
    description: "Нормализация сна и восстановление естественных биоритмов"
  },
  {
    icon: "Sparkles",
    title: "Ясность мышления",
    description: "Освобождение от ментального напряжения и повышение концентрации"
  },
  {
    icon: "Smile",
    title: "Общее благополучие",
    description: "Улучшение качества жизни и ощущение внутренней гармонии"
  }
];

const AccessBarsBenefits = () => {
  return (
    <>
      <div id="benefits" className="scroll-target"></div>
      <section className="py-20 relative" style={{backgroundImage: `url('https://cdn.poehali.dev/files/4e668bb9-7ccd-46e9-9329-0f7414a65ea0.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Польза Access Bars</h2>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Многогранное положительное влияние на физическое и эмоциональное состояние
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-emerald-800/30 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-400/30 transition-colors">
                  <Icon name={benefit.icon as any} className="text-gold-400" size={28} />
                </div>
                <CardTitle className="font-montserrat text-xl text-gold-200 group-hover:text-gold-400 transition-colors">
                  {benefit.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-emerald-200 leading-relaxed">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </>
  );

export default AccessBarsBenefits;