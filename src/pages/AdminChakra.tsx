import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  chakra_id?: number;
}

interface Chakra {
  id: number;
  name: string;
  position: number;
  color: string;
  continent?: string;
  right_statement?: string;
  responsible_user_id?: number;
}

interface ChakraConcept {
  id: number;
  chakra_id: number;
  concept: string;
  category: string;
  user_id: number;
}

interface ChakraOrgan {
  id: number;
  chakra_id: number;
  organ_name: string;
  description: string;
  user_id: number;
}

interface ChakraScience {
  id: number;
  chakra_id: number;
  science_name: string;
  description: string;
  user_id: number;
}

interface ChakraResponsibility {
  id: number;
  chakra_id: number;
  responsibility: string;
  user_id: number;
}

const AdminChakra = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [telegramId, setTelegramId] = useState('');
  const [telegramGroupId, setTelegramGroupId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [chakras, setChakras] = useState<Chakra[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [concepts, setConcepts] = useState<ChakraConcept[]>([]);
  const [organs, setOrgans] = useState<ChakraOrgan[]>([]);
  const [sciences, setSciences] = useState<ChakraScience[]>([]);
  const [responsibilities, setResponsibilities] = useState<ChakraResponsibility[]>([]);

  const [editDialog, setEditDialog] = useState(false);
  const [editType, setEditType] = useState<'concept' | 'organ' | 'science' | 'responsibility' | 'user'>('concept');
  const [editItem, setEditItem] = useState<any>(null);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');

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
    if (!token) return;

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

  const loadChakras = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?table=chakras`, {
        headers: { 'X-Auth-Token': token },
      });
      const data = await response.json();
      if (data.chakras) {
        setChakras(data.chakras.sort((a: Chakra, b: Chakra) => a.position - b.position));
      }
    } catch (err) {
      console.error('Ошибка загрузки чакр:', err);
    }
  };

  const loadUserData = async () => {
    if (!token || !selectedUserId) return;

    const selectedUser = users.find((u) => u.id === selectedUserId);
    if (!selectedUser?.chakra_id) {
      setConcepts([]);
      setOrgans([]);
      setSciences([]);
      setResponsibilities([]);
      return;
    }

    try {
      const [conceptsRes, organsRes, sciencesRes, responsibilitiesRes] = await Promise.all([
        fetch(`${ADMIN_API_URL}?table=chakra_concepts&user_id=${selectedUserId}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_organs&user_id=${selectedUserId}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_sciences&user_id=${selectedUserId}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_responsibilities&user_id=${selectedUserId}`, {
          headers: { 'X-Auth-Token': token },
        }),
      ]);

      const [conceptsData, organsData, sciencesData, responsibilitiesData] = await Promise.all([
        conceptsRes.json(),
        organsRes.json(),
        sciencesRes.json(),
        responsibilitiesRes.json(),
      ]);

      setConcepts(conceptsData.chakra_concepts || []);
      setOrgans(organsData.chakra_organs || []);
      setSciences(sciencesData.chakra_sciences || []);
      setResponsibilities(responsibilitiesData.chakra_responsibilities || []);
    } catch (err) {
      console.error('Ошибка загрузки данных пользователя:', err);
    }
  };

  const handleCreateUser = () => {
    setEditType('user');
    setEditMode('create');
    setEditItem({
      name: '',
      email: '',
      telegram_id: '',
      telegram_username: '',
      chakra_id: null,
      role: 'responsible',
      is_admin: false,
    });
    setEditDialog(true);
  };

  const handleEditUser = (user: User) => {
    setEditType('user');
    setEditMode('edit');
    setEditItem({ ...user });
    setEditDialog(true);
  };

  const handleCreate = (type: 'concept' | 'organ' | 'science' | 'responsibility') => {
    const selectedUser = users.find((u) => u.id === selectedUserId);
    if (!selectedUser?.chakra_id) {
      alert('Сначала назначьте пользователю чакру');
      return;
    }

    setEditType(type);
    setEditMode('create');

    const newItem: any = {
      chakra_id: selectedUser.chakra_id,
      user_id: selectedUserId,
    };

    if (type === 'concept') {
      newItem.concept = '';
      newItem.category = '';
    } else if (type === 'organ') {
      newItem.organ_name = '';
      newItem.description = '';
    } else if (type === 'science') {
      newItem.science_name = '';
      newItem.description = '';
    } else if (type === 'responsibility') {
      newItem.responsibility = '';
    }

    setEditItem(newItem);
    setEditDialog(true);
  };

  const handleEdit = (type: 'concept' | 'organ' | 'science' | 'responsibility', item: any) => {
    setEditType(type);
    setEditMode('edit');
    setEditItem({ ...item });
    setEditDialog(true);
  };

  const handleSave = async () => {
    if (!token || !editItem) return;

    const tableMap = {
      concept: 'chakra_concepts',
      organ: 'chakra_organs',
      science: 'chakra_sciences',
      responsibility: 'chakra_responsibilities',
      user: 'users',
    };

    const table = tableMap[editType];

    try {
      const method = editMode === 'create' ? 'POST' : 'PUT';
      const body =
        editMode === 'create'
          ? { table, data: editItem }
          : { table, id: editItem.id, data: editItem };

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
        if (editType === 'user') {
          loadUsers();
        } else {
          loadUserData();
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка сохранения');
      }
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  const handleDelete = async (type: 'concept' | 'organ' | 'science' | 'responsibility', id: number) => {
    if (!token || !confirm('Удалить запись?')) return;

    const tableMap = {
      concept: 'chakra_concepts',
      organ: 'chakra_organs',
      science: 'chakra_sciences',
      responsibility: 'chakra_responsibilities',
    };

    const table = tableMap[type];

    try {
      const response = await fetch(`${ADMIN_API_URL}?table=${table}&id=${id}`, {
        method: 'DELETE',
        headers: { 'X-Auth-Token': token },
      });

      if (response.ok) {
        loadUserData();
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
      loadChakras();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated && token && selectedUserId) {
      loadUserData();
    }
  }, [selectedUserId, isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">Админ-панель ChakraCraft</CardTitle>
            <CardDescription className="text-center text-sm">
              Войдите через Telegram ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="telegram_id" className="text-sm">Telegram ID</Label>
              <Input
                id="telegram_id"
                placeholder="123456789"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram_group_id" className="text-sm">Telegram Group ID</Label>
              <Input
                id="telegram_group_id"
                placeholder="-1001234567890"
                value={telegramGroupId}
                onChange={(e) => setTelegramGroupId(e.target.value)}
                className="text-base"
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

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const userChakra = selectedUser?.chakra_id
    ? chakras.find((c) => c.id === selectedUser.chakra_id)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 pb-20">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-emerald-900 truncate">ChakraCraft</h1>
              <p className="text-xs text-emerald-700 truncate">
                {currentUser?.name} {currentUser?.is_admin && '(Админ)'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                setIsAuthenticated(false);
                setToken(null);
                setCurrentUser(null);
              }}
            >
              <Icon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {currentUser?.is_admin && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Пользователи</CardTitle>
                <Button size="sm" onClick={handleCreateUser}>
                  <Icon name="Plus" size={16} className="mr-1" />
                  Добавить
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedUserId === user.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        {user.chakra_id && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Чакра {chakras.find((c) => c.id === user.chakra_id)?.position}
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditUser(user);
                        }}
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedUser && userChakra && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Чакра пользователя {selectedUser.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: userChakra.color }}
                  >
                    {userChakra.position}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{userChakra.name}</p>
                    {userChakra.continent && (
                      <p className="text-xs text-gray-600">{userChakra.continent}</p>
                    )}
                  </div>
                </div>
                {userChakra.right_statement && (
                  <div className="mt-2 p-2 bg-emerald-50 rounded text-xs italic">
                    {userChakra.right_statement}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedUser && userChakra && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Энергии (Понятия)</CardTitle>
                  <Button size="sm" onClick={() => handleCreate('concept')}>
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {concepts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                ) : (
                  <div className="space-y-2">
                    {concepts.map((concept) => (
                      <div key={concept.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">{concept.category}</Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit('concept', concept)}>
                              <Icon name="Edit" size={14} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete('concept', concept.id)}>
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm">{concept.concept}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Органы</CardTitle>
                  <Button size="sm" onClick={() => handleCreate('organ')}>
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {organs.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                ) : (
                  <div className="space-y-2">
                    {organs.map((organ) => (
                      <div key={organ.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="font-semibold text-sm flex-1">{organ.organ_name}</h4>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit('organ', organ)}>
                              <Icon name="Edit" size={14} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete('organ', organ.id)}>
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{organ.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Науки</CardTitle>
                  <Button size="sm" onClick={() => handleCreate('science')}>
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {sciences.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                ) : (
                  <div className="space-y-2">
                    {sciences.map((science) => (
                      <div key={science.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="font-semibold text-sm flex-1">{science.science_name}</h4>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit('science', science)}>
                              <Icon name="Edit" size={14} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete('science', science.id)}>
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{science.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Ответственности</CardTitle>
                  <Button size="sm" onClick={() => handleCreate('responsibility')}>
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {responsibilities.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                ) : (
                  <div className="space-y-2">
                    {responsibilities.map((resp) => (
                      <div key={resp.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm flex-1">{resp.responsibility}</p>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit('responsibility', resp)}>
                              <Icon name="Edit" size={14} />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete('responsibility', resp.id)}>
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {selectedUser && !userChakra && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-sm text-gray-500">
                <Icon name="AlertCircle" size={32} className="mx-auto mb-2 text-orange-500" />
                <p>Пользователю не назначена чакра</p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => handleEditUser(selectedUser)}
                >
                  Назначить чакру
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editMode === 'create' ? 'Добавить' : 'Редактировать'}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editType === 'concept' && 'Энергия (Понятие)'}
              {editType === 'organ' && 'Орган'}
              {editType === 'science' && 'Наука'}
              {editType === 'responsibility' && 'Ответственность'}
              {editType === 'user' && 'Пользователь'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {editItem && editType === 'user' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Имя</Label>
                  <Input
                    id="name"
                    value={editItem.name || ''}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editItem.email || ''}
                    onChange={(e) => setEditItem({ ...editItem, email: e.target.value })}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram_id" className="text-sm">Telegram ID</Label>
                  <Input
                    id="telegram_id"
                    value={editItem.telegram_id || ''}
                    onChange={(e) => setEditItem({ ...editItem, telegram_id: e.target.value })}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram_username" className="text-sm">Telegram Username</Label>
                  <Input
                    id="telegram_username"
                    value={editItem.telegram_username || ''}
                    onChange={(e) => setEditItem({ ...editItem, telegram_username: e.target.value })}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chakra_id" className="text-sm">Назначить чакру</Label>
                  <Select
                    value={editItem.chakra_id?.toString() || ''}
                    onValueChange={(val) => setEditItem({ ...editItem, chakra_id: val ? parseInt(val) : null })}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Выберите чакру" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Не назначена</SelectItem>
                      {chakras.map((chakra) => (
                        <SelectItem key={chakra.id} value={chakra.id.toString()}>
                          {chakra.position}. {chakra.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {editItem && editType === 'concept' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="concept" className="text-sm">Понятие</Label>
                  <Textarea
                    id="concept"
                    value={editItem.concept || ''}
                    onChange={(e) => setEditItem({ ...editItem, concept: e.target.value })}
                    className="text-base min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm">Категория</Label>
                  <Input
                    id="category"
                    value={editItem.category || ''}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    className="text-base"
                  />
                </div>
              </>
            )}

            {editItem && editType === 'organ' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="organ_name" className="text-sm">Название органа</Label>
                  <Input
                    id="organ_name"
                    value={editItem.organ_name || ''}
                    onChange={(e) => setEditItem({ ...editItem, organ_name: e.target.value })}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">Описание</Label>
                  <Textarea
                    id="description"
                    value={editItem.description || ''}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                    className="text-base min-h-[80px]"
                  />
                </div>
              </>
            )}

            {editItem && editType === 'science' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="science_name" className="text-sm">Название науки</Label>
                  <Input
                    id="science_name"
                    value={editItem.science_name || ''}
                    onChange={(e) => setEditItem({ ...editItem, science_name: e.target.value })}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">Описание</Label>
                  <Textarea
                    id="description"
                    value={editItem.description || ''}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                    className="text-base min-h-[80px]"
                  />
                </div>
              </>
            )}

            {editItem && editType === 'responsibility' && (
              <div className="space-y-2">
                <Label htmlFor="responsibility" className="text-sm">Ответственность</Label>
                <Textarea
                  id="responsibility"
                  value={editItem.responsibility || ''}
                  onChange={(e) => setEditItem({ ...editItem, responsibility: e.target.value })}
                  className="text-base min-h-[80px]"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditDialog(false)} className="flex-1">
              Отмена
            </Button>
            <Button onClick={handleSave} className="flex-1">Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChakra;
