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
        
        {/* Сердце с декоративной штриховкой как на картинке */}
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
            strokeWidth="2"
          />
          
          {/* Декоративная штриховка по контуру сердца (как на картинке) */}
          <g opacity="0.7">
            {/* Левая сторона сердца */}
            <path d="M32 14 L28 18 M30 16 L26 20 M28 18 L24 22" 
                  stroke="url(#goldGradient)" strokeWidth="1"/>
            <path d="M25 25 L21 29 M23 27 L19 31 M21 29 L17 33" 
                  stroke="url(#goldGradient)" strokeWidth="1"/>
            <path d="M30 35 L26 39 M28 37 L24 41" 
                  stroke="url(#goldGradient)" strokeWidth="1"/>
                  
            {/* Правая сторона сердца */}
            <path d="M68 14 L72 18 M70 16 L74 20 M72 18 L76 22" 
                  stroke="url(#goldGradient)" strokeWidth="1"/>
            <path d="M75 25 L79 29 M77 27 L81 31 M79 29 L83 33" 
                  stroke="url(#goldGradient)" strokeWidth="1"/>
            <path d="M70 35 L74 39 M72 37 L76 41" 
                  stroke="url(#goldGradient)" strokeWidth="1"/>
                  
            {/* Нижняя часть сердца */}
            <path d="M45 45 L41 49 M43 47 L39 51" 
                  stroke="url(#goldGradient)" strokeWidth="1"/>
            <path d="M55 45 L59 49 M57 47 L61 51" 
                  stroke="url(#goldGradient)" strokeWidth="1"/>
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
          {/* Буква V - элегантная каллиграфия */}
          <path
            d="M30 23
               Q29 22, 30 21
               C32 24, 34 28, 36 32
               Q37 34, 38 33
               
               M46 23
               Q45 22, 46 21
               C44 24, 42 28, 40 32
               Q39 34, 38 33"
            stroke="url(#goldGradient)"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Буква N - каллиграфическая с завитками */}
          <path
            d="M54 23
               Q53 22, 54 21
               C54 24, 54 28, 54 32
               Q54 34, 55 33
               
               M54 22
               Q56 21, 58 22
               C60 24, 62 26, 64 28
               C66 30, 68 32, 70 34
               Q71 35, 72 34
               
               M70 23
               Q69 22, 70 21
               C70 24, 70 28, 70 32
               Q70 34, 71 33"
            stroke="url(#goldGradient)"
            strokeWidth="2.8"
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