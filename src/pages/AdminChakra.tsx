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

interface Chakra {
  id: number;
  name: string;
  position: number;
  continent?: string;
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
  const [selectedChakraId, setSelectedChakraId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [concepts, setConcepts] = useState<ChakraConcept[]>([]);
  const [organs, setOrgans] = useState<ChakraOrgan[]>([]);
  const [sciences, setSciences] = useState<ChakraScience[]>([]);
  const [responsibilities, setResponsibilities] = useState<ChakraResponsibility[]>([]);

  const [editDialog, setEditDialog] = useState(false);
  const [editType, setEditType] = useState<'concept' | 'organ' | 'science' | 'responsibility'>('concept');
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
        if (!selectedChakraId && data.chakras.length > 0) {
          setSelectedChakraId(data.chakras[0].id);
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки чакр:', err);
    }
  };

  const loadChakraData = async () => {
    if (!token || !selectedChakraId) return;

    const userParam = selectedUserId ? `&user_id=${selectedUserId}` : '';

    try {
      const [conceptsRes, organsRes, sciencesRes, responsibilitiesRes] = await Promise.all([
        fetch(`${ADMIN_API_URL}?table=chakra_concepts${userParam}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_organs${userParam}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_sciences${userParam}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_responsibilities${userParam}`, {
          headers: { 'X-Auth-Token': token },
        }),
      ]);

      const [conceptsData, organsData, sciencesData, responsibilitiesData] = await Promise.all([
        conceptsRes.json(),
        organsRes.json(),
        sciencesRes.json(),
        responsibilitiesRes.json(),
      ]);

      setConcepts((conceptsData.chakra_concepts || []).filter((c: ChakraConcept) => c.chakra_id === selectedChakraId));
      setOrgans((organsData.chakra_organs || []).filter((o: ChakraOrgan) => o.chakra_id === selectedChakraId));
      setSciences((sciencesData.chakra_sciences || []).filter((s: ChakraScience) => s.chakra_id === selectedChakraId));
      setResponsibilities((responsibilitiesData.chakra_responsibilities || []).filter((r: ChakraResponsibility) => r.chakra_id === selectedChakraId));
    } catch (err) {
      console.error('Ошибка загрузки данных чакры:', err);
    }
  };

  const handleCreate = (type: 'concept' | 'organ' | 'science' | 'responsibility') => {
    setEditType(type);
    setEditMode('create');
    
    const newItem: any = {
      chakra_id: selectedChakraId,
      user_id: currentUser?.id
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
        loadChakraData();
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
        loadChakraData();
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
    if (isAuthenticated && token && selectedChakraId) {
      loadChakraData();
    }
  }, [selectedChakraId, selectedUserId, isAuthenticated, token]);

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

  const selectedChakra = chakras.find((c) => c.id === selectedChakraId);
  const responsibleUser = selectedChakra?.responsible_user_id 
    ? users.find((u) => u.id === selectedChakra.responsible_user_id)
    : null;

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || `ID ${userId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Управление чакрами</h1>
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Выбор чакры</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {chakras.map((chakra) => (
                <Button
                  key={chakra.id}
                  variant={selectedChakraId === chakra.id ? 'default' : 'outline'}
                  onClick={() => setSelectedChakraId(chakra.id)}
                  className="h-auto flex flex-col items-center py-3"
                >
                  <div className="text-2xl font-bold">{chakra.position}</div>
                  <div className="text-xs mt-1">{chakra.name}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedChakra && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{selectedChakra.name}</CardTitle>
              <CardDescription>
                {selectedChakra.continent && (
                  <span className="mr-4">Континент: {selectedChakra.continent}</span>
                )}
                {responsibleUser && (
                  <span>Ответственный: {responsibleUser.name}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedUserId?.toString() || 'all'} onValueChange={(val) => setSelectedUserId(val === 'all' ? null : parseInt(val))}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  {users.map((user) => (
                    <TabsTrigger key={user.id} value={user.id.toString()}>
                      {user.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={selectedUserId?.toString() || 'all'}>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Энергии (Понятия)</h3>
                        <Button size="sm" onClick={() => handleCreate('concept')}>
                          <Icon name="Plus" className="mr-1" size={16} />
                          Добавить
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {concepts.map((concept) => (
                          <Card key={concept.id}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary">{concept.category}</Badge>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => handleEdit('concept', concept)}>
                                    <Icon name="Edit" size={14} />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleDelete('concept', concept.id)}>
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm mb-2">{concept.concept}</p>
                              <p className="text-xs text-gray-500">Автор: {getUserName(concept.user_id)}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Органы</h3>
                        <Button size="sm" onClick={() => handleCreate('organ')}>
                          <Icon name="Plus" className="mr-1" size={16} />
                          Добавить
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {organs.map((organ) => (
                          <Card key={organ.id}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{organ.organ_name}</h4>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => handleEdit('organ', organ)}>
                                    <Icon name="Edit" size={14} />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleDelete('organ', organ.id)}>
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm mb-2">{organ.description}</p>
                              <p className="text-xs text-gray-500">Автор: {getUserName(organ.user_id)}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Науки</h3>
                        <Button size="sm" onClick={() => handleCreate('science')}>
                          <Icon name="Plus" className="mr-1" size={16} />
                          Добавить
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sciences.map((science) => (
                          <Card key={science.id}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{science.science_name}</h4>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => handleEdit('science', science)}>
                                    <Icon name="Edit" size={14} />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleDelete('science', science.id)}>
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm mb-2">{science.description}</p>
                              <p className="text-xs text-gray-500">Автор: {getUserName(science.user_id)}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Ответственности</h3>
                        <Button size="sm" onClick={() => handleCreate('responsibility')}>
                          <Icon name="Plus" className="mr-1" size={16} />
                          Добавить
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {responsibilities.map((resp) => (
                          <Card key={resp.id}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-sm flex-1">{resp.responsibility}</p>
                                <div className="flex gap-1 ml-2">
                                  <Button size="sm" variant="ghost" onClick={() => handleEdit('responsibility', resp)}>
                                    <Icon name="Edit" size={14} />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleDelete('responsibility', resp.id)}>
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">Автор: {getUserName(resp.user_id)}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <Dialog open={editDialog} onOpenChange={setEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editMode === 'create' ? 'Добавить' : 'Редактировать'}
              </DialogTitle>
              <DialogDescription>
                {editType === 'concept' && 'Энергия (Понятие)'}
                {editType === 'organ' && 'Орган'}
                {editType === 'science' && 'Наука'}
                {editType === 'responsibility' && 'Ответственность'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {editItem && editType === 'concept' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="concept">Понятие</Label>
                    <Textarea
                      id="concept"
                      value={editItem.concept || ''}
                      onChange={(e) => setEditItem({ ...editItem, concept: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Категория</Label>
                    <Input
                      id="category"
                      value={editItem.category || ''}
                      onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    />
                  </div>
                </>
              )}

              {editItem && editType === 'organ' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="organ_name">Название органа</Label>
                    <Input
                      id="organ_name"
                      value={editItem.organ_name || ''}
                      onChange={(e) => setEditItem({ ...editItem, organ_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={editItem.description || ''}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                    />
                  </div>
                </>
              )}

              {editItem && editType === 'science' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="science_name">Название науки</Label>
                    <Input
                      id="science_name"
                      value={editItem.science_name || ''}
                      onChange={(e) => setEditItem({ ...editItem, science_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={editItem.description || ''}
                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                    />
                  </div>
                </>
              )}

              {editItem && editType === 'responsibility' && (
                <div className="space-y-2">
                  <Label htmlFor="responsibility">Ответственность</Label>
                  <Textarea
                    id="responsibility"
                    value={editItem.responsibility || ''}
                    onChange={(e) => setEditItem({ ...editItem, responsibility: e.target.value })}
                  />
                </div>
              )}
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
