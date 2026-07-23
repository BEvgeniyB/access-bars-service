import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceContactPopover from "@/components/ui/service-contact-popover";
import { getDetailedServicesByCategory } from "@/data/services";

// Используем данные из центрального источника
const sessions = getDetailedServicesByCategory('Access Bars');

const AccessBarsSessions = () => {
  return (
    <>
      <div id="sessions" className="scroll-target"></div>
      <section className="py-20 relative" style={{backgroundImage: `url('https://cdn.poehali.dev/files/8257b36c-01da-4ea7-8a9a-76326d9b58b0.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">Варианты сессий</h2>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Выберите подходящий формат для знакомства с Access Bars
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sessions.map((session, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 relative overflow-hidden bg-emerald-800/30 backdrop-blur-sm">
              {session.name.includes('Интенсивная') && (
                <div className="absolute top-4 right-4 bg-gold-400 text-emerald-900 px-3 py-1 rounded-full text-sm font-medium">
                  Популярно
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="font-montserrat text-xl text-gold-200 group-hover:text-gold-400 transition-colors mb-2">
                  {session.name}
                </CardTitle>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold text-gold-400">{session.price}</div>
                  <div className="text-sm text-emerald-200">{session.duration}</div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-emerald-200 leading-relaxed mb-6">
                  {session.description}
                </CardDescription>
                <ServiceContactPopover serviceName={session.name} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default AccessBarsSessions;