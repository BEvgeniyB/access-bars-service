import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const benefits = [
  {
    icon: "Brain",
    title: "Глубокая релаксация",
    description: "Техника способствует глубокому расслаблению нервной системы и снятию стресса"
  },
  {
    icon: "Heart",
    title: "Эмоциональное освобождение",
    description: "Помогает отпустить накопленные негативные эмоции и травмы"
  },
  {
    icon: "Sparkles",
    title: "Повышение осознанности",
    description: "Развивает интуицию и способность к глубокому самопознанию"
  },
  {
    icon: "Zap",
    title: "Энергетический баланс",
    description: "Восстанавливает естественный поток энергии в организме"
  },
  {
    icon: "Shield",
    title: "Укрепление иммунитета",
    description: "Способствует общему оздоровлению и укреплению защитных сил организма"
  },
  {
    icon: "Users",
    title: "Улучшение отношений",
    description: "Помогает установить более гармоничные отношения с окружающими"
  }
];

const TrainingBenefits = () => {
  return (
    <>
      <div id="benefits" className="scroll-target"></div>
      <section className="py-16 relative" style={{
      backgroundImage: `url('https://cdn.poehali.dev/files/0b3a5d2b-a1b4-4b32-b456-f4e6b3c8a9d0.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-emerald-950/70"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Преимущества техники Access Bars</h3>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Узнайте, как техника Access Bars может изменить вашу жизнь к лучшему
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-emerald-800/40 backdrop-blur-sm border-gold-400/20 hover:bg-emerald-800/60 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gold-400/20 rounded-full w-16 h-16 flex items-center justify-center">
                  <Icon name={benefit.icon as any} size={32} className="text-gold-400" />
                </div>
                <CardTitle className="text-xl text-gold-100">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-emerald-200 text-center">
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
};

export default TrainingBenefits;