import React from 'react';

interface MonogramProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Monogram: React.FC<MonogramProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 100 80"
        className="w-full h-full filter drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>
        
        {/* Сердце из шнурка */}
        <g>
          {/* Основной контур сердца */}
          <path
            d="M50 15
               C50 10, 40 5, 30 12
               C20 19, 20 30, 35 42
               L50 58
               L65 42
               C80 30, 80 19, 70 12
               C60 5, 50 10, 50 15 Z"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Рельеф шнурка */}
          <g opacity="0.8" strokeWidth="0.8" stroke="url(#goldGradient)">
            <path d="M32 14 L30 16 M34 16 L32 18 M36 18 L34 20 M30 20 L28 22"/>
            <path d="M26 22 L24 24 M28 24 L26 26 M30 26 L28 28 M32 28 L30 30"/>
            <path d="M34 30 L32 32 M36 32 L34 34 M38 34 L36 36 M40 36 L38 38"/>
            <path d="M68 14 L70 16 M66 16 L68 18 M64 18 L66 20 M70 20 L72 22"/>
            <path d="M74 22 L76 24 M72 24 L74 26 M70 26 L72 28 M68 28 L70 30"/>
            <path d="M66 30 L68 32 M64 32 L66 34 M62 34 L64 36 M60 36 L62 38"/>
          </g>
          
          {/* Дополнительный рельеф */}
          <path
            d="M50 15
               C50 10, 40 5, 30 12
               C20 19, 20 30, 35 42
               L50 58
               L65 42
               C80 30, 80 19, 70 12
               C60 5, 50 10, 50 15 Z"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            strokeDasharray="2,1"
            opacity="0.6"
          />
        </g>
        
        {/* Бант сверху */}
        <g transform="translate(50, 12)">
          <ellipse cx="0" cy="0" rx="4" ry="2.5" 
                   fill="none" 
                   stroke="url(#goldGradient)" 
                   strokeWidth="1.5"/>
          <path d="M-4 -1 Q-8 -5, -10 -2 Q-8 1, -4 -1" 
                fill="none" 
                stroke="url(#goldGradient)" 
                strokeWidth="1.5"/>
          <path d="M4 -1 Q8 -5, 10 -2 Q8 1, 4 -1" 
                fill="none" 
                stroke="url(#goldGradient)" 
                strokeWidth="1.5"/>
        </g>
        
        {/* Буквы VN в готическом стиле - расположены ниже */}
        <g transform="translate(0, 12)">
          {/* Буква V - готический стиль */}
          <g>
            <path
              d="M35 30
                 L35 28
                 Q35 27, 36 27
                 L38 37
                 Q39 39, 40 39
                 Q41 39, 42 37
                 L44 27
                 Q45 27, 45 28
                 L45 30
                 Q45 31, 44 31
                 L42 41
                 Q41 43, 40 43
                 Q39 43, 38 41
                 L36 31
                 Q35 31, 35 30 Z"
              fill="url(#goldGradient)"
              stroke="url(#goldGradient)"
              strokeWidth="0.3"
            />
            
            {/* Готические засечки для V */}
            <rect x="34" y="27" width="3" height="1" fill="url(#goldGradient)"/>
            <rect x="43" y="27" width="3" height="1" fill="url(#goldGradient)"/>
            <rect x="38.5" y="43" width="3" height="1" fill="url(#goldGradient)"/>
          </g>
          
          {/* Буква N - готический стиль */}
          <g>
            <path
              d="M54 30
                 L54 28
                 Q54 27, 55 27
                 L55 41
                 Q55 42, 56 42
                 L58 30
                 Q59 28, 60 28
                 Q61 28, 62 30
                 L62 41
                 Q62 42, 63 42
                 L63 28
                 Q63 27, 64 27
                 L64 30
                 Q64 31, 63 31
                 L63 43
                 Q63 44, 62 44
                 L55 44
                 Q54 44, 54 43
                 L54 31
                 Q54 31, 54 30 Z"
              fill="url(#goldGradient)"
              stroke="url(#goldGradient)"
              strokeWidth="0.3"
            />
            
            {/* Готические засечки для N */}
            <rect x="53" y="27" width="3" height="1" fill="url(#goldGradient)"/>
            <rect x="62" y="27" width="3" height="1" fill="url(#goldGradient)"/>
            <rect x="53" y="44" width="3" height="1" fill="url(#goldGradient)"/>
            <rect x="62" y="44" width="3" height="1" fill="url(#goldGradient)"/>
          </g>
          
          {/* Готические декоративные элементы */}
          <g opacity="0.9">
            {/* Декоративные ромбы */}
            <path d="M32 33 L33 32 L34 33 L33 34 Z" fill="url(#goldGradient)"/>
            <path d="M46 33 L47 32 L48 33 L47 34 Z" fill="url(#goldGradient)"/>
            <path d="M51 36 L52 35 L53 36 L52 37 Z" fill="url(#goldGradient)"/>
            <path d="M65 36 L66 35 L67 36 L66 37 Z" fill="url(#goldGradient)"/>
            
            {/* Готические завитки */}
            <path d="M31 31 Q29 29, 30 27 Q32 29, 31 31" fill="url(#goldGradient)"/>
            <path d="M68 39 Q70 37, 69 35 Q67 37, 68 39" fill="url(#goldGradient)"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Monogram;