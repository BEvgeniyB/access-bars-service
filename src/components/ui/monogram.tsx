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
      <div className="w-full h-full relative overflow-hidden">
        <img
          src="https://cdn.poehali.dev/files/392a056e-89c7-45bc-82b7-f17a766e3fc2.png"
          alt="Вензель НВ"
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            filter: 'sepia(100%) saturate(200%) hue-rotate(35deg) brightness(1.2) contrast(1.1) drop-shadow(2px 2px 4px rgba(212,175,55,0.3))',
            clipPath: 'inset(25% 10% 40% 10%)'
          }}
        />
      </div>
    </div>
  );
};

export default Monogram;