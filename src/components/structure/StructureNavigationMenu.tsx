import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Chakra } from '@/types/chakra';

interface StructureNavigationMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  closeMenu: () => void;
  chakras: Chakra[];
  onChakraClick: (id: number) => void;
}

const StructureNavigationMenu = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  closeMenu, 
  chakras,
  onChakraClick 
}: StructureNavigationMenuProps) => {
  const getChakraColor = (position: number) => {
    const colorMap: { [key: number]: string } = {
      1: '#E31E24',
      2: '#FF6B00',
      3: '#FFD700',
      4: '#00A86B',
      5: '#00BFFF',
      6: '#0066CC',
      7: '#9370DB'
    };
    return colorMap[position] || '#000';
  };

  const sortedChakras = [...chakras].sort((a, b) => a.position - b.position);

  return (
    <div className="fixed top-20 sm:top-22 md:top-24 right-2 md:right-4 z-40">
      <div className="group">
        <Button 
          className="bg-black/80 border-2 border-gold-400/50 text-gold-400 hover:bg-gold-400/10 shadow-xl text-xs md:text-sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Icon name="Menu" size={16} />
          <span className="ml-1 md:ml-2 hidden sm:inline">Разделы</span>
        </Button>
        
        <div className={`${isMenuOpen ? 'block' : 'hidden'} absolute top-12 right-0 w-64 bg-black/95 border-2 border-gold-400/50 rounded-lg shadow-2xl overflow-hidden z-50`}>
          <div className="p-2 space-y-1">
            <a 
              href="/"
              className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
              onClick={closeMenu}
            >
              <Icon name="Home" size={16} />
              Главная
            </a>
            
            <div className="border-t border-gold-400/30 my-2"></div>
            
            {sortedChakras.map((chakra) => (
              <button
                key={chakra.id}
                className="w-full text-left px-4 py-3 text-gold-200 hover:bg-gold-400/20 hover:text-gold-400 transition-colors rounded flex items-center gap-3"
                onClick={() => {
                  onChakraClick(chakra.id);
                  closeMenu();
                }}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: getChakraColor(chakra.position) }}
                >
                  {chakra.position}
                </div>
                <span className="truncate">{chakra.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructureNavigationMenu;
