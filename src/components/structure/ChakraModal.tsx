import { Chakra } from '@/types/chakra';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface ChakraModalProps {
  chakra: Chakra;
  onClose: () => void;
}

const ChakraModal = ({ chakra, onClose }: ChakraModalProps) => {
  return (
    <Dialog open={!!chakra} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: chakra.color }}
            >
              {chakra.position}
            </div>
            <span style={{ color: chakra.color }}>{chakra.name}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="concepts">Энергии</TabsTrigger>
            <TabsTrigger value="responsibility">Ответственность</TabsTrigger>
            <TabsTrigger value="physical">Физический мир</TabsTrigger>
            <TabsTrigger value="questions">Вопросы</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Континент и Ответственный */}
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="font-bold text-emerald-900 mb-1 flex items-center gap-1">
                  <Icon name="Globe" size={14} />
                  Континент
                </p>
                <p className="text-emerald-700">{chakra.continent || 'Не указан'}</p>
              </div>

              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-bold text-blue-900 mb-1 flex items-center gap-1">
                  <Icon name="User" size={14} />
                  Ответственный
                </p>
                <p className="text-blue-700">{chakra.responsible_name || 'Не назначен'}</p>
                {chakra.responsible_email && (
                  <p className="text-blue-600">{chakra.responsible_email}</p>
                )}
              </div>

              {/* Энергии */}
              {chakra.concepts && chakra.concepts.length > 0 && (
                <div className="p-2 bg-purple-50 rounded-lg border border-purple-200 md:col-span-2">
                  <p className="font-bold text-purple-900 mb-1">⚡ Энергии</p>
                  <div className="flex flex-wrap gap-1">
                    {chakra.concepts.map((concept, idx) => (
                      <span key={idx} className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                        {concept.concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Органы */}
              {chakra.organs && chakra.organs.length > 0 && (
                <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-bold text-red-900 mb-1 flex items-center gap-1">
                    <Icon name="Heart" size={14} />
                    Органы
                  </p>
                  <div className="space-y-0.5">
                    {chakra.organs.map((organ, idx) => (
                      <p key={idx} className="text-red-700">{organ.organ_name}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Науки */}
              {chakra.sciences && chakra.sciences.length > 0 && (
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-bold text-blue-900 mb-1 flex items-center gap-1">
                    <Icon name="BookOpen" size={14} />
                    Науки
                  </p>
                  <div className="space-y-0.5">
                    {chakra.sciences.map((science, idx) => (
                      <p key={idx} className="text-blue-700">{science.science_name}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Ответственность */}
              {chakra.responsibilities && chakra.responsibilities.length > 0 && (
                <div className="p-2 bg-orange-50 rounded-lg border border-orange-200 md:col-span-2">
                  <p className="font-bold text-orange-900 mb-1 flex items-center gap-1">
                    <Icon name="Building" size={14} />
                    Зоны ответственности
                  </p>
                  <div className="space-y-0.5">
                    {chakra.responsibilities.map((resp, idx) => (
                      <p key={idx} className="text-orange-700">{resp.responsibility}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Вопросы */}
              {chakra.questions && chakra.questions.length > 0 && (
                <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200 md:col-span-2">
                  <p className="font-bold text-yellow-900 mb-1 flex items-center gap-1">
                    <Icon name="HelpCircle" size={14} />
                    Вопросы на согласование
                  </p>
                  <div className="space-y-0.5">
                    {chakra.questions.map((q, idx) => (
                      <p key={idx} className="text-yellow-700 flex items-start gap-1">
                        <span>{q.is_resolved ? '✓' : '○'}</span>
                        <span>{q.question}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="concepts" className="space-y-3">
            {chakra.concepts && chakra.concepts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {chakra.concepts.map((concept, idx) => (
                  <div key={idx} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-purple-900 font-medium flex items-center gap-2">
                      <span>⚡</span>
                      {concept.concept}
                    </p>
                    {concept.category && (
                      <p className="text-xs text-purple-600 mt-1 ml-6">{concept.category}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Информация пока не добавлена</p>
            )}
          </TabsContent>

          <TabsContent value="responsibility" className="space-y-3">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Icon name="Building" size={20} />
              Зоны ответственности
            </h3>
            {chakra.responsibilities && chakra.responsibilities.length > 0 ? (
              <div className="space-y-2">
                {chakra.responsibilities.map((resp, idx) => (
                  <div key={idx} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-900">{resp.responsibility}</p>
                    {resp.category && (
                      <p className="text-xs text-orange-600 mt-1">{resp.category}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Информация пока не добавлена</p>
            )}
          </TabsContent>

          <TabsContent value="physical" className="space-y-4">
            {chakra.organs && chakra.organs.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Icon name="Heart" size={20} />
                  Органы тела
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {chakra.organs.map((organ, idx) => (
                    <div key={idx} className="p-2 bg-red-50 rounded border border-red-200">
                      <p className="text-red-900 font-medium">{organ.organ_name}</p>
                      {organ.description && (
                        <p className="text-xs text-red-600 mt-1">{organ.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chakra.sciences && chakra.sciences.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Icon name="BookOpen" size={20} />
                  Науки и дисциплины
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {chakra.sciences.map((science, idx) => (
                    <div key={idx} className="p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-blue-900 font-medium">{science.science_name}</p>
                      {science.description && (
                        <p className="text-xs text-blue-600 mt-1">{science.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!chakra.organs || chakra.organs.length === 0) && 
             (!chakra.sciences || chakra.sciences.length === 0) && (
              <p className="text-gray-500 italic">Информация пока не добавлена</p>
            )}
          </TabsContent>

          <TabsContent value="questions" className="space-y-3">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Icon name="HelpCircle" size={20} />
              Вопросы на согласование
            </h3>
            {chakra.questions && chakra.questions.length > 0 ? (
              <div className="space-y-2">
                {chakra.questions.map((q, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg border ${
                      q.is_resolved 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon 
                        name={q.is_resolved ? "CheckCircle" : "AlertCircle"} 
                        size={20}
                        className={q.is_resolved ? "text-green-600" : "text-yellow-600"}
                      />
                      <p className={q.is_resolved ? "text-green-900" : "text-yellow-900"}>
                        {q.question}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Вопросов пока нет</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ChakraModal;