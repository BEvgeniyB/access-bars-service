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
            <stop offset="0%" stopColor="#FFC107" />
            <stop offset="25%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#B8860B" />
            <stop offset="75%" stopColor="#FFE55C" />
            <stop offset="100%" stopColor="#DAA520" />
          </linearGradient>
          <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DAA520" />
            <stop offset="30%" stopColor="#FFE55C" />
            <stop offset="70%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
          <filter id="goldShine">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Ornamental border circle */}
        <circle
          cx="60"
          cy="60"
          r="58"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2"
          opacity="0.3"
        />
        
        {/* Inner decorative circle */}
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="url(#goldGradient2)"
          strokeWidth="1"
          opacity="0.2"
        />
        
        {/* Letter H (Н) */}
        <g filter="url(#goldShine)">
          <path
            d="M25 30 L25 90 M25 60 L45 60 M45 30 L45 90"
            stroke="url(#goldGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
        
        {/* Letter B (В) - decorative version */}
        <g filter="url(#goldShine)">
          <path
            d="M65 30 L65 90 M65 30 L85 30 Q95 30 95 40 Q95 50 85 50 L65 50 M65 50 L88 50 Q98 50 98 65 Q98 80 88 80 L85 80 M65 80 L85 80"
            stroke="url(#goldGradient2)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
        
        {/* Decorative flourishes */}
        <g opacity="0.6">
          {/* Top flourish */}
          <path
            d="M60 15 Q50 20 55 25 Q60 20 65 25 Q70 20 60 15"
            fill="url(#goldGradient)"
          />
          
          {/* Bottom flourish */}
          <path
            d="M60 105 Q50 100 55 95 Q60 100 65 95 Q70 100 60 105"
            fill="url(#goldGradient2)"
          />
          
          {/* Side flourishes */}
          <path
            d="M15 60 Q20 50 25 55 Q20 60 25 65 Q20 70 15 60"
            fill="url(#goldGradient)"
          />
          <path
            d="M105 60 Q100 50 95 55 Q100 60 95 65 Q100 70 105 60"
            fill="url(#goldGradient2)"
          />
        </g>
      </svg>
    </div>
  );
};

export default Monogram;