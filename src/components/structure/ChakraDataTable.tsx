import { useState } from 'react';
import { Chakra } from '@/types/chakra';
import Icon from '@/components/ui/icon';

interface ChakraDataTableProps {
  chakras: Chakra[];
}

type Category = 'concepts' | 'organs' | 'sciences' | 'responsibilities' | 'basic_needs';

const ChakraDataTable = ({ chakras }: ChakraDataTableProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('concepts');
  const [expandedChakras, setExpandedChakras] = useState<Set<number>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  const categories = [
    { key: 'concepts' as Category, label: 'Концепции', icon: 'Lightbulb' },
    { key: 'organs' as Category, label: 'Органы', icon: 'Heart' },
    { key: 'sciences' as Category, label: 'Науки', icon: 'BookOpen' },
    { key: 'responsibilities' as Category, label: 'Ответственности', icon: 'Shield' },
    { key: 'basic_needs' as Category, label: 'Базовые потребности', icon: 'Flame' },
  ];

  const toggleChakra = (chakraId: number) => {
    const newExpanded = new Set(expandedChakras);
    if (newExpanded.has(chakraId)) {
      newExpanded.delete(chakraId);
    } else {
      newExpanded.add(chakraId);
    }
    setExpandedChakras(newExpanded);
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedChakras(new Set());
    } else {
      setExpandedChakras(new Set(chakras.map(c => c.id)));
    }
    setAllExpanded(!allExpanded);
  };

  const getChakraItems = (chakra: Chakra, category: Category): any[] => {
    return chakra[category] || [];
  };

  const getItemName = (item: any, category: Category): string => {
    if (category === 'concepts') return item.concept;
    if (category === 'organs') return item.organ_name;
    if (category === 'sciences') return item.science_name;
    if (category === 'responsibilities') return item.responsibility;
    if (category === 'basic_needs') return item.basic_need;
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-emerald-900 mb-2">
          Таблица связей чакр
        </h2>
        <p className="text-emerald-700">
          Выберите категорию и чакру для просмотра связей
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => {
              setSelectedCategory(cat.key);
              setExpandedChakras(new Set());
              setAllExpanded(false);
            }}
            className={`p-3 rounded-lg font-medium transition-all flex flex-col items-center gap-2 ${
              selectedCategory === cat.key
                ? 'bg-emerald-600 text-white shadow-lg scale-105'
                : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <Icon name={cat.icon} size={24} />
            <span className="text-sm">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={toggleAll}
          className="px-4 py-2 bg-white border border-emerald-200 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-2 font-medium"
        >
          <Icon name={allExpanded ? 'ChevronsUp' : 'ChevronsDown'} size={18} />
          {allExpanded ? 'Свернуть всё' : 'Развернуть всё'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-emerald-100">
        <div className="divide-y divide-emerald-100">
          {chakras.map(chakra => {
            const isExpanded = expandedChakras.has(chakra.id);
            const items = getChakraItems(chakra, selectedCategory);
            
            return (
              <div key={chakra.id}>
                <button
                  onClick={() => toggleChakra(chakra.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-emerald-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: chakra.color }}
                    />
                    <span className="font-bold text-lg" style={{ color: chakra.color }}>
                      {chakra.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({items.length})
                    </span>
                  </div>
                  <Icon 
                    name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
                    size={20} 
                    className="text-emerald-600"
                  />
                </button>
                
                {isExpanded && (
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-purple-50">
                    {items.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <Icon name="Database" size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Нет данных для этой чакры</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-lg p-3 border-l-4 shadow-sm"
                            style={{ borderLeftColor: chakra.color }}
                          >
                            <div className="font-medium text-emerald-900 mb-1">
                              {getItemName(item, selectedCategory)}
                            </div>
                            
                            {item.description && (
                              <p className="text-gray-700 text-sm mb-2">
                                {item.description}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
                              {item.category && (
                                <div>
                                  Категория: <span className="font-medium">{item.category}</span>
                                </div>
                              )}
                              
                              {item.user_name && (
                                <div>
                                  Ответственный: <span className="font-medium">{item.user_name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChakraDataTable;
