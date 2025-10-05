import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const COUNTER_ID = 104236315;

export default function YandexMetrikaWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.src = `https://informer.yandex.ru/metrika/${COUNTER_ID}/3_1_FFFFFFFF_EFEFEFFF_0_pageviews`;
    
    if (widgetRef.current) {
      widgetRef.current.appendChild(script);
    }

    return () => {
      if (widgetRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="BarChart3" size={28} className="text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Статистика посещений</h2>
          <p className="text-sm text-gray-600">Данные из Яндекс Метрики</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="TrendingUp" size={20} />
            Посещаемость сайта
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={widgetRef} className="min-h-[200px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-2" />
              <p>Загрузка виджета...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Icon name="Eye" size={16} />
              Просмотры страниц
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href={`https://metrika.yandex.ru/dashboard?id=${COUNTER_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              Подробнее
              <Icon name="ExternalLink" size={16} />
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Icon name="Users" size={16} />
              Посетители
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href={`https://metrika.yandex.ru/dashboard?id=${COUNTER_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              Подробнее
              <Icon name="ExternalLink" size={16} />
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Icon name="Globe" size={16} />
              География
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href={`https://metrika.yandex.ru/dashboard?id=${COUNTER_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              Подробнее
              <Icon name="ExternalLink" size={16} />
            </a>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon name="Info" size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Как посмотреть полную статистику</h3>
              <p className="text-sm text-gray-700 mb-3">
                Для просмотра детальной аналитики перейдите в личный кабинет Яндекс Метрики:
              </p>
              <a 
                href={`https://metrika.yandex.ru/dashboard?id=${COUNTER_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Icon name="ExternalLink" size={16} />
                Открыть Яндекс Метрику
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
