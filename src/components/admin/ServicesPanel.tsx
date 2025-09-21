import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { ALL_SERVICES, Service } from '@/data/services';

const ServicesPanel = () => {
  const [services, setServices] = useState<Service[]>(ALL_SERVICES);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
  };

  const handleSave = () => {
    if (!editingService) return;

    const updatedServices = services.map(service =>
      service.id === editingService.id ? editingService : service
    );
    
    setServices(updatedServices);
    setEditingService(null);
    setShowSuccessMessage(true);

    // Скрываем сообщение через 3 секунды
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);

    // Сохраняем в localStorage
    localStorage.setItem('adminServices', JSON.stringify(updatedServices));
  };

  const handleCancel = () => {
    setEditingService(null);
  };

  // Загружаем сохраненные данные при загрузке
  useEffect(() => {
    const savedServices = localStorage.getItem('adminServices');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Управление услугами</h3>
        <div className="text-sm text-gray-500">
          {services.length} услуг
        </div>
      </div>

      {showSuccessMessage && (
        <div className="p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 text-center">
          <Icon name="CheckCircle" size={20} className="inline mr-2" />
          Услуга успешно обновлена!
        </div>
      )}

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-gray-800">
                    {service.name}
                  </CardTitle>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {service.category}
                    </span>
                    <span>{service.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-800">
                    {service.price}
                  </div>
                  <Button
                    onClick={() => handleEdit(service)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Icon name="Edit" size={16} className="mr-1" />
                    Редактировать
                  </Button>
                </div>
              </div>
            </CardHeader>
            {service.description && (
              <CardContent>
                <p className="text-gray-700 text-sm">{service.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="Edit" size={24} className="mr-2" />
                Редактирование услуги
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="serviceName">Название услуги</Label>
                <Input
                  id="serviceName"
                  value={editingService.name}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    name: e.target.value
                  })}
                />
              </div>

              <div>
                <Label htmlFor="servicePrice">Цена</Label>
                <Input
                  id="servicePrice"
                  value={editingService.price}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    price: e.target.value
                  })}
                  placeholder="6 000 ₽"
                />
              </div>

              <div>
                <Label htmlFor="serviceDuration">Длительность</Label>
                <Input
                  id="serviceDuration"
                  value={editingService.duration}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    duration: e.target.value
                  })}
                  placeholder="60 мин"
                />
              </div>

              <div>
                <Label htmlFor="serviceCategory">Категория</Label>
                <Input
                  id="serviceCategory"
                  value={editingService.category}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    category: e.target.value
                  })}
                />
              </div>

              {editingService.description && (
                <div>
                  <Label htmlFor="serviceDescription">Описание</Label>
                  <Textarea
                    id="serviceDescription"
                    value={editingService.description}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      description: e.target.value
                    })}
                    rows={3}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  <Icon name="X" size={16} className="mr-2" />
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ServicesPanel;