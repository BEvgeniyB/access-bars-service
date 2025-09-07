import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  variant?: 'main' | 'secondary';
  className?: string;
}

const Navigation = ({ variant = 'secondary', className = '' }: NavigationProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navigationItems = [
    { path: '/', label: 'Главная' },
    { path: '/access-bars', label: 'Access Bars' },
    { path: '/training', label: 'Обучение' },
    { path: '/massage', label: 'Массаж' },
    { path: '/healing', label: 'Целительство' },
    { path: '/contacts', label: 'Контакты' }
  ];

  const getNavItemClassName = (path: string) => {
    const isActive = currentPath === path;
    const baseClasses = "transition-colors font-medium text-xs sm:text-sm md:text-base";
    
    if (variant === 'main') {
      return `${baseClasses} ${
        isActive 
          ? 'text-gold-400 border-b-2 border-gold-400 pb-1' 
          : 'text-gold-200 hover:text-gold-400'
      }`;
    }
    
    // Secondary variant (for other pages)
    return `${baseClasses} ${
      isActive 
        ? 'text-gold-400 font-bold border-b-2 border-gold-400 pb-1' 
        : 'text-gold-200 hover:text-gold-400'
    }`;
  };

  if (variant === 'main') {
    // Navigation for main page
    return (
      <nav className={`flex justify-center items-center py-2 md:py-4 ${className}`}>
        <div className="flex gap-2 sm:gap-4 md:gap-8 items-center flex-wrap justify-center">
          {navigationItems.slice(1).map((item) => ( // Skip home on main page
            <Link
              key={item.path}
              to={item.path}
              className={getNavItemClassName(item.path)}
            >
              {item.label}
            </Link>
          ))}
          <a href="#about" className="text-gold-200 hover:text-gold-400 transition-colors font-medium text-xs sm:text-sm md:text-base hidden sm:block">Обо мне</a>
        </div>
      </nav>
    );
  }

  // Secondary navigation for other pages
  return (
    <>
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="text-center mb-3">
          <h1 className="font-montserrat font-bold text-xl text-gold-400">Гармония энергий</h1>
        </div>
        <nav className="flex justify-center gap-4 text-xs">
          {navigationItems.slice(0, 5).map((item) => ( // Show first 5 items on mobile
            <Link
              key={item.path}
              to={item.path}
              className={getNavItemClassName(item.path)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Desktop Layout */}
      <nav className="hidden md:flex justify-between items-center">
        <h1 className="font-montserrat font-bold text-xl md:text-2xl text-gold-400">Гармония энергий</h1>
        <div className="flex gap-2 sm:gap-4 md:gap-6 items-center">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${getNavItemClassName(item.path)} ${
                item.path !== '/' && item.path !== '/contacts' ? '' : 'hidden sm:block'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;