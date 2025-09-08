import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface TrainingCoursesProps {
  onBookingClick: () => void;
}

const courses = [
  {
    title: "1-й уровень",
    level: "Базовый",
    description: "Изучите основы техники Access Bars и начните путь к энергетическому исцелению",
    duration: "8 часов",
    includes: [
      "Теоретические основы Access Bars",
      "Практические упражнения",
      "Сертификат участника",
      "Методические материалы"
    ]
  },
  {
    title: "Повторное обучение",
    level: "Практика",
    description: "Углубите знания и получите дополнительную практику с опытным инструктором",
    duration: "8 часов",
    includes: [
      "Повторение техники",
      "Дополнительная практика",
      "Работа с трудными случаями",
      "Обновленные материалы"
    ]
  },
  {
    title: "Детское обучение",
    level: "Семья",
    description: "Специальная программа для детей и подростков с учетом их особенностей",
    duration: "6 часов",
    includes: [
      "Адаптированная программа",
      "Игровые элементы",
      "Семейные упражнения",
      "Детские материалы"
    ]
  }
];

const TrainingCourses = ({ onBookingClick }: TrainingCoursesProps) => {
  return (
    <section id="courses" className="py-16 relative" style={{
      backgroundImage: `url('https://cdn.poehali.dev/files/fd60c33c-3948-432b-92ba-2955cd2ace49.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute inset-0 bg-emerald-900/30"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="font-montserrat font-bold text-3xl text-gold-100 mb-4">Программы обучения</h3>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Выберите программу, соответствующую вашему уровню и целям
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
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
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gold-200">Включено в курс:</h4>
                    <ul className="space-y-2">
                      {course.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Icon name="Check" className="text-gold-400 mt-0.5 flex-shrink-0" size={16} />
                          <span className="text-sm text-emerald-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-emerald-900 font-bold transition-colors"
                    onClick={onBookingClick}
                  >
                    Записаться на курс
                  </Button>
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
                <p className="font-semibold text-gold-200">Приглашаю вас на обучение Access Bars💫</p>
                <p className="font-bold">Всего 1 день!</p>
                <p>Чтобы владеть простой в применении, но мощной по своему воздействию энергетической техникой.</p>
                
                <div className="space-y-2 mt-4">
                  <p className="font-semibold text-gold-200">Что такое Access Bars?</p>
                  <p>Это 32 точки на голове, которые содержат все мысли, идеи, убеждения, эмоции и суждения, которые вы когда-либо накапливали в любой сфере жизни.</p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-gold-200">Что дает процесс?</p>
                  <p>Активация этих точек позволяет рассеивать электромагнитный заряд от всего, что вас ограничивает.</p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-gold-200">Access Bars помогает:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Снять стресс и тревогу</li>
                    <li>• Улучшить сон</li>
                    <li>• Повысить энергию</li>
                    <li>• Улучшить отношения</li>
                    <li>• Развить креативность</li>
                    <li>• Избавиться от ограничивающих убеждений</li>
                  </ul>
                </div>
                
                <div className="border-t border-gold-400/30 pt-3 mt-4">
                  <p className="font-semibold text-gold-200">В стоимость входит:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Обучение технике Access Bars</li>
                    <li>• Практика в парах</li>
                    <li>• Официальный сертификат</li>
                    <li>• Методические материалы</li>
                    <li>• Поддержка после обучения</li>
                  </ul>
                </div>
                
                <p className="text-xs italic text-emerald-300 mt-3">
                  После прохождения курса вы получите все необходимые знания и практические навыки для работы с техникой Access Bars.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TrainingCourses;