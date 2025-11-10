import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import API_ENDPOINTS from "@/config/api";

interface AnalyticsData {
  period_days: number;
  total_visits: number;
  unique_visitors: number;
  top_pages: Array<{ page_url: string; visits: number }>;
  daily_stats: Array<{ visit_date: string; visits: number }>;
  top_referrers: Array<{ referrer: string; visits: number }>;
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(7);

  const fetchAnalytics = async (days: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.analytics}?endpoint=analytics&days=${days}`);
      
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-800">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-white text-xl">Загрузка статистики...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-800">
        <Header />
        <div className="pt-24 px-4 text-center">
          <div className="text-red-300 text-xl mb-4">Ошибка: {error}</div>
          <button 
            onClick={() => fetchAnalytics(period)}
            className="bg-gold-500 text-white px-4 py-2 rounded hover:bg-gold-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-800">
      <Header />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-montserrat font-bold text-4xl text-gold-100 mb-4">
              Статистика посещений
            </h1>
            <p className="text-xl text-emerald-200">
              Аналитика вашего массажного салона
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 bg-emerald-800/50 p-2 rounded-lg">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setPeriod(days)}
                  className={`px-4 py-2 rounded ${
                    period === days 
                      ? 'bg-gold-500 text-white' 
                      : 'text-emerald-200 hover:bg-emerald-700/50'
                  }`}
                >
                  {days} дней
                </button>
              ))}
            </div>
          </div>

          {analyticsData && (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-emerald-800/50 backdrop-blur-sm border-emerald-600">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-200">
                      Всего посещений
                    </CardTitle>
                    <Icon name="Eye" className="h-4 w-4 text-gold-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {analyticsData.total_visits}
                    </div>
                    <p className="text-xs text-emerald-300">
                      За последние {analyticsData.period_days} дней
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-emerald-800/50 backdrop-blur-sm border-emerald-600">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-200">
                      Уникальные посетители
                    </CardTitle>
                    <Icon name="Users" className="h-4 w-4 text-gold-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {analyticsData.unique_visitors}
                    </div>
                    <p className="text-xs text-emerald-300">
                      Разные IP-адреса
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-emerald-800/50 backdrop-blur-sm border-emerald-600">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-200">
                      Среднее в день
                    </CardTitle>
                    <Icon name="TrendingUp" className="h-4 w-4 text-gold-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {Math.round(analyticsData.total_visits / analyticsData.period_days)}
                    </div>
                    <p className="text-xs text-emerald-300">
                      Посещений в день
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Pages */}
              <Card className="bg-emerald-800/50 backdrop-blur-sm border-emerald-600">
                <CardHeader>
                  <CardTitle className="text-emerald-100">Популярные страницы</CardTitle>
                  <CardDescription className="text-emerald-300">
                    Самые посещаемые разделы сайта
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.top_pages.slice(0, 5).map((page, index) => (
                      <div key={page.page_url} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-emerald-200">
                            {formatPageName(page.page_url)}
                          </span>
                        </div>
                        <span className="text-gold-400 font-bold">
                          {page.visits}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Traffic Sources */}
              <Card className="bg-emerald-800/50 backdrop-blur-sm border-emerald-600">
                <CardHeader>
                  <CardTitle className="text-emerald-100">Источники трафика</CardTitle>
                  <CardDescription className="text-emerald-300">
                    Откуда приходят посетители
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.top_referrers.slice(0, 5).map((referrer, index) => (
                      <div key={referrer.referrer} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon name="ExternalLink" className="h-4 w-4 text-gold-400" />
                          <span className="text-emerald-200">
                            {formatReferrer(referrer.referrer)}
                          </span>
                        </div>
                        <span className="text-gold-400 font-bold">
                          {referrer.visits}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Daily Stats */}
              <Card className="bg-emerald-800/50 backdrop-blur-sm border-emerald-600">
                <CardHeader>
                  <CardTitle className="text-emerald-100">Статистика по дням</CardTitle>
                  <CardDescription className="text-emerald-300">
                    Активность посетителей по дням
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analyticsData.daily_stats.slice(-7).map((day) => (
                      <div key={day.visit_date} className="flex items-center justify-between py-2">
                        <span className="text-emerald-200">
                          {new Date(day.visit_date).toLocaleDateString('ru-RU', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-2 bg-gold-500 rounded"
                            style={{ 
                              width: `${Math.max(20, (day.visits / Math.max(...analyticsData.daily_stats.map(d => d.visits))) * 100)}px`
                            }}
                          />
                          <span className="text-gold-400 font-bold min-w-[30px] text-right">
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
      </div>
    </div>
  );
};

export default Analytics;