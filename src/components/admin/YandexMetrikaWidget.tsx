import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const COUNTER_ID = 104236315;

export default function YandexMetrikaWidget() {
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
            <Icon name="Activity" size={20} />
            Счетчик посещений (в реальном времени)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <a 
              href={`https://metrika.yandex.ru/stat/general/graph?id=${COUNTER_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Яндекс.Метрика"
            >
              <img 
                src={`https://informer.yandex.ru/informer/${COUNTER_ID}/3_1_FFFFFFFF_EFEFEFFF_0_pageviews`}
                style={{ width: '88px', height: '31px', border: '0' }} 
                alt="Яндекс.Метрика" 
                title="Яндекс.Метрика: данные за сегодня (просмотры, визиты и уникальные посетители)"
                className="hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Просмотры страниц за сегодня (обновляется автоматически)
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
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
              className="text-lg font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              Смотреть в Метрике
              <Icon name="ExternalLink" size={14} />
            </a>
            <p className="text-xs text-gray-500 mt-2">Детальная статистика просмотров</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
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
              className="text-lg font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              Смотреть в Метрике
              <Icon name="ExternalLink" size={14} />
            </a>
            <p className="text-xs text-gray-500 mt-2">Уникальные посетители</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
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
              className="text-lg font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              Смотреть в Метрике
              <Icon name="ExternalLink" size={14} />
            </a>
            <p className="text-xs text-gray-500 mt-2">Откуда приходят посетители</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Icon name="BarChart" size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Полная аналитика в Яндекс Метрике</h3>
              <p className="text-sm text-gray-700 mb-4">
                Графики посещений, карты кликов, источники трафика, поведение пользователей и многое другое
              </p>
              <a 
                href={`https://metrika.yandex.ru/dashboard?id=${COUNTER_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
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
