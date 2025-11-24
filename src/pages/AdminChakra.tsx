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
  
  const [allConcepts, setAllConcepts] = useState<ChakraConcept[]>([]);
  const [showNewConceptForm, setShowNewConceptForm] = useState(false);
  const [selectedExistingConceptId, setSelectedExistingConceptId] = useState<number | null>(null);

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
      console.log('Loaded users:', data.users?.length || 0, data.users);
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
        headers: { 
          'X-Auth-Token': token
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Loaded chakras:', data.chakras?.length || 0, data.chakras);
      if (data.chakras) {
        const sorted = data.chakras.sort((a: Chakra, b: Chakra) => a.position - b.position);
        console.log('Sorted chakras:', sorted);
        setChakras(sorted);
      }
    } catch (err: any) {
      console.error('Ошибка загрузки чакр:', err.message || err);
    }
  };

  const loadAllConcepts = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?table=chakra_concepts`, {
        headers: { 'X-Auth-Token': token },
      });
      const data = await response.json();
      if (data.chakra_concepts) {
        setAllConcepts(data.chakra_concepts);
      }
    } catch (err) {
      console.error('Ошибка загрузки всех энергий:', err);
    }
  };

  const loadUserData = async () => {
    console.log('loadUserData called, token:', !!token, 'selectedUserId:', selectedUserId);
    if (!token || !selectedUserId) return;

    const selectedUser = users.find((u) => u.id === selectedUserId);
    console.log('selectedUser:', selectedUser);
    
    if (!selectedUser?.chakra_id) {
      console.log('User has no chakra_id assigned');
      setConcepts([]);
      setOrgans([]);
      setSciences([]);
      setResponsibilities([]);
      return;
    }

    try {
      const chakraId = selectedUser.chakra_id;
      console.log('Loading data for chakraId:', chakraId, 'userId:', selectedUserId);
      
      const [conceptsRes, organsRes, sciencesRes, responsibilitiesRes] = await Promise.all([
        fetch(`${ADMIN_API_URL}?table=chakra_concepts&chakra_id=${chakraId}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_organs&chakra_id=${chakraId}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_sciences&chakra_id=${chakraId}`, {
          headers: { 'X-Auth-Token': token },
        }),
        fetch(`${ADMIN_API_URL}?table=chakra_responsibilities&chakra_id=${chakraId}`, {
          headers: { 'X-Auth-Token': token },
        }),
      ]);

      const [conceptsData, organsData, sciencesData, responsibilitiesData] = await Promise.all([
        conceptsRes.json(),
        organsRes.json(),
        sciencesRes.json(),
        responsibilitiesRes.json(),
      ]);

      console.log('Loaded data:', {
        concepts: conceptsData.chakra_concepts?.length || 0,
        organs: organsData.chakra_organs?.length || 0,
        sciences: sciencesData.chakra_sciences?.length || 0,
        responsibilities: responsibilitiesData.chakra_responsibilities?.length || 0
      });

      const userConcepts = (conceptsData.chakra_concepts || []).filter((c: ChakraConcept) => c.user_id === selectedUserId);
      const userOrgans = (organsData.chakra_organs || []).filter((o: ChakraOrgan) => o.user_id === selectedUserId);
      const userSciences = (sciencesData.chakra_sciences || []).filter((s: ChakraScience) => s.user_id === selectedUserId);
      const userResponsibilities = (responsibilitiesData.chakra_responsibilities || []).filter((r: ChakraResponsibility) => r.user_id === selectedUserId);

      console.log('Filtered for user:', {
        concepts: userConcepts.length,
        organs: userOrgans.length,
        sciences: userSciences.length,
        responsibilities: userResponsibilities.length
      });

      setConcepts(userConcepts);
      setOrgans(userOrgans);
      setSciences(userSciences);
      setResponsibilities(userResponsibilities);
    } catch (err) {
      console.error('Ошибка загрузки данных пользователя:', err);
    }
  };

  const handleCreateUser = () => {
    console.log('handleCreateUser called');
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
    console.log('Dialog should open now');
  };

  const handleEditUser = () => {
    console.log('handleEditUser called, selectedUserId:', selectedUserId);
    if (!selectedUserId) {
      console.log('No user selected');
      return;
    }
    const user = users.find((u) => u.id === selectedUserId);
    console.log('Found user:', user);
    if (!user) {
      console.log('User not found in array');
      return;
    }
    
    setEditType('user');
    setEditMode('edit');
    setEditItem({ ...user });
    setEditDialog(true);
    console.log('Dialog should open now for edit');
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
      setShowNewConceptForm(false);
      setSelectedExistingConceptId(null);
      loadAllConcepts();
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

    if (editType === 'concept' && (editMode === 'create' && showNewConceptForm || editMode === 'edit')) {
      const duplicate = allConcepts.find(
        (c) => 
          c.id !== editItem.id &&
          c.concept.toLowerCase().trim() === editItem.concept.toLowerCase().trim() && 
          c.category === editItem.category
      );

      if (duplicate) {
        alert(`Энергия "${editItem.concept}" с категорией "${editItem.category}" уже существует в базе данных.`);
        return;
      }
    }

    if (editType === 'concept' && editMode === 'create' && !showNewConceptForm && selectedExistingConceptId) {
      const existingConcept = allConcepts.find((c) => c.id === selectedExistingConceptId);
      if (!existingConcept) return;

      const newItem = {
        chakra_id: editItem.chakra_id,
        user_id: editItem.user_id,
        concept: existingConcept.concept,
        category: existingConcept.category,
      };

      try {
        const response = await fetch(ADMIN_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': token,
          },
          body: JSON.stringify({ table: 'chakra_concepts', data: newItem }),
        });

        if (response.ok) {
          setEditDialog(false);
          await loadUserData();
        } else {
          const data = await response.json();
          alert(data.error || 'Ошибка сохранения');
        }
      } catch (err) {
        console.error('Ошибка сохранения:', err);
      }
      return;
    }

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
          await loadUsers();
        } else {
          await loadUserData();
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
      loadAllConcepts();
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

  const sortedUsers = [...users].sort((a, b) => {
    const chakraA = chakras.find((c) => c.id === a.chakra_id);
    const chakraB = chakras.find((c) => c.id === b.chakra_id);
    const posA = chakraA?.position ?? 999;
    const posB = chakraB?.position ?? 999;
    if (posA !== posB) return posA - posB;
    return a.name.localeCompare(b.name);
  });

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
              <CardTitle className="text-base">Выбор пользователя</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-2 order-2 sm:order-1">
                  <Button size="sm" onClick={handleCreateUser} className="flex-1 sm:flex-none">
                    <Icon name="Plus" size={16} className="mr-1" />
                    Добавить
                  </Button>
                  {selectedUserId && (
                    <Button size="sm" variant="outline" onClick={handleEditUser} className="flex-1 sm:flex-none">
                      <Icon name="Edit" size={16} className="mr-1" />
                      Редактировать
                    </Button>
                  )}
                </div>
                <div className="flex-1 order-1 sm:order-2">
                  <Select
                    value={selectedUserId?.toString() || ''}
                    onValueChange={(val) => setSelectedUserId(parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите пользователя" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedUsers.map((user) => {
                        const chakra = chakras.find((c) => c.id === user.chakra_id);
                        const label = chakra ? `${chakra.position} - ${user.name}` : user.name;
                        console.log('Rendering user:', user.name, 'chakra_id:', user.chakra_id, 'found chakra:', chakra, 'label:', label);
                        return (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedUserId && selectedUser && (
          <Tabs defaultValue="concepts" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="concepts" className="text-xs">Энергии</TabsTrigger>
              <TabsTrigger value="organs" className="text-xs">Органы</TabsTrigger>
              <TabsTrigger value="sciences" className="text-xs">Науки</TabsTrigger>
              <TabsTrigger value="responsibilities" className="text-xs">За что отвечает</TabsTrigger>
            </TabsList>

            <TabsContent value="concepts" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Энергии</CardTitle>
                    <Button size="sm" onClick={() => handleCreate('concept')}>
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {concepts.map((item) => (
                      <div key={item.id} className="flex justify-between items-start p-3 bg-white rounded border">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.concept}</p>
                          <Badge variant="secondary" className="text-xs mt-1">{item.category}</Badge>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit('concept', item)}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete('concept', item.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {concepts.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organs" className="mt-4">
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
                  <div className="space-y-2">
                    {organs.map((item) => (
                      <div key={item.id} className="flex justify-between items-start p-3 bg-white rounded border">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.organ_name}</p>
                          <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit('organ', item)}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete('organ', item.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {organs.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sciences" className="mt-4">
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
                  <div className="space-y-2">
                    {sciences.map((item) => (
                      <div key={item.id} className="flex justify-between items-start p-3 bg-white rounded border">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.science_name}</p>
                          <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit('science', item)}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete('science', item.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {sciences.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responsibilities" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">За что отвечает</CardTitle>
                    <Button size="sm" onClick={() => handleCreate('responsibility')}>
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {responsibilities.map((item) => (
                      <div key={item.id} className="flex justify-between items-start p-3 bg-white rounded border">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{item.responsibility}</p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit('responsibility', item)}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete('responsibility', item.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {responsibilities.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">Нет данных</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editMode === 'create' ? 'Создать' : 'Редактировать'}{' '}
              {editType === 'concept' && 'энергию'}
              {editType === 'organ' && 'орган'}
              {editType === 'science' && 'науку'}
              {editType === 'responsibility' && 'ответственность'}
              {editType === 'user' && 'пользователя'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editType === 'user' && editItem && (
              <>
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input
                    value={editItem.name || ''}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editItem.email || ''}
                    onChange={(e) => setEditItem({ ...editItem, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telegram ID</Label>
                  <Input
                    value={editItem.telegram_id || ''}
                    onChange={(e) => setEditItem({ ...editItem, telegram_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telegram Username</Label>
                  <Input
                    value={editItem.telegram_username || ''}
                    onChange={(e) => setEditItem({ ...editItem, telegram_username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Чакра</Label>
                  <Select
                    value={editItem.chakra_id?.toString() || 'none'}
                    onValueChange={(val) =>
                      setEditItem({ ...editItem, chakra_id: val === 'none' ? null : parseInt(val) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите чакру" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Не назначена</SelectItem>
                      {chakras.map((chakra) => (
                        <SelectItem key={chakra.id} value={chakra.id.toString()}>
                          {chakra.position} - {chakra.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {editType === 'concept' && editItem && editMode === 'create' && (
              <>
                {!showNewConceptForm ? (
                  <>
                    <div className="space-y-2">
                      <Label>Выбрать существующую энергию</Label>
                      <Select
                        value={selectedExistingConceptId?.toString() || ''}
                        onValueChange={(val) => setSelectedExistingConceptId(parseInt(val))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Поиск энергии..." />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="max-h-[300px] overflow-y-auto">
                            {allConcepts
                              .sort((a, b) => a.concept.localeCompare(b.concept))
                              .map((concept) => (
                                <SelectItem key={concept.id} value={concept.id.toString()}>
                                  {concept.concept} ({concept.category})
                                </SelectItem>
                              ))}
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewConceptForm(true)}
                      className="w-full"
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Создать новую энергию
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Создание новой энергии</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNewConceptForm(false)}
                      >
                        <Icon name="ArrowLeft" size={16} className="mr-1" />
                        Назад
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Энергия</Label>
                      <Input
                        value={editItem.concept || ''}
                        onChange={(e) => setEditItem({ ...editItem, concept: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Категория</Label>
                      <Select
                        value={editItem.category || ''}
                        onValueChange={(val) => setEditItem({ ...editItem, category: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Основная">Основная</SelectItem>
                          <SelectItem value="Дополнительная">Дополнительная</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </>
            )}

            {editType === 'concept' && editItem && editMode === 'edit' && (
              <>
                <div className="space-y-2">
                  <Label>Энергия</Label>
                  <Input
                    value={editItem.concept || ''}
                    onChange={(e) => setEditItem({ ...editItem, concept: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Категория</Label>
                  <Select
                    value={editItem.category || ''}
                    onValueChange={(val) => setEditItem({ ...editItem, category: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Основная">Основная</SelectItem>
                      <SelectItem value="Дополнительная">Дополнительная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {editType === 'organ' && editItem && (
              <>
                <div className="space-y-2">
                  <Label>Название органа</Label>
                  <Input
                    value={editItem.organ_name || ''}
                    onChange={(e) => setEditItem({ ...editItem, organ_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea
                    value={editItem.description || ''}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  />
                </div>
              </>
            )}

            {editType === 'science' && editItem && (
              <>
                <div className="space-y-2">
                  <Label>Название науки</Label>
                  <Input
                    value={editItem.science_name || ''}
                    onChange={(e) => setEditItem({ ...editItem, science_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea
                    value={editItem.description || ''}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  />
                </div>
              </>
            )}

            {editType === 'responsibility' && editItem && (
              <div className="space-y-2">
                <Label>Ответственность</Label>
                <Textarea
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
            <Button 
              onClick={handleSave}
              disabled={
                editType === 'concept' && 
                editMode === 'create' && 
                !showNewConceptForm && 
                !selectedExistingConceptId
              }
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminChakra;