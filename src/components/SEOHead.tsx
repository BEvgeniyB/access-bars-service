import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

const SEOHead = ({
  title = "Гармония энергий - Массаж, Access Bars, Целительство в Краснодаре",
  description = "Профессиональные услуги массажа, Access Bars, энергетического целительства и обучения в Краснодаре. Наталья Великая - сертифицированный специалист. Записаться: +7(918) 414-1221",
  keywords = "массаж Краснодар, Access Bars, энергетическое целительство, духовные практики, массаж спины, расслабляющий массаж, Наталья Великая",
  image = "https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg",
  url = "https://harmony-energies.ru",
  type = "website",
  structuredData
}: SEOHeadProps) => {
  const fullTitle = title.includes("Гармония энергий") ? title : `${title} | Гармония энергий`;

  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Наталья Великая" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />

      {/* Open Graph теги для социальных сетей */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content="Гармония энергий" />

      {/* Twitter Card теги */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Дополнительные SEO теги */}
      <meta name="geo.region" content="RU-KDA" />
      <meta name="geo.placename" content="Краснодар" />
      <meta name="geo.position" content="45.035470;38.975313" />
      <meta name="ICBM" content="45.035470, 38.975313" />

      {/* Структурированные данные */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Языковые альтернативы */}
      <link rel="alternate" hrefLang="ru" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
    </Helmet>
  );
};

export default SEOHead;