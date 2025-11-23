import { Chakra } from '@/types/chakra';

interface ChakraBodyProps {
  chakras: Chakra[];
  onChakraClick: (id: number) => void;
}

const ChakraBody = ({ chakras, onChakraClick }: ChakraBodyProps) => {
  const getChakraColor = (chakra: Chakra) => {
    const colorMap: { [key: number]: string } = {
      1: '#E31E24',    // Красный
      2: '#FF6B00',    // Оранжевый
      3: '#FFD700',    // Жёлтый
      4: 'linear-gradient(90deg, #00A86B 50%, #FF69B4 50%)',  // Зелёный + Розовый
      5: '#00BFFF',    // Голубой
      6: '#0066CC',    // Синий
      7: '#9370DB'     // Фиолетовый/Сиреневый
    };
    return colorMap[chakra.position] || chakra.color;
  };

  const getChakraPosition = (position: number) => {
    const positions = [
      { top: '50%', left: '38%' },  // 1 - красная звезда (центр слева)
      { top: '58%', left: '11%' },  // 2 - оранжевый круг (сдвинут влево на 25мм)
      { top: '95%', left: '28%' },  // 3 - желтый цветок (сдвинут влево на 25мм)
      { top: '70%', left: '58%' },  // 4 - зеленый узор (сдвинуто вправо на 20мм)
      { top: '42%', left: '61%' },  // 5 - голубой узор (сдвинуто вправо на 20мм)
      { top: '22%', left: '47%' },  // 6 - синий ромб (ещё больше влево)
      { top: '10%', left: '21%' },  // 7 - фиолетовая спираль (сдвинут влево на 25мм)
    ];
    return positions[position - 1] || { top: '50%', left: '50%' };
  };

  const sortedChakras = [...chakras].sort((a, b) => a.position - b.position);

  return (
    <div className="relative mx-auto max-w-7xl px-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Картинка с кружочками */}
        <div className="relative flex-shrink-0" style={{ width: '350px', height: '400px', maxWidth: '100%' }}>
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(https://cdn.poehali.dev/files/0e47ddda-7133-432f-9630-16d49f6961db.jpg)',
              backgroundSize: 'cover',
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
                    background: getChakraColor(chakra),
                    boxShadow: chakra.position === 4 
                      ? '0 0 15px #00A86B80, 0 0 30px #FF69B440' 
                      : `0 0 15px ${getChakraColor(chakra)}80, 0 0 30px ${getChakraColor(chakra)}40`,
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

        {/* Кнопки справа */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedChakras.map((chakra) => (
            <button
              key={chakra.id}
              onClick={() => onChakraClick(chakra.id)}
              className="flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg"
              style={{
                borderColor: chakra.position === 4 ? '#00A86B' : getChakraColor(chakra),
                backgroundColor: chakra.position === 4 ? '#00A86B10' : `${getChakraColor(chakra)}10`,
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                style={{ background: getChakraColor(chakra) }}
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
    </div>
  );
};

export default ChakraBody;