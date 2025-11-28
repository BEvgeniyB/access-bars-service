import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface CreateBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: any[];
  services: any[];
  newBooking: {
    client_id: string;
    service_id: string;
    date: string;
    start_time: string;
    end_time: string;
  };
  setNewBooking: (booking: any) => void;
  onSubmit: () => void;
}

const CreateBookingDialog = ({
  open,
  onOpenChange,
  clients,
  services,
  newBooking,
  setNewBooking,
  onSubmit,
}: CreateBookingDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Icon name="Plus" size={16} />
          Новая запись
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать запись</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Клиент</Label>
            <Select
              value={newBooking.client_id}
              onValueChange={(value) =>
                setNewBooking({ ...newBooking, client_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите клиента" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={String(client.id)}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Услуга</Label>
            <Select
              value={newBooking.service_id}
              onValueChange={(value) =>
                setNewBooking({ ...newBooking, service_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите услугу" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={String(service.id)}>
                    {service.name} ({service.duration_minutes} мин)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Дата</Label>
            <Input
              type="date"
              value={newBooking.date}
              onChange={(e) =>
                setNewBooking({ ...newBooking, date: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Начало</Label>
              <Input
                type="time"
                value={newBooking.start_time}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, start_time: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Конец</Label>
              <Input
                type="time"
                value={newBooking.end_time}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, end_time: e.target.value })
                }
              />
            </div>
          </div>

          <Button onClick={onSubmit} className="w-full">
            Создать запись
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBookingDialog;
