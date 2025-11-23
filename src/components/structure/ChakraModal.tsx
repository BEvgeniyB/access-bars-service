import { useState, useMemo } from 'react';
import { Chakra } from '@/types/chakra';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ChakraModalProps {
  chakra: Chakra;
  onClose: () => void;
}

const ChakraModal = ({ chakra, onClose }: ChakraModalProps) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Получаем список уникальных ответственных из всех данных
  const responsibleUsers = useMemo(() => {
    const userMap = new Map<number, string>();
    
    chakra.concepts?.forEach(c => {
      if (c.user_id && c.user_name) userMap.set(c.user_id, c.user_name);
    });
    chakra.organs?.forEach(o => {
      if (o.user_id && o.user_name) userMap.set(o.user_id, o.user_name);
    });
    chakra.sciences?.forEach(s => {
      if (s.user_id && s.user_name) userMap.set(s.user_id, s.user_name);
    });
    chakra.responsibilities?.forEach(r => {
      if (r.user_id && r.user_name) userMap.set(r.user_id, r.user_name);
    });
    chakra.questions?.forEach(q => {
      if (q.user_id && q.user_name) userMap.set(q.user_id, q.user_name);
    });
    
    return Array.from(userMap.entries()).map(([id, name]) => ({ id, name }));
  }, [chakra]);

  // Фильтрация данных по выбранному ответственному
  const filteredData = useMemo(() => {
    if (!selectedUserId) return chakra;
    
    return {
      ...chakra,
      concepts: chakra.concepts?.filter(c => c.user_id === selectedUserId),
      organs: chakra.organs?.filter(o => o.user_id === selectedUserId),
      sciences: chakra.sciences?.filter(s => s.user_id === selectedUserId),
      responsibilities: chakra.responsibilities?.filter(r => r.user_id === selectedUserId),
      questions: chakra.questions?.filter(q => q.user_id === selectedUserId),
    };
  }, [chakra, selectedUserId]);

  // Показываем остальные вкладки только если выбран конкретный ответственный
  const showDetailTabs = selectedUserId !== null;

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

        {/* Кнопки фильтрации по ответственным */}
        {responsibleUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            <Button
              variant={selectedUserId === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedUserId(null);
                setActiveTab('overview');
              }}
            >
              Все
            </Button>
            {responsibleUsers.map(user => (
              <Button
                key={user.id}
                variant={selectedUserId === user.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedUserId(user.id);
                  setActiveTab('overview');
                }}
              >
                {user.name}
              </Button>
            ))}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${showDetailTabs ? 'grid-cols-5' : 'grid-cols-1'}`}>
            <TabsTrigger value="overview">Общие</TabsTrigger>
            {showDetailTabs && (
              <>
                <TabsTrigger value="concepts">Энергии</TabsTrigger>
                <TabsTrigger value="responsibility">Ответственность</TabsTrigger>
                <TabsTrigger value="physical">Физический мир</TabsTrigger>
                <TabsTrigger value="questions">Вопросы</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-3">
            {!selectedUserId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
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
                    Основной ответственный
                  </p>
                  <p className="text-blue-700">{chakra.responsible_name || 'Не назначен'}</p>
                </div>
              </div>
            )}

            {/* Энергии с именами ответственных */}
            {filteredData.concepts && filteredData.concepts.length > 0 && (
              <div className="mb-3">
                <p className="font-bold text-purple-900 mb-2 flex items-center gap-1">
                  ⚡ Энергии
                  {selectedUserId && (
                    <span className="text-xs font-normal text-gray-600 ml-2">
                      ({filteredData.concepts.length})
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {filteredData.concepts.map((concept, idx) => (
                    <div key={idx} className="p-2 bg-purple-50 rounded-lg border border-purple-200 flex justify-between items-center">
                      <span className="text-purple-900 font-medium">⚡ {concept.concept}</span>
                      {!selectedUserId && concept.user_name && (
                        <span className="text-purple-600 text-xs">{concept.user_name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Органы */}
            {filteredData.organs && filteredData.organs.length > 0 && (
              <div className="mb-3">
                <p className="font-bold text-red-900 mb-2 flex items-center gap-1">
                  <Icon name="Heart" size={14} />
                  Органы
                  {selectedUserId && (
                    <span className="text-xs font-normal text-gray-600 ml-2">
                      ({filteredData.organs.length})
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {filteredData.organs.map((organ, idx) => (
                    <div key={idx} className="p-2 bg-red-50 rounded border border-red-200">
                      <p className="text-red-900 font-medium">{organ.organ_name}</p>
                      {!selectedUserId && organ.user_name && (
                        <p className="text-red-600 text-xs">{organ.user_name}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Науки */}
            {filteredData.sciences && filteredData.sciences.length > 0 && (
              <div className="mb-3">
                <p className="font-bold text-blue-900 mb-2 flex items-center gap-1">
                  <Icon name="BookOpen" size={14} />
                  Науки
                  {selectedUserId && (
                    <span className="text-xs font-normal text-gray-600 ml-2">
                      ({filteredData.sciences.length})
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {filteredData.sciences.map((science, idx) => (
                    <div key={idx} className="p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-blue-900 font-medium">{science.science_name}</p>
                      {!selectedUserId && science.user_name && (
                        <p className="text-blue-600 text-xs">{science.user_name}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ответственность */}
            {filteredData.responsibilities && filteredData.responsibilities.length > 0 && (
              <div className="mb-3">
                <p className="font-bold text-orange-900 mb-2 flex items-center gap-1">
                  <Icon name="Building" size={14} />
                  Зоны ответственности
                  {selectedUserId && (
                    <span className="text-xs font-normal text-gray-600 ml-2">
                      ({filteredData.responsibilities.length})
                    </span>
                  )}
                </p>
                <div className="space-y-2 text-xs">
                  {filteredData.responsibilities.map((resp, idx) => (
                    <div key={idx} className="p-2 bg-orange-50 rounded border border-orange-200">
                      <p className="text-orange-900 font-medium">{resp.responsibility}</p>
                      {!selectedUserId && resp.user_name && (
                        <p className="text-orange-600 text-xs">{resp.user_name}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Вопросы */}
            {filteredData.questions && filteredData.questions.length > 0 && (
              <div className="mb-3">
                <p className="font-bold text-yellow-900 mb-2 flex items-center gap-1">
                  <Icon name="HelpCircle" size={14} />
                  Вопросы
                  {selectedUserId && (
                    <span className="text-xs font-normal text-gray-600 ml-2">
                      ({filteredData.questions.length})
                    </span>
                  )}
                </p>
                <div className="space-y-2 text-xs">
                  {filteredData.questions.map((q, idx) => (
                    <div key={idx} className="p-2 bg-yellow-50 rounded border border-yellow-200 flex justify-between items-start">
                      <p className="text-yellow-900 flex items-start gap-1">
                        <span>{q.is_resolved ? '✓' : '○'}</span>
                        <span>{q.question}</span>
                      </p>
                      {!selectedUserId && q.user_name && (
                        <span className="text-yellow-600 text-xs ml-2">{q.user_name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {showDetailTabs && (
            <>
              <TabsContent value="concepts" className="space-y-3">
                {filteredData.concepts && filteredData.concepts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredData.concepts.map((concept, idx) => (
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
                  <p className="text-gray-500 italic">Нет данных для выбранного ответственного</p>
                )}
              </TabsContent>

              <TabsContent value="responsibility" className="space-y-3">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Icon name="Building" size={20} />
                  Зоны ответственности
                </h3>
                {filteredData.responsibilities && filteredData.responsibilities.length > 0 ? (
                  <div className="space-y-2">
                    {filteredData.responsibilities.map((resp, idx) => (
                      <div key={idx} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-orange-900">{resp.responsibility}</p>
                        {resp.category && (
                          <p className="text-xs text-orange-600 mt-1">{resp.category}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Нет данных для выбранного ответственного</p>
                )}
              </TabsContent>

              <TabsContent value="physical" className="space-y-4">
                {filteredData.organs && filteredData.organs.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Icon name="Heart" size={20} />
                      Органы тела
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {filteredData.organs.map((organ, idx) => (
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

                {filteredData.sciences && filteredData.sciences.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Icon name="BookOpen" size={20} />
                      Науки и дисциплины
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {filteredData.sciences.map((science, idx) => (
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

                {(!filteredData.organs || filteredData.organs.length === 0) && 
                 (!filteredData.sciences || filteredData.sciences.length === 0) && (
                  <p className="text-gray-500 italic">Нет данных для выбранного ответственного</p>
                )}
              </TabsContent>

              <TabsContent value="questions" className="space-y-3">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Icon name="HelpCircle" size={20} />
                  Вопросы на согласование
                </h3>
                {filteredData.questions && filteredData.questions.length > 0 ? (
                  <div className="space-y-2">
                    {filteredData.questions.map((q, idx) => (
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
                  <p className="text-gray-500 italic">Нет данных для выбранного ответственного</p>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ChakraModal;
