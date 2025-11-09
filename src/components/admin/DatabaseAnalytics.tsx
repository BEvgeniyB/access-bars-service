import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  period_days: number;
  total_visits: number;
  unique_visitors: number;
  top_pages: Array<{ page_url: string; visits: number }>;
  daily_stats: Array<{ visit_date: string; visits: number }>;
  top_referrers: Array<{ referrer: string; visits: number }>;
}

export default function DatabaseAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(7);
  const [trackingEnabled, setTrackingEnabled] = useState(() => {
    return localStorage.getItem('analytics_tracking_enabled') !== 'false';
  });

  const fetchAnalytics = async (days: number) => {
    try {
      setLoading(true);
      const response = await fetch(`https://functions.poehali.dev/7cba2a8f-846d-42ad-8f44-ae289488325a?endpoint=analytics&days=${days}`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      
      const data = await response.json();
      setAnalyticsData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const handleTrackingToggle = (enabled: boolean) => {
    setTrackingEnabled(enabled);
    localStorage.setItem('analytics_tracking_enabled', enabled.toString());
    
    if (enabled) {
      console.log('📊 Запись статистики в БД включена');
    } else {
      console.log('🚫 Запись статистики в БД отключена');
    }
  };

  const formatPageName = (url: string) => {
    const pageNames: Record<string, string> = {
      '/': 'Главная',
      '/access-bars': 'Access Bars',
      '/training': 'Обучение',
      '/healing': 'Целительство',
      '/massage': 'Массаж',
      '/analytics': 'Аналитика'
    };
    return pageNames[url] || url;
  };

  const formatReferrer = (referrer: string) => {
    if (!referrer) return 'Прямые заходы';
    try {
      const url = new URL(referrer);
      return url.hostname;
    } catch {
      return referrer;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">Ошибка: {error}</div>
        <Button onClick={() => fetchAnalytics(period)}>
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon name="Database" size={28} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Статистика из базы данных</h2>
            <p className="text-sm text-gray-600">Детальная аналитика посещений сайта</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border">
          <Switch
            id="tracking-mode"
            checked={trackingEnabled}
            onCheckedChange={handleTrackingToggle}
          />
          <Label htmlFor="tracking-mode" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <Icon name={trackingEnabled ? "Database" : "DatabaseZap"} size={16} />
              <span className="font-medium">
                {trackingEnabled ? 'Запись включена' : 'Запись отключена'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {trackingEnabled ? 'Статистика сохраняется в БД' : 'Только Яндекс Метрика'}
            </p>
          </Label>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="inline-flex gap-2 bg-gray-100 p-1 rounded-lg">
          {[7, 30, 90].map((days) => (
            <Button
              key={days}
              onClick={() => setPeriod(days)}
              variant={period === days ? "default" : "ghost"}
              size="sm"
            >
              {days} дней
            </Button>
          ))}
        </div>
      </div>

      {analyticsData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Всего посещений
                </CardTitle>
                <Icon name="Eye" className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analyticsData.total_visits}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  За последние {analyticsData.period_days} дней
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Уникальные посетители
                </CardTitle>
                <Icon name="Users" className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analyticsData.unique_visitors}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Разные IP-адреса
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Среднее в день
                </CardTitle>
                <Icon name="TrendingUp" className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(analyticsData.total_visits / analyticsData.period_days)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Посещений в день
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Star" size={20} />
                Популярные страницы
              </CardTitle>
              <CardDescription>
                Самые посещаемые разделы сайта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.top_pages.slice(0, 5).map((page, index) => (
                  <div key={page.page_url} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">
                        {formatPageName(page.page_url)}
                      </span>
                    </div>
                    <span className="text-blue-600 font-bold">
                      {page.visits}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="ExternalLink" size={20} />
                Источники трафика
              </CardTitle>
              <CardDescription>
                Откуда приходят посетители
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.top_referrers.slice(0, 5).map((referrer) => (
                  <div key={referrer.referrer} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon name="Globe" className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">
                        {formatReferrer(referrer.referrer)}
                      </span>
                    </div>
                    <span className="text-blue-600 font-bold">
                      {referrer.visits}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Calendar" size={20} />
                Статистика по дням
              </CardTitle>
              <CardDescription>
                Активность посетителей по дням
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.daily_stats.slice(-7).map((day) => (
                  <div key={day.visit_date} className="flex items-center justify-between py-2">
                    <span className="text-gray-700">
                      {new Date(day.visit_date).toLocaleDateString('ru-RU', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-2 bg-blue-600 rounded"
                        style={{ 
                          width: `${Math.max(20, (day.visits / Math.max(...analyticsData.daily_stats.map(d => d.visits))) * 100)}px`
                        }}
                      />
                      <span className="text-blue-600 font-bold min-w-[30px] text-right">
                        {day.visits}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}