import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import LoginForm from '@/components/admin/chakra/LoginForm';
import UserSelector from '@/components/admin/chakra/UserSelector';
import ChakraDataTabs from '@/components/admin/chakra/ChakraDataTabs';
import ChakraEditDialog from '@/components/admin/chakra/ChakraEditDialog';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useChakraData } from '@/hooks/useChakraData';
import { useChakraActions } from '@/hooks/useChakraActions';

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
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const auth = useAdminAuth();
  const data = useChakraData(auth.token, selectedUserId);
  const actions = useChakraActions({
    token: auth.token,
    selectedUserId,
    users: data.users,
    concepts: data.concepts,
    organs: data.organs,
    sciences: data.sciences,
    responsibilities: data.responsibilities,
    allConcepts: data.allConcepts,
    allOrgans: data.allOrgans,
    allSciences: data.allSciences,
    allResponsibilities: data.allResponsibilities,
    authFetch: data.authFetch,
    loadAllData: data.loadAllData,
    loadUserData: data.loadUserData,
  });

  if (!auth.isAuthenticated) {
    return (
      <LoginForm
        telegramId={auth.telegramId}
        setTelegramId={auth.setTelegramId}
        telegramGroupId={auth.telegramGroupId}
        setTelegramGroupId={auth.setTelegramGroupId}
        error={auth.error}
        loading={auth.loading}
        onLogin={auth.handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 pb-20">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-emerald-900 truncate">ChakraCraft</h1>
              <p className="text-xs text-emerald-700 truncate">
                {auth.currentUser?.name} {auth.currentUser?.is_admin && '(Админ)'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={auth.handleLogout}
            >
              <Icon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <UserSelector
          currentUser={auth.currentUser}
          users={data.users}
          chakras={data.chakras}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          onCreateUser={actions.handleCreateUser}
          onEditUser={actions.handleEditUser}
        />

        {selectedUserId && data.selectedUser && (
          <ChakraDataTabs
            concepts={data.concepts}
            organs={data.organs}
            sciences={data.sciences}
            responsibilities={data.responsibilities}
            onCreateConcept={() => {
              console.log('🟣 AdminChakra: onCreateConcept вызван');
              actions.handleCreate('concept');
            }}
            onEditConcept={(item) => {
              console.log('🟣 AdminChakra: onEditConcept вызван, item:', item);
              actions.handleEdit('concept', item);
            }}
            onDeleteConcept={(id) => actions.handleDelete('concept', id)}
            onCreateOrgan={() => actions.handleCreate('organ')}
            onEditOrgan={(item) => actions.handleEdit('organ', item)}
            onDeleteOrgan={(id) => actions.handleDelete('organ', id)}
            onCreateScience={() => actions.handleCreate('science')}
            onEditScience={(item) => actions.handleEdit('science', item)}
            onDeleteScience={(id) => actions.handleDelete('science', id)}
            onCreateResponsibility={() => actions.handleCreate('responsibility')}
            onEditResponsibility={(item) => actions.handleEdit('responsibility', item)}
            onDeleteResponsibility={(id) => actions.handleDelete('responsibility', id)}
          />
        )}
      </div>

      <ChakraEditDialog
        open={actions.editDialog}
        onOpenChange={actions.setEditDialog}
        type={actions.editType}
        mode={actions.editMode}
        item={actions.editItem}
        setItem={actions.setEditItem}
        onSave={actions.handleSave}
        chakras={data.chakras}
        allConcepts={data.allConcepts}
        allOrgans={data.allOrgans}
        allSciences={data.allSciences}
        allResponsibilities={data.allResponsibilities}
        showNewConceptForm={actions.showNewConceptForm}
        setShowNewConceptForm={actions.setShowNewConceptForm}
        selectedExistingConceptId={actions.selectedExistingConceptId}
        setSelectedExistingConceptId={actions.setSelectedExistingConceptId}
        showNewOrganForm={actions.showNewOrganForm}
        setShowNewOrganForm={actions.setShowNewOrganForm}
        selectedExistingOrganId={actions.selectedExistingOrganId}
        setSelectedExistingOrganId={actions.setSelectedExistingOrganId}
        showNewScienceForm={actions.showNewScienceForm}
        setShowNewScienceForm={actions.setShowNewScienceForm}
        selectedExistingScienceId={actions.selectedExistingScienceId}
        setSelectedExistingScienceId={actions.setSelectedExistingScienceId}
        showNewResponsibilityForm={actions.showNewResponsibilityForm}
        setShowNewResponsibilityForm={actions.setShowNewResponsibilityForm}
        selectedExistingResponsibilityId={actions.selectedExistingResponsibilityId}
        setSelectedExistingResponsibilityId={actions.setSelectedExistingResponsibilityId}
      />
    </div>
  );
};

export default AdminChakra;