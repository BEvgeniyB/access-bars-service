import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import StructureNavigationMenu from '@/components/structure/StructureNavigationMenu';
import Footer from '@/components/Index/Footer';
import ChakraBody from '@/components/structure/ChakraBody';
import ChakraModal from '@/components/structure/ChakraModal';
import ChakraDataTable from '@/components/structure/ChakraDataTable';

import { Chakra } from '@/types/chakra';

const Structure = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [chakras, setChakras] = useState<Chakra[]>([]);
  const [selectedChakra, setSelectedChakra] = useState<Chakra | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    fetchAllChakrasWithDetails();
  }, []);

  useEffect(() => {
    const chakraId = searchParams.get('chakra');
    const userId = searchParams.get('user');
    
    if (chakraId && chakras.length > 0) {
      const chakra = chakras.find(c => c.id === parseInt(chakraId));
      if (chakra) {
        setSelectedChakra(chakra);
        if (userId) {
          setSelectedUserId(parseInt(userId));
        }
      }
    }
  }, [searchParams, chakras]);

  const fetchAllChakrasWithDetails = async () => {
    const CACHE_KEY = 'chakras_full_details_cache';
    const CACHE_DURATION = 60 * 60 * 1000;
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        if (!isExpired && data?.length > 0) {
          console.log('Using cached chakras full data');
          setChakras(data);
          setLoading(false);
          return;
        }
      }
      
      const chakraIds = [1, 2, 3, 4, 5, 6, 7];
      const promises = chakraIds.map(id => 
        fetch(`https://functions.poehali.dev/802474e6-54c0-4040-a65f-71d604777df5?id=${id}`)
          .then(res => res.json())
          .then(data => data.chakra)
      );
      
      const allChakras = await Promise.all(promises);
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: allChakras,
        timestamp: Date.now()
      }));
      
      setChakras(allChakras.filter(Boolean));
    } catch (error) {
      console.error('Error fetching chakras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChakraClick = (id: number) => {
    const chakra = chakras.find(c => c.id === id);
    if (chakra) {
      setSelectedChakra(chakra);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-purple-50">
      <StructureNavigationMenu 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        closeMenu={() => setIsMenuOpen(false)}
        chakras={chakras}
        onChakraClick={handleChakraClick}
      />
      
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            Структура Мироздания
          </h1>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            Интерактивная схема 7 чакр и их влияние на различные аспекты жизни
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            <ChakraBody 
              chakras={chakras}
              onChakraClick={handleChakraClick}
            />
            
            <div className="mt-16">
              <ChakraDataTable chakras={chakras} />
            </div>
          </>
        )}

        {selectedChakra && (
          <ChakraModal 
            chakra={selectedChakra}
            onClose={() => {
              setSelectedChakra(null);
              setSelectedUserId(null);
              setSearchParams({});
            }}
            initialUserId={selectedUserId}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Structure;