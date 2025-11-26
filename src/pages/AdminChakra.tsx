import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import LoginForm from '@/components/admin/chakra/LoginForm';
import UserSelector from '@/components/admin/chakra/UserSelector';
import ChakraDataTabs from '@/components/admin/chakra/ChakraDataTabs';
import ChakraEditDialog from '@/components/admin/chakra/ChakraEditDialog';

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

  const [allOrgans, setAllOrgans] = useState<ChakraOrgan[]>([]);
  const [showNewOrganForm, setShowNewOrganForm] = useState(false);
  const [selectedExistingOrganId, setSelectedExistingOrganId] = useState<number | null>(null);

  const [allSciences, setAllSciences] = useState<ChakraScience[]>([]);
  const [showNewScienceForm, setShowNewScienceForm] = useState(false);
  const [selectedExistingScienceId, setSelectedExistingScienceId] = useState<number | null>(null);

  const [allResponsibilities, setAllResponsibilities] = useState<ChakraResponsibility[]>([]);
  const [showNewResponsibilityForm, setShowNewResponsibilityForm] = useState(false);
  const [selectedExistingResponsibilityId, setSelectedExistingResponsibilityId] = useState<number | null>(null);

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

  const loadAllData = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?action=get_all_data`, {
        headers: { 'X-Auth-Token': token },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Loaded all data:', data);
      
      if (data.users) {
        setUsers(data.users);
      }
      
      if (data.chakras) {
        const sorted = data.chakras.sort((a: Chakra, b: Chakra) => a.position - b.position);
        setChakras(sorted);
      }
      
      if (data.chakra_concepts) {
        setAllConcepts(data.chakra_concepts);
      }
      
      if (data.chakra_organs) {
        setAllOrgans(data.chakra_organs);
      }
      
      if (data.chakra_sciences) {
        setAllSciences(data.chakra_sciences);
      }
      
      if (data.chakra_responsibilities) {
        setAllResponsibilities(data.chakra_responsibilities);
      }
    } catch (err: any) {
      console.error('Ошибка загрузки данных:', err.message || err);
    }
  };

  const loadAllConcepts = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?action=get_all_data`, {
        headers: { 'X-Auth-Token': token },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.chakra_concepts) {
        setAllConcepts(data.chakra_concepts);
      }
    } catch (err: any) {
      console.error('Ошибка загрузки концепций:', err.message || err);
    }
  };

  const loadAllOrgans = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?action=get_all_data`, {
        headers: { 'X-Auth-Token': token },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.chakra_organs) {
        setAllOrgans(data.chakra_organs);
      }
    } catch (err: any) {
      console.error('Ошибка загрузки органов:', err.message || err);
    }
  };

  const loadAllSciences = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?action=get_all_data`, {
        headers: { 'X-Auth-Token': token },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.chakra_sciences) {
        setAllSciences(data.chakra_sciences);
      }
    } catch (err: any) {
      console.error('Ошибка загрузки наук:', err.message || err);
    }
  };

  const loadAllResponsibilities = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?action=get_all_data`, {
        headers: { 'X-Auth-Token': token },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.chakra_responsibilities) {
        setAllResponsibilities(data.chakra_responsibilities);
      }
    } catch (err: any) {
      console.error('Ошибка загрузки ответственностей:', err.message || err);
    }
  };

  const loadUsers = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}?action=get_all_data`, {
        headers: { 'X-Auth-Token': token },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err: any) {
      console.error('Ошибка загрузки пользователей:', err.message || err);
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
      setShowNewOrganForm(false);
      setSelectedExistingOrganId(null);
      loadAllOrgans();
    } else if (type === 'science') {
      newItem.science_name = '';
      newItem.description = '';
      setShowNewScienceForm(false);
      setSelectedExistingScienceId(null);
      loadAllSciences();
    } else if (type === 'responsibility') {
      newItem.responsibility = '';
      setShowNewResponsibilityForm(false);
      setSelectedExistingResponsibilityId(null);
      loadAllResponsibilities();
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

    if (editType === 'organ' && (editMode === 'create' && showNewOrganForm || editMode === 'edit')) {
      const duplicate = allOrgans.find(
        (o) => 
          o.id !== editItem.id &&
          o.organ_name.toLowerCase().trim() === editItem.organ_name.toLowerCase().trim()
      );

      if (duplicate) {
        alert(`Орган "${editItem.organ_name}" уже существует в базе данных.`);
        return;
      }
    }

    if (editType === 'science' && (editMode === 'create' && showNewScienceForm || editMode === 'edit')) {
      const duplicate = allSciences.find(
        (s) => 
          s.id !== editItem.id &&
          s.science_name.toLowerCase().trim() === editItem.science_name.toLowerCase().trim()
      );

      if (duplicate) {
        alert(`Наука "${editItem.science_name}" уже существует в базе данных.`);
        return;
      }
    }

    if (editType === 'responsibility' && (editMode === 'create' && showNewResponsibilityForm || editMode === 'edit')) {
      const duplicate = allResponsibilities.find(
        (r) => 
          r.id !== editItem.id &&
          r.responsibility.toLowerCase().trim() === editItem.responsibility.toLowerCase().trim()
      );

      if (duplicate) {
        alert(`Ответственность "${editItem.responsibility}" уже существует в базе данных.`);
        return;
      }
    }

    if (editType === 'concept' && editMode === 'create' && !showNewConceptForm && selectedExistingConceptId) {
      const existingConcept = allConcepts.find((c) => c.id === selectedExistingConceptId);
      if (!existingConcept) return;

      const duplicateForUser = concepts.find(
        (c) => 
          c.concept.toLowerCase().trim() === existingConcept.concept.toLowerCase().trim() && 
          c.category === existingConcept.category
      );

      if (duplicateForUser) {
        alert(`Энергия "${existingConcept.concept}" с категорией "${existingConcept.category}" уже добавлена для этого пользователя.`);
        return;
      }

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

    if (editType === 'organ' && editMode === 'create' && !showNewOrganForm && selectedExistingOrganId) {
      const existingOrgan = allOrgans.find((o) => o.id === selectedExistingOrganId);
      if (!existingOrgan) return;

      const duplicateForUser = organs.find(
        (o) => o.organ_name.toLowerCase().trim() === existingOrgan.organ_name.toLowerCase().trim()
      );

      if (duplicateForUser) {
        alert(`Орган "${existingOrgan.organ_name}" уже добавлен для этого пользователя.`);
        return;
      }

      const newItem = {
        chakra_id: editItem.chakra_id,
        user_id: editItem.user_id,
        organ_name: existingOrgan.organ_name,
        description: existingOrgan.description,
      };

      try {
        const response = await fetch(ADMIN_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': token,
          },
          body: JSON.stringify({ table: 'chakra_organs', data: newItem }),
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

    if (editType === 'science' && editMode === 'create' && !showNewScienceForm && selectedExistingScienceId) {
      const existingScience = allSciences.find((s) => s.id === selectedExistingScienceId);
      if (!existingScience) return;

      const duplicateForUser = sciences.find(
        (s) => s.science_name.toLowerCase().trim() === existingScience.science_name.toLowerCase().trim()
      );

      if (duplicateForUser) {
        alert(`Наука "${existingScience.science_name}" уже добавлена для этого пользователя.`);
        return;
      }

      const newItem = {
        chakra_id: editItem.chakra_id,
        user_id: editItem.user_id,
        science_name: existingScience.science_name,
        description: existingScience.description,
      };

      try {
        const response = await fetch(ADMIN_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': token,
          },
          body: JSON.stringify({ table: 'chakra_sciences', data: newItem }),
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

    if (editType === 'responsibility' && editMode === 'create' && !showNewResponsibilityForm && selectedExistingResponsibilityId) {
      const existingResponsibility = allResponsibilities.find((r) => r.id === selectedExistingResponsibilityId);
      if (!existingResponsibility) return;

      const duplicateForUser = responsibilities.find(
        (r) => r.responsibility.toLowerCase().trim() === existingResponsibility.responsibility.toLowerCase().trim()
      );

      if (duplicateForUser) {
        alert(`Ответственность "${existingResponsibility.responsibility}" уже добавлена для этого пользователя.`);
        return;
      }

      const newItem = {
        chakra_id: editItem.chakra_id,
        user_id: editItem.user_id,
        responsibility: existingResponsibility.responsibility,
      };

      try {
        const response = await fetch(ADMIN_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': token,
          },
          body: JSON.stringify({ table: 'chakra_responsibilities', data: newItem }),
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
      loadAllData();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated && token && selectedUserId) {
      loadUserData();
    }
  }, [selectedUserId, isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <LoginForm
        telegramId={telegramId}
        setTelegramId={setTelegramId}
        telegramGroupId={telegramGroupId}
        setTelegramGroupId={setTelegramGroupId}
        error={error}
        loading={loading}
        onLogin={handleLogin}
      />
    );
  }

  const selectedUser = users.find((u) => u.id === selectedUserId);

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
        <UserSelector
          currentUser={currentUser}
          users={users}
          chakras={chakras}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          onCreateUser={handleCreateUser}
          onEditUser={handleEditUser}
        />

        {selectedUserId && selectedUser && (
          <ChakraDataTabs
            concepts={concepts}
            organs={organs}
            sciences={sciences}
            responsibilities={responsibilities}
            onCreateConcept={() => handleCreate('concept')}
            onEditConcept={(item) => handleEdit('concept', item)}
            onDeleteConcept={(id) => handleDelete('concept', id)}
            onCreateOrgan={() => handleCreate('organ')}
            onEditOrgan={(item) => handleEdit('organ', item)}
            onDeleteOrgan={(id) => handleDelete('organ', id)}
            onCreateScience={() => handleCreate('science')}
            onEditScience={(item) => handleEdit('science', item)}
            onDeleteScience={(id) => handleDelete('science', id)}
            onCreateResponsibility={() => handleCreate('responsibility')}
            onEditResponsibility={(item) => handleEdit('responsibility', item)}
            onDeleteResponsibility={(id) => handleDelete('responsibility', id)}
          />
        )}
      </div>

      <ChakraEditDialog
        open={editDialog}
        onOpenChange={setEditDialog}
        editType={editType}
        editMode={editMode}
        editItem={editItem}
        setEditItem={setEditItem}
        chakras={chakras}
        allConcepts={allConcepts}
        showNewConceptForm={showNewConceptForm}
        setShowNewConceptForm={setShowNewConceptForm}
        selectedExistingConceptId={selectedExistingConceptId}
        setSelectedExistingConceptId={setSelectedExistingConceptId}
        allOrgans={allOrgans}
        showNewOrganForm={showNewOrganForm}
        setShowNewOrganForm={setShowNewOrganForm}
        selectedExistingOrganId={selectedExistingOrganId}
        setSelectedExistingOrganId={setSelectedExistingOrganId}
        allSciences={allSciences}
        showNewScienceForm={showNewScienceForm}
        setShowNewScienceForm={setShowNewScienceForm}
        selectedExistingScienceId={selectedExistingScienceId}
        setSelectedExistingScienceId={setSelectedExistingScienceId}
        allResponsibilities={allResponsibilities}
        showNewResponsibilityForm={showNewResponsibilityForm}
        setShowNewResponsibilityForm={setShowNewResponsibilityForm}
        selectedExistingResponsibilityId={selectedExistingResponsibilityId}
        setSelectedExistingResponsibilityId={setSelectedExistingResponsibilityId}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminChakra;