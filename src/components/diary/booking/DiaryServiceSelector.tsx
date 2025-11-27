import { Service } from '@/services/diaryApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface DiaryServiceSelectorProps {
  services: Service[];
  selectedService: Service | null;
  onSelect: (service: Service) => void;
}

export default function DiaryServiceSelector({
  services,
  selectedService,
  onSelect,
}: DiaryServiceSelectorProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Icon name="Calendar" className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>Услуги не найдены</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Выберите услугу</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedService?.id === service.id
                ? 'ring-2 ring-primary'
                : ''
            }`}
            onClick={() => onSelect(service)}
          >
            <CardContent className="p-6 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                {selectedService?.id === service.id && (
                  <Icon name="Check" className="h-5 w-5 text-primary" />
                )}
              </div>
              
              {service.description && (
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Icon name="Clock" className="h-4 w-4" />
                  <span>{service.duration} мин</span>
                </div>
                <div className="flex items-center gap-1 font-semibold">
                  <Icon name="Wallet" className="h-4 w-4" />
                  <span>{service.price} ₽</span>
                </div>
              </div>

              <Button
                className="w-full"
                variant={selectedService?.id === service.id ? 'default' : 'outline'}
              >
                {selectedService?.id === service.id ? 'Выбрано' : 'Выбрать'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
