import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface EditBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: any[];
  editingBooking: any;
  setEditingBooking: (booking: any) => void;
  onSubmit: () => void;
}

const EditBookingDialog = ({
  open,
  onOpenChange,
  services,
  editingBooking,
  setEditingBooking,
  onSubmit,
}: EditBookingDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать запись</DialogTitle>
        </DialogHeader>
        
        {editingBooking && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Клиент</Label>
              <Input
                value={editingBooking.client_name}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label>Услуга</Label>
              <Select
                value={editingBooking.service_id}
                onValueChange={(value) =>
                  setEditingBooking({ ...editingBooking, service_id: value })
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
              <Label>Дата записи</Label>
              <Input
                type="date"
                value={editingBooking.date}
                onChange={(e) => setEditingBooking({...editingBooking, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Время</Label>
              <Input
                type="time"
                value={editingBooking.start_time}
                onChange={(e) => setEditingBooking({...editingBooking, start_time: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select
                value={editingBooking.status}
                onValueChange={(value) =>
                  setEditingBooking({ ...editingBooking, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="confirmed">Подтверждена</SelectItem>
                  <SelectItem value="completed">Завершена</SelectItem>
                  <SelectItem value="cancelled">Отменена</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                onClick={onSubmit}
                className="flex-1"
              >
                Сохранить
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingDialog;
