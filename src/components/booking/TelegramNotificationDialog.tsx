import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TelegramNotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  botUsername: string;
}

export default function TelegramNotificationDialog({
  isOpen,
  onClose,
  botUsername
}: TelegramNotificationDialogProps) {
  const telegramBotUrl = `https://t.me/${botUsername}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="BellRing" size={24} />
            Настройте уведомления
          </DialogTitle>
          <DialogDescription>
            Получайте напоминания о записи в Telegram
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 mt-1">
              <Icon name="MessageCircle" size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">Шаг 1: Откройте бота</p>
              <p className="text-sm text-muted-foreground">
                Перейдите в Telegram и найдите бота @{botUsername}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 mt-1">
              <Icon name="Play" size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">Шаг 2: Запустите бота</p>
              <p className="text-sm text-muted-foreground">
                Нажмите кнопку "Start" или отправьте команду /start
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 mt-1">
              <Icon name="CheckCircle" size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">Готово!</p>
              <p className="text-sm text-muted-foreground">
                Бот отправит вам подтверждение и напоминание о записи
              </p>
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <Button onClick={() => window.open(telegramBotUrl, '_blank')} className="flex-1">
              <Icon name="Send" size={20} className="mr-2" />
              Открыть в Telegram
            </Button>
            <Button onClick={onClose} variant="outline">
              Позже
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
