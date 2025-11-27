import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useData } from '@/contexts/diary/DataContext';
import { api } from '@/services/diary/api';
import { useToast } from '@/hooks/use-toast';

const ClientsTab = () => {
  const { clients, loading, refreshClients } = useData();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleCreate = async () => {
    if (!newClient.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите имя клиента',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.clients.create(newClient);
      
      toast({
        title: 'Клиент добавлен',
        description: 'Новый клиент успешно добавлен в базу',
      });
      
      setShowDialog(false);
      setNewClient({ name: '', phone: '', email: '' });
      refreshClients();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить клиента',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Клиенты</h2>
          <p className="text-gray-500 mt-1">База ваших клиентов</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Icon name="UserPlus" size={16} />
              Добавить клиента
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить клиента</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Имя *</Label>
                <Input
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Иван Иванов"
                />
              </div>

              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="+7 (900) 123-45-67"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="client@example.com"
                />
              </div>

              <Button onClick={handleCreate} className="w-full">
                Добавить клиента
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Всего клиентов
            </CardTitle>
            <Icon name="Users" size={20} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{clients.length}</div>
            <p className="text-xs text-gray-500 mt-1">Активные клиенты</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Постоянные
            </CardTitle>
            <Icon name="Star" size={20} className="text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {clients.filter(c => c.total_visits > 5).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Больше 5 визитов</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Новые
            </CardTitle>
            <Icon name="UserPlus" size={20} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {clients.filter(c => c.total_visits <= 2).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">До 2 визитов</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список клиентов</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500 py-8">Загрузка...</p>
          ) : clients.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Нет клиентов</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Визитов</TableHead>
                  <TableHead>Последний визит</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.phone || 'Не указан'}</TableCell>
                    <TableCell>{client.email || 'Не указан'}</TableCell>
                    <TableCell>{client.total_visits}</TableCell>
                    <TableCell>
                      {client.last_visit_date 
                        ? new Date(client.last_visit_date).toLocaleDateString('ru-RU')
                        : 'Нет данных'
                      }
                    </TableCell>
                    <TableCell>
                      {client.total_visits > 5 ? (
                        <span className="inline-flex items-center gap-1 text-yellow-600">
                          <Icon name="Star" size={14} />
                          Постоянный
                        </span>
                      ) : client.total_visits <= 2 ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <Icon name="UserPlus" size={14} />
                          Новый
                        </span>
                      ) : (
                        <span className="text-gray-600">Активный</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsTab;