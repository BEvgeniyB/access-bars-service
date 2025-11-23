import { Chakra } from '@/types/chakra';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface ChakraFiltersProps {
  filter: string;
  onFilterChange: (value: string) => void;
  chakras: Chakra[];
}

const ChakraFilters = ({ filter, onFilterChange, chakras }: ChakraFiltersProps) => {
  const continents = [...new Set(chakras.map(ch => ch.continent).filter(Boolean))];

  return (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Filter" size={24} className="text-emerald-600" />
        <h2 className="text-xl font-bold text-emerald-900">Фильтры</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="search">Поиск по названию</Label>
          <Input
            id="search"
            type="text"
            placeholder="Введите название чакры..."
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="mt-1"
          />
        </div>

        {continents.length > 0 && (
          <div>
            <Label htmlFor="continent">Континент</Label>
            <select
              id="continent"
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Все континенты</option>
              {continents.map((continent) => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filter && (
        <button
          onClick={() => onFilterChange('')}
          className="mt-4 text-sm text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
        >
          <Icon name="X" size={16} />
          Сбросить фильтры
        </button>
      )}
    </div>
  );
};

export default ChakraFilters;
