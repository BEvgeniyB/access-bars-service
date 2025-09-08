import Icon from "@/components/ui/icon";

const AccessBarsAbout = () => {
  return (
    <>
      <div id="about" className="scroll-target"></div>
      <section className="py-20 relative" style={{backgroundImage: `url('https://cdn.poehali.dev/files/4e668bb9-7ccd-46e9-9329-0f7414a65ea0.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="font-montserrat font-bold text-4xl text-gold-100 mb-6">Что такое Access Bars?</h2>
            <p className="text-lg text-emerald-100 mb-6 leading-relaxed">Access Bars — это набор инструментов и техник, разработанных для развития осознанности в каждом человеке.
Осознанность - охватывает всё сущее без осуждения. Это готовность и способность быть полностью присутствующим и осознающим во всех сферах своей жизни.
Осознанность — это способность постоянно открывать для себя новые возможности, расширять выбор и улучшать качество жизни.
Осознанность - позволяет присутствовать в каждом моменте жизни, не осуждая себя или других. Это умение принимать всё без отвержения и создавать именно то, чего вы желаете.
Вы можете иметь больше, чем имеете сейчас, и даже больше, чем можете представить.
А что, если вы готовы начать заботиться о себе и питать свою душу?
А что, если вы откроете дверь ко всему, что раньше казалось невозможным?
Как вы можете осознать свою жизненно важную роль в создании возможностей этого мира?</p>
            <p className="text-lg text-emerald-100 mb-6 leading-relaxed"></p>
            
            <div className="bg-gradient-to-r from-gold-500/20 to-emerald-600/20 p-6 rounded-2xl border border-gold-400/30 backdrop-blur-sm">
              <h3 className="font-montserrat font-semibold text-xl text-gold-200 mb-3">
                Как это работает?
              </h3>
              <p className="text-emerald-200 leading-relaxed">
                Специалист мягко касается определенных точек на вашей голове, активируя процесс 
                энергетического очищения. Это безопасно, расслабляюще и не требует никаких усилий с вашей стороны.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gold-500/20 to-emerald-600/20 p-8 rounded-3xl border border-gold-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center">
                  <Icon name="Timer" className="text-gold-400" size={28} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-xl text-gold-200">32 точки</h3>
                  <p className="text-emerald-200">Энергетические центры на голове</p>
                </div>
              </div>
              <p className="text-emerald-200">
                Каждая точка отвечает за определенную сферу жизни: отношения, деньги, 
                творчество, здоровье и многое другое.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gold-500/20 to-emerald-600/20 p-8 rounded-3xl border border-gold-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center">
                  <Icon name="Waves" className="text-gold-400" size={28} />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-xl text-gold-200">Мягкое воздействие</h3>
                  <p className="text-emerald-200">Деликатная энергетическая работа</p>
                </div>
              </div>
              <p className="text-emerald-200">
                Процедура проходит в комфортной обстановке, вы просто расслабляетесь 
                и позволяете энергии течь свободно.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
};

export default AccessBarsAbout;