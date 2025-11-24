import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TELEGRAM_AUTH_URL = 'https://functions.poehali.dev/81142751-b500-40dc-91f2-9318b9f48791';
const ADMIN_API_URL = 'https://functions.poehali.dev/9471e2dc-0dfa-4927-9d58-74f7dc75819c';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_admin: boolean;
  telegram_id: string;
  telegram_username?: string;
}

interface TableData {
  [key: string]: any[];
}

interface HistoryItem {
  id: number;
  chakra_id: number;
  chakra_name: string;
  user_id: number;
  user_name: string;
  field_name: string;
  old_value: string;
  new_value: string;
  edited_at: string;
}

const TABLES = [
  { key: 'chakras', label: 'Чакры', fields: ['id', 'name', 'color', 'position', 'right_statement', 'description'] },
  { key: 'chakra_concepts', label: 'Понятия', fields: ['id', 'chakra_id', 'concept', 'category', 'user_id'] },
  { key: 'chakra_questions', label: 'Вопросы', fields: ['id', 'chakra_id', 'question', 'question_type', 'user_id'] },
  { key: 'chakra_responsibilities', label: 'Ответственности', fields: ['id', 'chakra_id', 'responsibility', 'user_id'] },
  { key: 'chakra_sciences', label: 'Науки', fields: ['id', 'chakra_id', 'science_name', 'description', 'user_id'] },
  { key: 'chakra_organs', label: 'Органы', fields: ['id', 'chakra_id', 'organ_name', 'description', 'user_id'] },
];

const AdminChakra = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [telegramId, setTelegramId] = useState('');
  const [telegramGroupId, setTelegramGroupId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [tableData, setTableData] = useState<TableData>({});
  const [activeTable, setActiveTable] = useState('chakras');

  const [editDialog, setEditDialog] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleLogin = async () => {
    if (!telegramId.trim() || !telegramGroupId.trim()) {
      setError('Введите Telegram ID и Group ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(TELEGRAM_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: telegramId.trim(),
          telegram_group_id: telegramGroupId.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка авторизации');
      }

      setToken(data.token);
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    if (!token || !currentUser?.is_admin) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?table=users`, {
        headers: { 'X-Auth-Token': token },
      });
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
    }
  };

  const loadTableData = async (table: string) => {
    if (!token) return;

    try {
      const url = currentUser?.is_admin && selectedUserId
        ? `${ADMIN_API_URL}?table=${table}&user_id=${selectedUserId}`
        : `${ADMIN_API_URL}?table=${table}`;

      const response = await fetch(url, {
        headers: { 'X-Auth-Token': token },
      });
      const data = await response.json();
      setTableData((prev) => ({ ...prev, [table]: data[table] || [] }));
    } catch (err) {
      console.error(`Ошибка загрузки ${table}:`, err);
    }
  };

  const loadHistory = async () => {
    if (!token || !currentUser?.is_admin) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?table=history&limit=200`, {
        headers: { 'X-Auth-Token': token },
      });
      const data = await response.json();
      if (data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error('Ошибка загрузки истории:', err);
    }
  };

  const handleCreate = (table: string) => {
    const fields = TABLES.find((t) => t.key === table)?.fields || [];
    const newItem: any = {};
    fields.forEach((field) => {
      if (field !== 'id') newItem[field] = '';
    });
    setEditItem(newItem);
    setEditMode('create');
    setEditDialog(true);
  };

  const handleEdit = (item: any) => {
    setEditItem({ ...item });
    setEditMode('edit');
    setEditDialog(true);
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      const method = editMode === 'create' ? 'POST' : 'PUT';
      const body =
        editMode === 'create'
          ? { table: activeTable, data: editItem }
          : { table: activeTable, id: editItem.id, data: editItem };

      const response = await fetch(ADMIN_API_URL, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setEditDialog(false);
        loadTableData(activeTable);
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка сохранения');
      }
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Удалить запись?')) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?table=${activeTable}&id=${id}`, {
        method: 'DELETE',
        headers: { 'X-Auth-Token': token },
      });

      if (response.ok) {
        loadTableData(activeTable);
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadUsers();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadTableData(activeTable);
    }
  }, [activeTable, selectedUserId, isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Админ-панель ChakraCraft</CardTitle>
            <CardDescription className="text-center">
              Войдите через Telegram ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="telegram_id">Telegram ID</Label>
              <Input
                id="telegram_id"
                placeholder="123456789"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram_group_id">Telegram Group ID</Label>
              <Input
                id="telegram_group_id"
                placeholder="-1001234567890"
                value={telegramGroupId}
                onChange={(e) => setTelegramGroupId(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin} disabled={loading} className="w-full">
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Админ-панель ChakraCraft</h1>
            <p className="text-emerald-700">
              {currentUser?.name} {currentUser?.is_admin ? '(Администратор)' : '(Пользователь)'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              setIsAuthenticated(false);
              setToken(null);
              setCurrentUser(null);
            }}
          >
            <Icon name="LogOut" className="mr-2" />
            Выйти
          </Button>
        </div>

        {currentUser?.is_admin && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Выбор пользователя</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <div className="flex-1">
                <Select
                  value={selectedUserId?.toString() || 'all'}
                  onValueChange={(val) => setSelectedUserId(val === 'all' ? null : parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Все пользователи" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все пользователи</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowHistory(!showHistory);
                  if (!showHistory) loadHistory();
                }}
              >
                <Icon name="Clock" className="mr-2" />
                {showHistory ? 'Скрыть историю' : 'История изменений'}
              </Button>
            </CardContent>
          </Card>
        )}

        {currentUser?.is_admin && showHistory && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>История изменений</CardTitle>
              <CardDescription>
                Последние 200 изменений всех пользователей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Чакра</TableHead>
                      <TableHead>Поле</TableHead>
                      <TableHead>Старое значение</TableHead>
                      <TableHead>Новое значение</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(item.edited_at).toLocaleString('ru-RU')}
                        </TableCell>
                        <TableCell>{item.user_name || `ID ${item.user_id}`}</TableCell>
                        <TableCell>{item.chakra_name || `#${item.chakra_id}`}</TableCell>
                        <TableCell className="font-mono text-xs">{item.field_name}</TableCell>
                        <TableCell className="max-w-xs truncate text-xs text-gray-500">
                          {item.old_value?.substring(0, 50)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-xs text-emerald-700 font-medium">
                          {item.new_value?.substring(0, 50)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {history.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          История изменений пуста
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Управление данными</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTable} onValueChange={setActiveTable}>
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-4">
                {TABLES.map((table) => (
                  <TabsTrigger key={table.key} value={table.key}>
                    {table.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {TABLES.map((table) => (
                <TabsContent key={table.key} value={table.key}>
                  <div className="mb-4">
                    <Button onClick={() => handleCreate(table.key)}>
                      <Icon name="Plus" className="mr-2" />
                      Добавить
                    </Button>
                  </div>
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {table.fields.map((field) => (
                            <TableHead key={field}>{field}</TableHead>
                          ))}
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(tableData[table.key] || []).map((item) => (
                          <TableRow key={item.id}>
                            {table.fields.map((field) => (
                              <TableCell key={field}>
                                {String(item[field] || '').substring(0, 50)}
                              </TableCell>
                            ))}
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                                  <Icon name="Edit" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Icon name="Trash2" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={editDialog} onOpenChange={setEditDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editMode === 'create' ? 'Создать запись' : 'Редактировать запись'}
              </DialogTitle>
              <DialogDescription>
                {TABLES.find((t) => t.key === activeTable)?.label}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {editItem &&
                Object.keys(editItem).map((key) => {
                  if (key === 'id' && editMode === 'edit') return null;
                  return (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key}>{key}</Label>
                      {key.includes('description') || key === 'concept' || key === 'question' || key === 'responsibility' ? (
                        <Textarea
                          id={key}
                          value={editItem[key] || ''}
                          onChange={(e) =>
                            setEditItem({ ...editItem, [key]: e.target.value })
                          }
                        />
                      ) : (
                        <Input
                          id={key}
                          value={editItem[key] || ''}
                          onChange={(e) =>
                            setEditItem({ ...editItem, [key]: e.target.value })
                          }
                        />
                      )}
                    </div>
                  );
                })}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialog(false)}>
                Отмена
              </Button>
              <Button onClick={handleSave}>Сохранить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminChakra;