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
        
        {/* Сердце из шнурка (как на картинке) */}
        <g>
          {/* Основной контур сердца - шнурок */}
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
          
          {/* Рельеф шнурка - диагональные полосы */}
          <g opacity="0.8" strokeWidth="0.8" stroke="url(#goldGradient)">
            {/* Левая часть сердца - диагональные линии шнурка */}
            <path d="M32 14 L30 16 M34 16 L32 18 M36 18 L34 20 M30 20 L28 22"/>
            <path d="M26 22 L24 24 M28 24 L26 26 M30 26 L28 28 M32 28 L30 30"/>
            <path d="M34 30 L32 32 M36 32 L34 34 M38 34 L36 36 M40 36 L38 38"/>
            <path d="M42 38 L40 40 M44 40 L42 42 M46 42 L44 44 M48 44 L46 46"/>
            
            {/* Правая часть сердца - диагональные линии шнурка */}
            <path d="M68 14 L70 16 M66 16 L68 18 M64 18 L66 20 M70 20 L72 22"/>
            <path d="M74 22 L76 24 M72 24 L74 26 M70 26 L72 28 M68 28 L70 30"/>
            <path d="M66 30 L68 32 M64 32 L66 34 M62 34 L64 36 M60 36 L62 38"/>
            <path d="M58 38 L60 40 M56 40 L58 42 M54 42 L56 44 M52 44 L54 46"/>
            
            {/* Нижняя часть сердца */}
            <path d="M48 48 L46 50 M50 50 L48 52 M52 52 L50 54"/>
          </g>
          
          {/* Дополнительный рельеф шнурка */}
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
          
          {/* Бант сверху сердца (точно как на картинке) */}
          <g transform="translate(50, 12)">
            {/* Центральный узел банта */}
            <ellipse cx="0" cy="0" rx="4" ry="2.5" 
                     fill="none" 
                     stroke="url(#goldGradient)" 
                     strokeWidth="1.5"/>
            
            {/* Левая петля банта */}
            <path d="M-4 -1 Q-8 -5, -10 -2 Q-8 1, -4 -1" 
                  fill="none" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="1.5"/>
            <path d="M-8 -4 L-6 -6 M-9 -2 L-7 -4" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="0.8" 
                  opacity="0.6"/>
                  
            {/* Правая петля банта */}
            <path d="M4 -1 Q8 -5, 10 -2 Q8 1, 4 -1" 
                  fill="none" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="1.5"/>
            <path d="M8 -4 L6 -6 M9 -2 L7 -4" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="0.8" 
                  opacity="0.6"/>
                  
            {/* Концы банта */}
            <path d="M-6 1 Q-7 4, -5 5" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="1"/>
            <path d="M6 1 Q7 4, 5 5" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="1"/>
          </g>
        </g>
        
        {/* Буквы VN каллиграфическим почерком (точно как на картинке) */}
        <g>
          {/* Буква V - точно как на картинке */}
          <path
            d="M32 24
               Q31.5 23, 32 22.5
               Q33 23.5, 34 26
               Q35.5 29, 37 31.5
               Q37.5 32.5, 38 32
               
               M44 24
               Q44.5 23, 44 22.5
               Q43 23.5, 42 26
               Q40.5 29, 39 31.5
               Q38.5 32.5, 38 32"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Буква N - каллиграфический стиль с картинки */}
          <path
            d="M55 24
               Q54.5 23, 55 22.5
               Q55.5 23.5, 55.5 26
               Q55.5 29, 55.5 31.5
               Q55.5 32.5, 56 32
               
               M55.5 22.8
               Q57 22.2, 58.5 23
               Q60.5 24.5, 62 26.5
               Q64 29, 65.5 31
               Q67 32.5, 68.5 33.5
               Q69.5 34, 70 33.5
               
               M68.5 24
               Q69 23, 68.5 22.5
               Q68 23.5, 68 26
               Q68 29, 68 31.5
               Q68 32.5, 68.5 32"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Декоративные завитки вокруг букв */}
          <path d="M32 23 Q30 21, 31 20 Q33 22, 32 23" 
                fill="url(#goldGradient)" opacity="0.8"/>
          <path d="M67 27 Q69 25, 68 24 Q66 26, 67 27" 
                fill="url(#goldGradient)" opacity="0.8"/>
        </g>
      </svg>
    </div>
  );
};

export default Monogram;