import React from 'react';

interface MonogramProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Monogram: React.FC<MonogramProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full filter drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A961" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#F4E4BC" />
          </linearGradient>
          <filter id="goldShine">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Heart shape with decorative rope-like border */}
        <g filter="url(#goldShine)">
          <path
            d="M60 25 
               C60 15, 45 10, 35 20
               C25 30, 25 45, 40 55
               L60 75
               L80 55
               C95 45, 95 30, 85 20
               C75 10, 60 15, 60 25 Z"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Decorative rope pattern on heart border */}
          <path
            d="M60 25 
               C60 15, 45 10, 35 20
               C25 30, 25 45, 40 55
               L60 75
               L80 55
               C95 45, 95 30, 85 20
               C75 10, 60 15, 60 25 Z"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            strokeDasharray="3,2"
            opacity="0.8"
            strokeLinecap="round"
          />
          
          {/* Bow/knot at the top */}
          <g transform="translate(60, 20)">
            <ellipse cx="0" cy="0" rx="8" ry="4" 
                     fill="none" 
                     stroke="url(#goldGradient)" 
                     strokeWidth="2"/>
            <ellipse cx="-6" cy="-2" rx="4" ry="6" 
                     fill="none" 
                     stroke="url(#goldGradient)" 
                     strokeWidth="1.5"/>
            <ellipse cx="6" cy="-2" rx="4" ry="6" 
                     fill="none" 
                     stroke="url(#goldGradient)" 
                     strokeWidth="1.5"/>
          </g>
        </g>
        
        {/* Calligraphic НВ letters */}
        <g filter="url(#goldShine)">
          {/* Letter Н */}
          <path
            d="M35 40 
               Q33 38, 35 36
               L35 60
               Q35 62, 37 60
               L47 60
               Q49 60, 47 62
               L47 40
               Q47 38, 49 40"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M35 50 Q41 48, 47 50"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Letter В (calligraphic style) */}
          <path
            d="M65 40
               Q63 38, 65 36
               L65 60
               Q65 62, 67 60
               L78 60
               Q85 60, 85 53
               Q85 46, 78 46
               L65 46
               M65 46
               L75 46
               Q80 46, 80 42
               Q80 38, 75 38
               L65 38"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Decorative flourishes */}
          <path
            d="M30 38 Q25 35, 28 32 Q32 35, 30 38"
            fill="url(#goldGradient)"
            opacity="0.7"
          />
          <path
            d="M90 42 Q95 39, 92 36 Q88 39, 90 42"
            fill="url(#goldGradient)"
            opacity="0.7"
          />
        </g>
      </svg>
    </div>
  );
};

export default Monogram;