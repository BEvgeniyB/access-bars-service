import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface TrainingCoursesProps {
  onBookingClick: () => void;
}

const courses = [
  {
    title: "Обучение технике Access Bars. Доступно всем",
    level: "",
    description: "Ну что готовы к переменам?\nИ стать создателями своей жизни?\n⠀\nПриглашаю вас на обучение\nAccess Bars💆‍♀️\nВсего 1 день!\nЧто в переводе означает Доступ к осознанности\n⠀\nГде осознанность- способность постоянно открываться большим возможностям, большему выбору и большему в жизни.\n⠀\nА Бары это 32 точки на голове, которые отвечают за основные сферы жизни.\nДеньги\nКонтроль\nСозидание\nСоздание связей\nТело\nИсцеление\nСексуальность\nБлагодарность\nКомуникации\nИ т.д...\n⠀\nПрикасаясь к этим точкам, происходит удаление ненужных программ и ограничений...\n⠀\nПосле чего в вашей жизни происходят чудеса и все что вы хотите максимально легко и просто появляется в вашей жизни💫\n⠀\nОбучение всего 1 день!\n✔Вы получаете новую профессию\n✔Сертификат международного образца\n✔учебное пособие\n✔ Инструмент на всю жизнь, который вы можете использовать в любое время и в любой ситуации.\n✔ 2 сессии баров за одно обучение\n⠀\nИ безграничные возможности💫",
    duration: "8 часов",
    includes: []
  }
];

const TrainingCourses = ({ onBookingClick }: TrainingCoursesProps) => {
  return (
    <>
      <div id="courses" className="scroll-target"></div>
      <section className="py-16 relative" style={{
      backgroundImage: `url('https://cdn.poehali.dev/files/fd60c33c-3948-432b-92ba-2955cd2ace49.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute inset-0 bg-emerald-900/30"></div>
      <div className="container mx-auto px-4">
        {/* Training Images */}
        <div className="mb-16 relative">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center mb-12">
              <img 
                src="https://cdn.poehali.dev/files/8275db6f-798b-4e88-a456-14180b05b03a.jpg"
                alt="Обучение Access Bars"
                className="w-full h-96 object-cover shadow-2xl animate-slide-up rounded-full"
              />
              <img 
                src="https://cdn.poehali.dev/files/490dc0d3-fe4d-417d-b8ce-88a1d4a775d6.jpg"
                alt="Сертификат Access Bars"
                className="w-full h-96 object-cover shadow-2xl animate-slide-up rounded-full"
              />
            </div>
            
            {/* Training Description Text */}
            <div className="bg-emerald-800/40 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-2xl border border-gold-400/20 mx-auto">
              <div className="text-emerald-50 leading-snug space-y-2">
                <p className="text-sm md:text-base font-semibold text-gold-200">
                  Ну что готовы к переменам? И стать создателями своей жизни?
                </p>
                
                <p className="text-xs md:text-sm">
                  Приглашаю вас на обучение <span className="text-gold-300 font-semibold">Access Bars💆‍♀️</span> Всего 1 день!
                  Что в переводе означает <span className="text-gold-300 font-semibold">Доступ к осознанности</span>
                </p>
                
                <p className="text-xs md:text-sm">
                  Где осознанность - способность постоянно открываться большим возможностям, большему выбору и большему в жизни.
                </p>
                
                <div>
                  <p className="text-xs md:text-sm mb-1">
                    А Бары это 32 точки на голове, которые отвечают за основные сферы жизни:
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-1 text-xs text-gold-200 pl-2">
                    <span>• Деньги</span>
                    <span>• Контроль</span>
                    <span>• Созидание</span>
                    <span>• Связи</span>
                    <span>• Тело</span>
                    <span>• Исцеление</span>
                    <span>• Сексуальность</span>
                    <span>• Благодарность</span>
                    <span>• Коммуникации</span>
                    <span>• И т.д...</span>
                  </div>
                </div>
                
                <p className="text-xs md:text-sm">
                  Прикасаясь к этим точкам, происходит удаление ненужных программ и ограничений...
                </p>
                
                <p className="text-xs md:text-sm font-semibold text-gold-200">
                  После чего в вашей жизни происходят чудеса и все что вы хотите максимально легко и просто появляется в вашей жизни💫
                </p>
                
                <div className="border-t border-gold-400/30 pt-2 mt-2">
                  <p className="text-sm md:text-base font-bold text-gold-300 mb-2">Обучение всего 1 день!</p>
                  <div className="space-y-1 text-xs md:text-sm">
                    <p>✔ Вы получаете новую профессию</p>
                    <p>✔ Сертификат международного образца</p>
                    <p>✔ Учебное пособие</p>
                    <p>✔ Инструмент на всю жизнь, который вы можете использовать в любое время и в любой ситуации</p>
                    <p>✔ 2 сессии баров за одно обучение</p>
                  </div>
                </div>
                
                <p className="text-center text-sm md:text-base font-bold text-gold-300 pt-2">
                  И безграничные возможности💫
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Программы обучения</h3>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Выберите программу, соответствующую вашему уровню и целям
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {courses.map((course, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group bg-emerald-800/30 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-500"></div>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-xl font-montserrat text-gold-200">{course.title}</CardTitle>
                  <span className="text-sm bg-gold-400/20 text-gold-400 px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                </div>
                <CardDescription className="text-base text-emerald-200">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-emerald-200">Длительность:</span>
                    <span className="text-emerald-200">{course.duration}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-emerald-200 font-semibold">Стоимость:</div>
                    <div className="space-y-1 text-sm">
                      <div className="text-gold-400 font-bold text-lg">29 000₽</div>
                      <div className="text-gold-400 font-bold">Повторно: 14 500₽</div>
                      <div className="text-emerald-200">Дети до 16 лет: бесплатно</div>
                      <div className="text-gold-400 font-bold">16-18 лет: 14 500₽</div>
                      <div className="text-emerald-300 text-xs italic">В сопровождении родителей</div>
                    </div>
                  </div>
                  

                  
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold transition-colors"
                    onClick={onBookingClick}
                  >Записаться</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group bg-emerald-800/30 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-500"></div>
            <CardHeader>
              <CardTitle className="text-xl font-montserrat text-gold-200">Как проходит обучение Access Bars?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-emerald-100 text-sm leading-relaxed space-y-3">
                <p className="font-semibold text-gold-200">Начало в 10:00 или 11:00</p>
                <p>Смотрим по энергиям и желаниям💫 (всего 9 часов)</p>
                <p>Удобно располагаемся, наливаем себе чай, кофе и приступаем к теории.</p>
                
                <div className="space-y-2 mt-4">
                  <p className="font-semibold text-gold-200">Теория 2 часа.</p>
                  <p>После обучающее видео от Создателей Access Consciousness 40 мин.</p>
                  <p>Перерыв на обед 1 час.</p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-gold-200">Дальше практика:</p>
                  <p>вы делаете 1 сеанс партнеру, а потом он вам по 40 мин.</p>
                </div>
                
                <div className="space-y-2 border-t border-gold-400/30 pt-3 mt-4">
                  <p className="font-semibold text-gold-200">2я часть обучения по запросу...</p>
                  <p>Рассказываю как и где дополнительно можно использовать инструменты Аксесс для усиления результата. 1 час.</p>
                  <p>Обмены практическая часть по 40 мин.</p>
                  <p className="font-bold text-gold-200">Итого 2 сессии баров за одно обучение с моим сопровождением.</p>
                </div>
                
                <div className="border-t border-gold-400/30 pt-3 mt-4">
                  <p className="font-semibold text-gold-200">Выдаю:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Книгу Access Consciousness</li>
                    <li>• Мануал с точками</li>
                    <li>• Инструкцию</li>
                    <li>• И сертификат международного образца действующий 172 странах мира</li>
                  </ul>
                </div>
                
                <div className="space-y-2 border-t border-gold-400/30 pt-3 mt-4">
                  <p>После обучения вы уже можете использовать свои знания на практике и ставить комфортную для себя цену за сеанс.</p>
                  <p className="font-semibold text-gold-200">А как может быть еще лучше?</p>
                </div>
                
                <div className="text-center space-y-2 border-t border-gold-400/30 pt-3 mt-4">
                  <p className="font-bold text-gold-200">Хватит откладывать свою жизнь на потом...</p>
                  <p className="font-bold text-gold-200">Начните жить сейчас💫</p>
                  <p>Ведь Аксесс это лучшее, что может с вами произойти💫</p>
                  <p className="font-semibold text-emerald-300 italic">Записывайтесь на обучение и я с удовольствием стану вашим проводником в мир осознанности! 💫</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
    </>
  );
};

export default TrainingCourses;