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
      <img
        src="https://cdn.poehali.dev/files/392a056e-89c7-45bc-82b7-f17a766e3fc2.png"
        alt="Вензель НВ"
        className="w-full h-full object-contain filter drop-shadow-lg"
      />
    </div>
  );
};

export default Monogram;