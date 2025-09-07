import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  '/access-bars': [
    { label: 'Главная', href: '/' },
    { label: 'Access Bars' }
  ],
  '/healing': [
    { label: 'Главная', href: '/' },
    { label: 'Целительство' }
  ],
  '/massage': [
    { label: 'Главная', href: '/' },
    { label: 'Массаж' }
  ],
  '/training': [
    { label: 'Главная', href: '/' },
    { label: 'Обучение' }
  ],
  '/contacts': [
    { label: 'Главная', href: '/' },
    { label: 'Контакты' }
  ]
};

const Breadcrumbs = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Не показываем breadcrumbs на главной странице
  if (currentPath === '/') return null;
  
  const breadcrumbs = breadcrumbMap[currentPath];
  
  // Если нет маппинга для текущего пути, не показываем breadcrumbs
  if (!breadcrumbs) return null;

  return (
    <nav className="bg-white border-b" aria-label="Навигация">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                )}
                
                {item.href ? (
                  <Link
                    to={item.href}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    {index === 0 && <Home className="mr-1 h-4 w-4" />}
                    {item.label}
                  </Link>
                ) : (
                  <span className="flex items-center text-gray-700 font-medium">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;