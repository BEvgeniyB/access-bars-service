import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UserEditForm from './forms/UserEditForm';
import ConceptEditForm from './forms/ConceptEditForm';
import ChakraDataEditForm from './forms/ChakraDataEditForm';

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

interface ChakraEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editType: 'concept' | 'organ' | 'science' | 'responsibility' | 'basic_need' | 'user';
  editMode: 'create' | 'edit';
  editItem: any;
  setEditItem: (item: any) => void;
  chakras: Chakra[];
  allConcepts: ChakraConcept[];
  showNewConceptForm: boolean;
  setShowNewConceptForm: (show: boolean) => void;
  selectedExistingConceptId: number | null;
  setSelectedExistingConceptId: (id: number | null) => void;
  allOrgans: ChakraOrgan[];
  showNewOrganForm: boolean;
  setShowNewOrganForm: (show: boolean) => void;
  selectedExistingOrganId: number | null;
  setSelectedExistingOrganId: (id: number | null) => void;
  allSciences: ChakraScience[];
  showNewScienceForm: boolean;
  setShowNewScienceForm: (show: boolean) => void;
  selectedExistingScienceId: number | null;
  setSelectedExistingScienceId: (id: number | null) => void;
  allResponsibilities: ChakraResponsibility[];
  showNewResponsibilityForm: boolean;
  setShowNewResponsibilityForm: (show: boolean) => void;
  selectedExistingResponsibilityId: number | null;
  setSelectedExistingResponsibilityId: (id: number | null) => void;
  onSave: () => void;
}

const ChakraEditDialog = ({
  open,
  onOpenChange,
  editType,
  editMode,
  editItem,
  setEditItem,
  chakras,
  allConcepts,
  showNewConceptForm,
  setShowNewConceptForm,
  selectedExistingConceptId,
  setSelectedExistingConceptId,
  allOrgans,
  showNewOrganForm,
  setShowNewOrganForm,
  selectedExistingOrganId,
  setSelectedExistingOrganId,
  allSciences,
  showNewScienceForm,
  setShowNewScienceForm,
  selectedExistingScienceId,
  setSelectedExistingScienceId,
  allResponsibilities,
  showNewResponsibilityForm,
  setShowNewResponsibilityForm,
  selectedExistingResponsibilityId,
  setSelectedExistingResponsibilityId,
  onSave,
}: ChakraEditDialogProps) => {
  const getDialogTitle = () => {
    const action = editMode === 'create' ? 'Создать' : 'Редактировать';
    const entityMap = {
      concept: 'энергию',
      organ: 'орган',
      science: 'науку',
      responsibility: 'ответственность',
      basic_need: 'базовую потребность',
      user: 'пользователя',
    };
    return `${action} ${entityMap[editType]}`;
  };

  const isSaveDisabled = () => {
    return (
      (editType === 'concept' && editMode === 'create' && !showNewConceptForm && !selectedExistingConceptId) ||
      (editType === 'organ' && editMode === 'create' && !showNewOrganForm && !selectedExistingOrganId) ||
      (editType === 'science' && editMode === 'create' && !showNewScienceForm && !selectedExistingScienceId) ||
      (editType === 'responsibility' && editMode === 'create' && !showNewResponsibilityForm && !selectedExistingResponsibilityId)
    );
  };

  console.log('🎨 ChakraEditDialog render:', { open, editType, editMode, editItem });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            Заполните поля формы и нажмите "Сохранить"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {editType === 'user' && (
            <UserEditForm
              editItem={editItem}
              setEditItem={setEditItem}
              chakras={chakras}
            />
          )}

          {editType === 'concept' && (
            <ConceptEditForm
              editMode={editMode}
              editItem={editItem}
              setEditItem={setEditItem}
              allConcepts={allConcepts}
              showNewConceptForm={showNewConceptForm}
              setShowNewConceptForm={setShowNewConceptForm}
              selectedExistingConceptId={selectedExistingConceptId}
              setSelectedExistingConceptId={setSelectedExistingConceptId}
            />
          )}

          {(editType === 'organ' || editType === 'science' || editType === 'responsibility' || editType === 'basic_need') && (
            <ChakraDataEditForm
              editType={editType}
              editMode={editMode}
              editItem={editItem}
              setEditItem={setEditItem}
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
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onSave} disabled={isSaveDisabled()}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChakraEditDialog;