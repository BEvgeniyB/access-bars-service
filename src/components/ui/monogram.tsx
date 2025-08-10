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
        viewBox="0 0 150 120"
        className="w-full h-full filter drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="30%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#F4E4BC" />
          </linearGradient>
          <filter id="goldShine">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="rgba(212,175,55,0.3)"/>
          </filter>
        </defs>
        
        {/* Heart shape with rope-like decorative border */}
        <g filter="url(#goldShine)">
          {/* Main heart outline */}
          <path
            d="M75 30 
               C75 20, 60 15, 50 25
               C40 35, 40 50, 55 65
               L75 85
               L95 65
               C110 50, 110 35, 100 25
               C90 15, 75 20, 75 30 Z"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Rope/decorative pattern on heart border */}
          <path
            d="M75 30 
               C75 20, 60 15, 50 25
               C40 35, 40 50, 55 65
               L75 85
               L95 65
               C110 50, 110 35, 100 25
               C90 15, 75 20, 75 30 Z"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            strokeDasharray="2,1.5"
            opacity="0.7"
            strokeLinecap="round"
          />
          
          {/* Decorative cross-hatching pattern */}
          <g opacity="0.5">
            <path d="M52 28 L58 22 M56 32 L62 26 M60 36 L66 30" stroke="url(#goldGradient)" strokeWidth="0.8"/>
            <path d="M88 28 L94 22 M92 32 L98 26 M96 36 L102 30" stroke="url(#goldGradient)" strokeWidth="0.8"/>
            <path d="M50 45 L56 51 M54 49 L60 55" stroke="url(#goldGradient)" strokeWidth="0.8"/>
            <path d="M94 45 L100 51 M98 49 L104 55" stroke="url(#goldGradient)" strokeWidth="0.8"/>
          </g>
          
          {/* Bow/knot at the top center */}
          <g transform="translate(75, 25)">
            {/* Center knot */}
            <ellipse cx="0" cy="0" rx="6" ry="3" 
                     fill="none" 
                     stroke="url(#goldGradient)" 
                     strokeWidth="1.5"/>
            {/* Left bow loop */}
            <path d="M-6 -1 Q-12 -8, -15 -3 Q-12 2, -6 -1" 
                  fill="none" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="1.5"/>
            {/* Right bow loop */}
            <path d="M6 -1 Q12 -8, 15 -3 Q12 2, 6 -1" 
                  fill="none" 
                  stroke="url(#goldGradient)" 
                  strokeWidth="1.5"/>
            {/* Bow tails */}
            <path d="M-8 2 Q-10 6, -6 8" stroke="url(#goldGradient)" strokeWidth="1"/>
            <path d="M8 2 Q10 6, 6 8" stroke="url(#goldGradient)" strokeWidth="1"/>
          </g>
        </g>
        
        {/* Calligraphic letters НВ */}
        <g filter="url(#goldShine)">
          {/* Letter Н (H) - elegant script style */}
          <path
            d="M55 45 
               Q54 43, 56 44
               C56 47, 56 53, 56 58
               Q56 61, 58 59
               M56 52
               Q62 50, 68 52
               M68 45
               Q67 43, 69 44  
               C69 47, 69 53, 69 58
               Q69 61, 71 59"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Letter В (V/B) - flowing script style */}
          <path
            d="M80 45
               Q79 43, 81 44
               C81 47, 81 53, 81 58
               Q81 61, 83 59
               
               M81 45
               Q86 43, 90 45
               Q94 47, 92 50
               Q89 52, 85 51
               L81 51
               
               M81 51
               Q86 51, 91 53
               Q96 55, 94 58
               Q91 60, 86 59
               L81 58"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Decorative flourishes around letters */}
          <path
            d="M50 42 Q47 39, 49 37 Q52 40, 50 42"
            fill="url(#goldGradient)"
            opacity="0.8"
          />
          <path
            d="M100 48 Q103 45, 101 43 Q98 46, 100 48"
            fill="url(#goldGradient)"
            opacity="0.8"
          />
        </g>
      </svg>
    </div>
  );
};

export default Monogram;