import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AccessBarsFAQ = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-700/20 to-emerald-600/20 backdrop-blur-sm relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Частые вопросы</h2>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-emerald-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-montserrat text-lg text-gold-200">
                Безопасна ли процедура Access Bars?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-200">
                Да, Access Bars абсолютно безопасна. Это неинвазивная методика, которая включает 
                только легкие прикосновения к точкам на голове. Никаких побочных эффектов не наблюдается.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-emerald-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-montserrat text-lg text-gold-200">
                Что я буду чувствовать во время сессии?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-200">
                Большинство людей испытывают глубокое расслабление, некоторые засыпают. 
                Вы можете почувствовать тепло, покалывание или просто приятное спокойствие.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-emerald-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-montserrat text-lg text-gold-200">
                Сколько сессий нужно для результата?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-200">
                Многие клиенты замечают положительные изменения уже после первой сессии. 
                Для устойчивого эффекта рекомендуется курс из 3-5 сессий.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AccessBarsFAQ;