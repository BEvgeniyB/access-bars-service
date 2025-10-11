import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface Review {
  id: number;
  name: string;
  service: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const REVIEWS_API_URL = 'https://functions.poehali.dev/2f5c36e4-cdb6-496c-8ca9-5aaa20079486';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  approved: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300'
};

const STATUS_LABELS = {
  pending: 'На модерации',
  approved: 'Одобрен',
  rejected: 'Отклонен'
};

export default function ReviewModerationPanel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('pending');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadReviews(currentTab);
  }, [currentTab]);

  const loadReviews = async (status: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${REVIEWS_API_URL}?status=${status}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (reviewId: number, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(REVIEWS_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reviewId,
          status: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        loadReviews(currentTab);
      } else {
        console.error('Ошибка обновления статуса:', data.error);
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const updateReviewText = async (reviewId: number, newText: string) => {
    try {
      const response = await fetch(REVIEWS_API_URL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reviewId,
          text: newText
        })
      });

      const data = await response.json();

      if (data.success) {
        setEditingId(null);
        setEditText('');
        loadReviews(currentTab);
      } else {
        console.error('Ошибка обновления текста:', data.error);
      }
    } catch (error) {
      console.error('Ошибка обновления текста:', error);
    }
  };

  const startEditing = (review: Review) => {
    setEditingId(review.id);
    setEditText(review.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const getPendingCount = async () => {
    try {
      const response = await fetch(`${REVIEWS_API_URL}?status=pending`);
      const data = await response.json();
      return data.reviews?.length || 0;
    } catch {
      return 0;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Модерация отзывов</h2>
        <Button onClick={() => loadReviews(currentTab)} variant="outline" size="sm">
          <Icon name="RefreshCw" size={16} />
          Обновить
        </Button>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Icon name="Clock" size={16} />
            На модерации
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <Icon name="CheckCircle" size={16} />
            Одобренные
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <Icon name="XCircle" size={16} />
            Отклоненные
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader2" size={32} className="animate-spin text-blue-500" />
            </div>
          ) : reviews.length === 0 ? (
            <Card className="p-12 text-center">
              <Icon name="MessageSquare" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет отзывов</h3>
              <p className="text-gray-600">
                {currentTab === 'pending' && 'Новые отзывы появятся здесь'}
                {currentTab === 'approved' && 'Одобренные отзывы появятся здесь'}
                {currentTab === 'rejected' && 'Отклоненные отзывы появятся здесь'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{review.name}</h3>
                        <Badge className="text-xs">{review.service}</Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Icon 
                              key={i} 
                              name="Star" 
                              className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                              size={14} 
                            />
                          ))}
                        </div>
                      </div>
                      {editingId === review.id ? (
                        <div className="mb-3">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full min-h-[100px] mb-2"
                            placeholder="Текст отзыва"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => updateReviewText(review.id, editText)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Icon name="Check" size={14} className="mr-1" />
                              Сохранить
                            </Button>
                            <Button
                              onClick={cancelEditing}
                              size="sm"
                              variant="outline"
                            >
                              <Icon name="X" size={14} className="mr-1" />
                              Отменить
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 mb-2">
                          <p className="text-gray-700 leading-relaxed flex-1">{review.text}</p>
                          <Button
                            onClick={() => startEditing(review)}
                            size="sm"
                            variant="ghost"
                            className="flex-shrink-0"
                            title="Редактировать текст"
                          >
                            <Icon name="Pencil" size={14} />
                          </Button>
                        </div>
                      )}
                      <p className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('ru-RU', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Badge className={`${STATUS_COLORS[review.status]} mb-2`}>
                        {STATUS_LABELS[review.status]}
                      </Badge>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  {currentTab === 'pending' && (
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        onClick={() => updateReviewStatus(review.id, 'approved')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Icon name="Check" size={16} className="mr-2" />
                        Одобрить
                      </Button>
                      <Button
                        onClick={() => updateReviewStatus(review.id, 'rejected')}
                        variant="destructive"
                        className="flex-1"
                      >
                        <Icon name="X" size={16} className="mr-2" />
                        Отклонить
                      </Button>
                    </div>
                  )}

                  {currentTab === 'approved' && (
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        onClick={() => updateReviewStatus(review.id, 'rejected')}
                        variant="outline"
                        className="flex-1"
                      >
                        <Icon name="X" size={16} className="mr-2" />
                        Отклонить
                      </Button>
                    </div>
                  )}

                  {currentTab === 'rejected' && (
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        onClick={() => updateReviewStatus(review.id, 'approved')}
                        variant="outline"
                        className="flex-1"
                      >
                        <Icon name="Check" size={16} className="mr-2" />
                        Одобрить
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}