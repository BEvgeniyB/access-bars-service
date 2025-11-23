import { useState, useEffect } from 'react';
import NavigationMenu from '@/components/Index/NavigationMenu';
import Footer from '@/components/Index/Footer';
import ChakraBody from '@/components/structure/ChakraBody';
import ChakraModal from '@/components/structure/ChakraModal';
import ChakraFilters from '@/components/structure/ChakraFilters';
import { Chakra } from '@/types/chakra';

const Structure = () => {
  const [chakras, setChakras] = useState<Chakra[]>([]);
  const [selectedChakra, setSelectedChakra] = useState<Chakra | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    fetchChakras();
  }, []);

  const fetchChakras = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/802474e6-54c0-4040-a65f-71d604777df5');
      const data = await response.json();
      setChakras(data.chakras || []);
    } catch (error) {
      console.error('Error fetching chakras:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChakraDetail = async (id: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/802474e6-54c0-4040-a65f-71d604777df5?id=${id}`);
      const data = await response.json();
      setSelectedChakra(data.chakra);
    } catch (error) {
      console.error('Error fetching chakra detail:', error);
    }
  };

  const filteredChakras = filter 
    ? chakras.filter(ch => 
        ch.continent?.includes(filter) || 
        ch.name.includes(filter)
      )
    : chakras;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-purple-50">
      <NavigationMenu isMenuOpen={false} closeMenu={() => {}} />
      
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            Структура Мироздания
          </h1>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            Интерактивная схема 7 чакр и их влияние на различные аспекты жизни
          </p>
        </div>

        <ChakraFilters 
          filter={filter} 
          onFilterChange={setFilter} 
          chakras={chakras}
        />

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <ChakraBody 
            chakras={filteredChakras}
            onChakraClick={fetchChakraDetail}
          />
        )}

        {selectedChakra && (
          <ChakraModal 
            chakra={selectedChakra}
            onClose={() => setSelectedChakra(null)}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Structure;