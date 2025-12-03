import { useState, useEffect } from 'react';
import NavigationMenu from '@/components/Index/NavigationMenu';
import Footer from '@/components/Index/Footer';
import ChakraBody from '@/components/structure/ChakraBody';
import ChakraModal from '@/components/structure/ChakraModal';

import { Chakra } from '@/types/chakra';

const Structure = () => {
  const [chakras, setChakras] = useState<Chakra[]>([]);
  const [selectedChakra, setSelectedChakra] = useState<Chakra | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  useEffect(() => {
    fetchChakras();
  }, []);

  const fetchChakras = async () => {
    const CACHE_KEY = 'chakras_list_cache';
    const CACHE_DURATION = 60 * 60 * 1000;
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;
        
        if (!isExpired && data?.chakras) {
          console.log('Using cached chakras data');
          setChakras(data.chakras);
          setLoading(false);
          return;
        }
      }
      
      const response = await fetch('https://functions.poehali.dev/802474e6-54c0-4040-a65f-71d604777df5');
      const data = await response.json();
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      setChakras(data.chakras || []);
    } catch (error) {
      console.error('Error fetching chakras:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChakraDetail = async (id: number) => {
    try {
      console.log('Fetching chakra detail for id:', id);
      const response = await fetch(`https://functions.poehali.dev/802474e6-54c0-4040-a65f-71d604777df5?id=${id}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return;
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (data.chakra) {
        setSelectedChakra(data.chakra);
      } else {
        console.error('No chakra data in response');
      }
    } catch (error) {
      console.error('Error fetching chakra detail:', error);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-purple-50">
      <NavigationMenu 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        closeMenu={() => setIsMenuOpen(false)} 
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
          <ChakraBody 
            chakras={chakras}
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