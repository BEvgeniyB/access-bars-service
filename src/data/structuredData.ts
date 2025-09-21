// Структурированные данные для разных страниц
import { ALL_SERVICES } from './services';

export const businessStructuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Гармония энергий",
  "description": "Профессиональные услуги массажа, энергетического целительства и Access Bars в Москве",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Москва", 
    "addressCountry": "RU"
  },
  "telephone": "+7(918) 414-1221",
  "url": "https://velikaya-nataliya.ru",
  "priceRange": "6000-29000 RUB",
  "serviceArea": {
    "@type": "City",
    "name": "Москва"
  },
  "openingHours": "Mo-Su 12:00-22:00",
  "founder": {
    "@type": "Person",
    "name": "Наталья Великая",
    "jobTitle": "Сертифицированный специалист Access Bars, массажист, целитель"
  }
};

// Создаем полный список услуг для SEO из центрального источника
export const servicesStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Услуги Гармонии энергий",
  "description": "Полный спектр услуг массажа, Access Bars и энергетического целительства",
  "itemListElement": ALL_SERVICES.map(service => ({
    "@type": "Service",
    "name": service.name,
    "description": service.description || `${service.category} - ${service.duration}`,
    "category": service.category,
    "duration": service.duration,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Гармония энергий"
    },
    "offers": {
      "@type": "Offer",
      "price": service.price.replace(/[\s₽]/g, ''), // Убираем пробелы и символ рубля для числового значения
      "priceCurrency": "RUB"
    }
  }))
};

export const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Наталья Великая",
  "jobTitle": "Сертифицированный специалист Access Bars, массажист, целитель",
  "description": "Опытный специалист в области энергетических практик, массажа и целительства с многолетним опытом работы",
  "worksFor": {
    "@type": "LocalBusiness", 
    "name": "Гармония энергий"
  },
  "telephone": "+7(918) 414-1221",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Москва",
    "addressCountry": "RU"
  },
  "sameAs": [
    "https://www.instagram.com/velikaya_nataliya/",
    "https://vk.com/id71840974",
    "https://youtube.com/channel/UCZ_Ukxv92QcpaTUzIKKS4VA",
    "https://t.me/velikaya_nataliya"
  ]
};

export const breadcrumbStructuredData = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});