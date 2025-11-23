import { Chakra } from '@/types/chakra';

interface ChakraBodyProps {
  chakras: Chakra[];
  onChakraClick: (id: number) => void;
}

const ChakraBody = ({ chakras, onChakraClick }: ChakraBodyProps) => {
  const getChakraPosition = (position: number) => {
    const positions = [
      { top: '52%', left: '50%' },  // 1 - цифра справа от красной звезды
      { top: '62%', left: '13%' },  // 2 - цифра слева от оранжевого круга
      { top: '84%', left: '23%' },  // 3 - цифра слева внизу от желтого цветка
      { top: '68%', left: '68%' },  // 4 - цифра справа от зеленого узора
      { top: '46%', left: '76%' },  // 5 - цифра справа от голубого узора
      { top: '25%', left: '61%' },  // 6 - цифра справа от синего ромба
      { top: '20%', left: '25%' },  // 7 - цифра слева вверху от фиолетовой спирали
    ];
    return positions[position - 1] || { top: '50%', left: '50%' };
  };

  const sortedChakras = [...chakras].sort((a, b) => a.position - b.position);

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="relative w-full" style={{ paddingBottom: '80%' }}>
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundImage: 'url(https://cdn.poehali.dev/files/afd33c78-1aed-4f66-b116-9d10298d0ec5.jpg)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />



        {sortedChakras.map((chakra) => {
          const pos = getChakraPosition(chakra.position);
          return (
            <button
              key={chakra.id}
              onClick={() => onChakraClick(chakra.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{
                top: pos.top,
                left: pos.left,
              }}
            >
              <div 
                className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125"
                style={{
                  backgroundColor: chakra.color,
                  boxShadow: `0 0 15px ${chakra.color}80, 0 0 30px ${chakra.color}40`,
                  animation: 'chakraGlow 3s ease-in-out infinite'
                }}
              >
                <span className="text-white text-sm font-bold z-10">
                  {chakra.position}
                </span>
              </div>
              
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-1 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium z-20">
                {chakra.name}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedChakras.map((chakra) => (
          <button
            key={chakra.id}
            onClick={() => onChakraClick(chakra.id)}
            className="flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg"
            style={{
              borderColor: chakra.color,
              backgroundColor: `${chakra.color}10`,
            }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0"
              style={{ backgroundColor: chakra.color }}
            >
              {chakra.position}
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg text-emerald-900">{chakra.name}</h3>
              {chakra.right_statement && (
                <p className="text-sm text-emerald-700 mt-1">{chakra.right_statement}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChakraBody;