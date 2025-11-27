import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Service } from '@/lib/api';

interface ServiceSelectionStepProps {
  services: Service[];
  selectedServiceId: string | null;
  onSelectService: (serviceId: string) => void;
  onNext: () => void;
}

export default function ServiceSelectionStep({
  services,
  selectedServiceId,
  onSelectService,
  onNext
}: ServiceSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Выберите услугу</h2>
        <p className="text-muted-foreground">Какая процедура вас интересует?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all ${
              selectedServiceId === service.id
                ? 'ring-2 ring-primary shadow-lg'
                : 'hover:shadow-md'
            }`}
            onClick={() => onSelectService(service.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Sparkles" size={20} />
                {service.name}
              </CardTitle>
              <CardDescription>{service.duration} мин</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
              <p className="text-2xl font-bold">{service.price} ₽</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedServiceId} size="lg">
          Далее
          <Icon name="ArrowRight" size={20} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
