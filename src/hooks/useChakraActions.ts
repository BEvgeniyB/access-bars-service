import { useState } from 'react';

const ADMIN_API_URL = 'https://functions.poehali.dev/9471e2dc-0dfa-4927-9d58-74f7dc75819c';

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

interface UseChakraActionsProps {
  token: string | null;
  selectedUserId: number | null;
  users: User[];
  concepts: ChakraConcept[];
  organs: ChakraOrgan[];
  sciences: ChakraScience[];
  responsibilities: ChakraResponsibility[];
  allConcepts: ChakraConcept[];
  allOrgans: ChakraOrgan[];
  allSciences: ChakraScience[];
  allResponsibilities: ChakraResponsibility[];
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  loadAllData: () => Promise<void>;
  loadUserData: () => Promise<void>;
}

export const useChakraActions = ({
  token,
  selectedUserId,
  users,
  concepts,
  organs,
  sciences,
  responsibilities,
  allConcepts,
  allOrgans,
  allSciences,
  allResponsibilities,
  authFetch,
  loadAllData,
  loadUserData,
}: UseChakraActionsProps) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    type: 'concept' as 'concept' | 'organ' | 'science' | 'responsibility' | 'user',
    mode: 'create' as 'create' | 'edit',
    item: null as any,
  });
  
  const [showNewConceptForm, setShowNewConceptForm] = useState(false);
  const [selectedExistingConceptId, setSelectedExistingConceptId] = useState<number | null>(null);

  const [showNewOrganForm, setShowNewOrganForm] = useState(false);
  const [selectedExistingOrganId, setSelectedExistingOrganId] = useState<number | null>(null);

  const [showNewScienceForm, setShowNewScienceForm] = useState(false);
  const [selectedExistingScienceId, setSelectedExistingScienceId] = useState<number | null>(null);

  const [showNewResponsibilityForm, setShowNewResponsibilityForm] = useState(false);
  const [selectedExistingResponsibilityId, setSelectedExistingResponsibilityId] = useState<number | null>(null);

  const handleCreateUser = () => {
    setDialogState({
      open: true,
      type: 'user',
      mode: 'create',
      item: {
        name: '',
        email: '',
        telegram_id: '',
        telegram_username: '',
        chakra_id: null,
        role: 'responsible',
        is_admin: false,
      },
    });
  };

  const handleEditUser = () => {
    if (!selectedUserId) {
      return;
    }
    const user = users.find((u) => u.id === selectedUserId);
    if (!user) {
      return;
    }
    
    setDialogState({
      open: true,
      type: 'user',
      mode: 'edit',
      item: { ...user },
    });
  };

  const handleCreate = (type: 'concept' | 'organ' | 'science' | 'responsibility') => {
    console.log('🟢 handleCreate вызван:', { type, selectedUserId });
    const selectedUser = users.find((u) => u.id === selectedUserId);
    console.log('👤 Найден пользователь:', selectedUser);
    
    if (!selectedUser?.chakra_id) {
      console.log('❌ У пользователя нет chakra_id');
      alert('Сначала назначьте пользователю чакру');
      return;
    }

    const newItem: any = {
      chakra_id: selectedUser.chakra_id,
      user_id: selectedUserId,
    };

    if (type === 'concept') {
      newItem.concept = '';
      newItem.category = '';
      setShowNewConceptForm(false);
      setSelectedExistingConceptId(null);
      loadAllData();
    } else if (type === 'organ') {
      newItem.organ_name = '';
      newItem.description = '';
      setShowNewOrganForm(false);
      setSelectedExistingOrganId(null);
      loadAllData();
    } else if (type === 'science') {
      newItem.science_name = '';
      newItem.description = '';
      setShowNewScienceForm(false);
      setSelectedExistingScienceId(null);
      loadAllData();
    } else if (type === 'responsibility') {
      newItem.responsibility = '';
      setShowNewResponsibilityForm(false);
      setSelectedExistingResponsibilityId(null);
      loadAllData();
    }

    console.log('📋 Создан новый item:', newItem);
    console.log('📝 Установка dialogState:', { type, mode: 'create', item: newItem });
    
    setDialogState({
      open: true,
      type,
      mode: 'create',
      item: newItem,
    });
    
    console.log('✅ dialogState установлен, диалог открывается');
  };

  const handleEdit = (type: 'concept' | 'organ' | 'science' | 'responsibility', item: any) => {
    console.log('🟡 handleEdit вызван:', { type, item });
    setDialogState({
      open: true,
      type,
      mode: 'edit',
      item: { ...item },
    });
    console.log('✅ Диалог редактирования установлен');
  };

  const addExistingItemToUser = async (
    type: 'concept' | 'organ' | 'science' | 'responsibility',
    existingItem: any,
    tableName: string,
    checkDuplicate: (item: any) => boolean,
    duplicateMessage: string,
    mapItemData: (item: any) => any
  ) => {
    if (checkDuplicate(existingItem)) {
      alert(duplicateMessage);
      return false;
    }

    const newItem = {
      chakra_id: editItem.chakra_id,
      user_id: editItem.user_id,
      ...mapItemData(existingItem),
    };

    try {
      const response = await authFetch(ADMIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: tableName, data: newItem }),
      });

      if (response.ok) {
        return true;
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка сохранения');
        return false;
      }
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      return false;
    }
  };

  const handleSave = async () => {
    const { item: editItem, type: editType, mode: editMode } = dialogState;
    if (!token || !editItem) return;

    if (editType === 'concept' && editMode === 'create' && showNewConceptForm) {
      if (!editItem.concept?.trim() || !editItem.category?.trim()) {
        alert('Заполните все обязательные поля: концепт и категория');
        return;
      }
    }

    if (editType === 'organ' && editMode === 'create' && showNewOrganForm) {
      if (!editItem.organ_name?.trim()) {
        alert('Заполните название органа');
        return;
      }
    }

    if (editType === 'science' && editMode === 'create' && showNewScienceForm) {
      if (!editItem.science_name?.trim()) {
        alert('Заполните название науки');
        return;
      }
    }

    if (editType === 'responsibility' && editMode === 'create' && showNewResponsibilityForm) {
      if (!editItem.responsibility?.trim()) {
        alert('Заполните ответственность');
        return;
      }
    }

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

      const success = await addExistingItemToUser(
        'concept',
        existingConcept,
        'chakra_concepts',
        (item) => concepts.find(
          (c) => c.concept.toLowerCase().trim() === item.concept.toLowerCase().trim() && c.category === item.category
        ) !== undefined,
        `Энергия "${existingConcept.concept}" с категорией "${existingConcept.category}" уже добавлена для этого пользователя.`,
        (item) => ({ concept: item.concept, category: item.category })
      );
      if (success) setDialogState(prev => ({ ...prev, open: false }));
      return;
    }

    if (editType === 'organ' && editMode === 'create' && !showNewOrganForm && selectedExistingOrganId) {
      const existingOrgan = allOrgans.find((o) => o.id === selectedExistingOrganId);
      if (!existingOrgan) return;

      await addExistingItemToUser(
        'organ',
        existingOrgan,
        'chakra_organs',
        (item) => organs.find((o) => o.organ_name.toLowerCase().trim() === item.organ_name.toLowerCase().trim()) !== undefined,
        `Орган "${existingOrgan.organ_name}" уже добавлен для этого пользователя.`,
        (item) => ({ organ_name: item.organ_name, description: item.description })
      );
      return;
    }

    if (editType === 'science' && editMode === 'create' && !showNewScienceForm && selectedExistingScienceId) {
      const existingScience = allSciences.find((s) => s.id === selectedExistingScienceId);
      if (!existingScience) return;

      await addExistingItemToUser(
        'science',
        existingScience,
        'chakra_sciences',
        (item) => sciences.find((s) => s.science_name.toLowerCase().trim() === item.science_name.toLowerCase().trim()) !== undefined,
        `Наука "${existingScience.science_name}" уже добавлена для этого пользователя.`,
        (item) => ({ science_name: item.science_name, description: item.description })
      );
      return;
    }

    if (editType === 'responsibility' && editMode === 'create' && !showNewResponsibilityForm && selectedExistingResponsibilityId) {
      const existingResponsibility = allResponsibilities.find((r) => r.id === selectedExistingResponsibilityId);
      if (!existingResponsibility) return;

      await addExistingItemToUser(
        'responsibility',
        existingResponsibility,
        'chakra_responsibilities',
        (item) => responsibilities.find((r) => r.responsibility.toLowerCase().trim() === item.responsibility.toLowerCase().trim()) !== undefined,
        `Ответственность "${existingResponsibility.responsibility}" уже добавлена для этого пользователя.`,
        (item) => ({ responsibility: item.responsibility })
      );
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
      const response = await authFetch(ADMIN_API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, data: editItem }),
      });

      if (response.ok) {
        setDialogState(prev => ({ ...prev, open: false }));
        await loadAllData();
        await loadUserData();
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка сохранения');
      }
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  const handleDelete = async (type: 'concept' | 'organ' | 'science' | 'responsibility', id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
      return;
    }

    const tableMap = {
      concept: 'chakra_concepts',
      organ: 'chakra_organs',
      science: 'chakra_sciences',
      responsibility: 'chakra_responsibilities',
    };

    const table = tableMap[type];

    try {
      const response = await authFetch(ADMIN_API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, id }),
      });

      if (response.ok) {
        await loadUserData();
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка удаления');
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  return {
    editDialog: dialogState.open,
    setEditDialog: (open: boolean) => setDialogState(prev => ({ ...prev, open })),
    editType: dialogState.type,
    setEditType: (type: any) => setDialogState(prev => ({ ...prev, type })),
    editItem: dialogState.item,
    setEditItem: (item: any) => setDialogState(prev => ({ ...prev, item })),
    editMode: dialogState.mode,
    setEditMode: (mode: any) => setDialogState(prev => ({ ...prev, mode })),
    showNewConceptForm,
    setShowNewConceptForm,
    selectedExistingConceptId,
    setSelectedExistingConceptId,
    showNewOrganForm,
    setShowNewOrganForm,
    selectedExistingOrganId,
    setSelectedExistingOrganId,
    showNewScienceForm,
    setShowNewScienceForm,
    selectedExistingScienceId,
    setSelectedExistingScienceId,
    showNewResponsibilityForm,
    setShowNewResponsibilityForm,
    selectedExistingResponsibilityId,
    setSelectedExistingResponsibilityId,
    handleCreateUser,
    handleEditUser,
    handleCreate,
    handleEdit,
    handleSave,
    handleDelete,
  };
};