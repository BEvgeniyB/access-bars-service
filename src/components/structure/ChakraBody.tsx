import { Chakra } from '@/types/chakra';

interface ChakraBodyProps {
  chakras: Chakra[];
  onChakraClick: (id: number) => void;
}

const ChakraBody = ({ chakras, onChakraClick }: ChakraBodyProps) => {
  const getChakraPosition = (position: number) => {
    const positions = [
      { top: '85%', left: '50%' },
      { top: '72%', left: '50%' },
      { top: '58%', left: '50%' },
      { top: '44%', left: '50%' },
      { top: '30%', left: '50%' },
      { top: '16%', left: '50%' },
      { top: '2%', left: '50%' },
    ];
    return positions[position - 1] || { top: '50%', left: '50%' };
  };

  const sortedChakras = [...chakras].sort((a, b) => a.position - b.position);

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="relative w-full" style={{ paddingBottom: '150%' }}>
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-10"
          style={{
            backgroundImage: 'url(https://cdn.poehali.dev/files/32f04697-7984-4cb1-8706-5959678bd08d.jpg)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />

        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 600"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
        >
          <ellipse cx="200" cy="100" rx="45" ry="60" fill="#E8F5E9" opacity="0.3" />
          
          <ellipse cx="200" cy="200" rx="60" ry="80" fill="#E8F5E9" opacity="0.3" />
          
          <ellipse cx="200" cy="320" rx="55" ry="75" fill="#E8F5E9" opacity="0.3" />
          
          <ellipse cx="150" cy="410" rx="25" ry="90" fill="#E8F5E9" opacity="0.3" />
          <ellipse cx="250" cy="410" rx="25" ry="90" fill="#E8F5E9" opacity="0.3" />
          
          <line x1="200" y1="150" x2="200" y2="500" stroke="#10B981" strokeWidth="2" opacity="0.2" strokeDasharray="5,5" />
        </svg>

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
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125 animate-pulse"
                style={{
                  backgroundColor: chakra.color,
                  boxShadow: `0 0 20px ${chakra.color}80, 0 0 40px ${chakra.color}40`,
                }}
              >
                <div className="absolute inset-0 rounded-full border-2 border-white opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <span className="text-white text-xs md:text-sm font-bold z-10">
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
