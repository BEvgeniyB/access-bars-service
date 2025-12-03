import { useState } from 'react';
import { Chakra } from '@/types/chakra';
import Icon from '@/components/ui/icon';

interface ChakraDataTableProps {
  chakras: Chakra[];
}

type Category = 'concepts' | 'organs' | 'sciences' | 'responsibilities' | 'basic_needs';

const ChakraDataTable = ({ chakras }: ChakraDataTableProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('concepts');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const categories = [
    { key: 'concepts' as Category, label: 'Концепции', icon: 'Lightbulb' },
    { key: 'organs' as Category, label: 'Органы', icon: 'Heart' },
    { key: 'sciences' as Category, label: 'Науки', icon: 'BookOpen' },
    { key: 'responsibilities' as Category, label: 'Ответственности', icon: 'Shield' },
    { key: 'basic_needs' as Category, label: 'Базовые потребности', icon: 'Flame' },
  ];

  const getAllUniqueItems = (category: Category): string[] => {
    const itemsSet = new Set<string>();
    
    chakras.forEach(chakra => {
      const items = chakra[category] || [];
      items.forEach((item: any) => {
        if (category === 'concepts') itemsSet.add(item.concept);
        else if (category === 'organs') itemsSet.add(item.organ_name);
        else if (category === 'sciences') itemsSet.add(item.science_name);
        else if (category === 'responsibilities') itemsSet.add(item.responsibility);
        else if (category === 'basic_needs') itemsSet.add(item.basic_need);
      });
    });
    
    return Array.from(itemsSet).sort();
  };

  const getChakraValue = (chakra: Chakra, category: Category, itemName: string): any => {
    const items = chakra[category] || [];
    return items.find((item: any) => {
      if (category === 'concepts') return item.concept === itemName;
      if (category === 'organs') return item.organ_name === itemName;
      if (category === 'sciences') return item.science_name === itemName;
      if (category === 'responsibilities') return item.responsibility === itemName;
      if (category === 'basic_needs') return item.basic_need === itemName;
      return false;
    });
  };

  const uniqueItems = getAllUniqueItems(selectedCategory);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-emerald-900 mb-2">
          Таблица связей чакр
        </h2>
        <p className="text-emerald-700">
          Выберите категорию и элемент для просмотра связей с чакрами
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => {
              setSelectedCategory(cat.key);
              setExpandedItem(null);
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

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-emerald-100">
        {uniqueItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Icon name="Database" size={48} className="mx-auto mb-3 opacity-30" />
            <p>Нет данных для выбранной категории</p>
          </div>
        ) : (
          <div className="divide-y divide-emerald-100">
            {uniqueItems.map(item => {
              const isExpanded = expandedItem === item;
              
              return (
                <div key={item}>
                  <button
                    onClick={() => setExpandedItem(isExpanded ? null : item)}
                    className="w-full p-4 flex items-center justify-between hover:bg-emerald-50 transition-colors text-left"
                  >
                    <span className="font-medium text-emerald-900">{item}</span>
                    <Icon 
                      name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
                      size={20} 
                      className="text-emerald-600"
                    />
                  </button>
                  
                  {isExpanded && (
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-purple-50 space-y-3">
                      {chakras.map(chakra => {
                        const value = getChakraValue(chakra, selectedCategory, item);
                        
                        if (!value) return null;
                        
                        return (
                          <div
                            key={chakra.id}
                            className="bg-white rounded-lg p-4 border-l-4 shadow-sm"
                            style={{ borderLeftColor: chakra.color }}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: chakra.color }}
                              />
                              <h4 className="font-bold text-lg" style={{ color: chakra.color }}>
                                {chakra.name}
                              </h4>
                            </div>
                            
                            {value.description && (
                              <p className="text-gray-700 text-sm mb-2">
                                {value.description}
                              </p>
                            )}
                            
                            {value.category && (
                              <div className="text-xs text-gray-500 mt-2">
                                Категория: <span className="font-medium">{value.category}</span>
                              </div>
                            )}
                            
                            {value.user_name && (
                              <div className="text-xs text-gray-500 mt-1">
                                Ответственный: <span className="font-medium">{value.user_name}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChakraDataTable;
