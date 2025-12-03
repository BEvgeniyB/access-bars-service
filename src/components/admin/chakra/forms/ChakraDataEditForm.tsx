import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

interface ChakraBasicNeed {
  id: number;
  chakra_id: number;
  basic_need: string;
  description: string;
  user_id: number;
}

interface ChakraDataEditFormProps {
  editType: 'organ' | 'science' | 'responsibility' | 'basic_need';
  editMode: 'create' | 'edit';
  editItem: any;
  setEditItem: (item: any) => void;
  allOrgans?: ChakraOrgan[];
  showNewOrganForm?: boolean;
  setShowNewOrganForm?: (show: boolean) => void;
  selectedExistingOrganId?: number | null;
  setSelectedExistingOrganId?: (id: number | null) => void;
  allSciences?: ChakraScience[];
  showNewScienceForm?: boolean;
  setShowNewScienceForm?: (show: boolean) => void;
  selectedExistingScienceId?: number | null;
  setSelectedExistingScienceId?: (id: number | null) => void;
  allResponsibilities?: ChakraResponsibility[];
  showNewResponsibilityForm?: boolean;
  setShowNewResponsibilityForm?: (show: boolean) => void;
  selectedExistingResponsibilityId?: number | null;
  setSelectedExistingResponsibilityId?: (id: number | null) => void;
}

const ChakraDataEditForm = ({
  editType,
  editMode,
  editItem,
  setEditItem,
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
}: ChakraDataEditFormProps) => {
  if (!editItem) return null;

  if (editType === 'organ') {
    if (editMode === 'create') {
      return (
        <>
          {!showNewOrganForm ? (
            <>
              <div className="space-y-2">
                <Label>Выбрать существующий орган</Label>
                <Select
                  value={selectedExistingOrganId?.toString() || ''}
                  onValueChange={(val) => setSelectedExistingOrganId?.(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Поиск органа..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="max-h-[300px] overflow-y-auto">
                      {allOrgans
                        ?.sort((a, b) => a.organ_name.localeCompare(b.organ_name))
                        .map((organ) => (
                          <SelectItem key={organ.id} value={organ.id.toString()}>
                            {organ.organ_name}
                          </SelectItem>
                        ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewOrganForm?.(true)}
                className="w-full"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Создать новый орган
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <Label>Создание нового органа</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewOrganForm?.(false)}
                >
                  <Icon name="ArrowLeft" size={16} className="mr-1" />
                  Назад
                </Button>
              </div>
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
        </>
      );
    }

    return (
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
    );
  }

  if (editType === 'science') {
    if (editMode === 'create') {
      return (
        <>
          {!showNewScienceForm ? (
            <>
              <div className="space-y-2">
                <Label>Выбрать существующую науку</Label>
                <Select
                  value={selectedExistingScienceId?.toString() || ''}
                  onValueChange={(val) => setSelectedExistingScienceId?.(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Поиск науки..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="max-h-[300px] overflow-y-auto">
                      {allSciences
                        ?.sort((a, b) => a.science_name.localeCompare(b.science_name))
                        .map((science) => (
                          <SelectItem key={science.id} value={science.id.toString()}>
                            {science.science_name}
                          </SelectItem>
                        ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewScienceForm?.(true)}
                className="w-full"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Создать новую науку
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <Label>Создание новой науки</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewScienceForm?.(false)}
                >
                  <Icon name="ArrowLeft" size={16} className="mr-1" />
                  Назад
                </Button>
              </div>
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
        </>
      );
    }

    return (
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
    );
  }

  if (editType === 'responsibility') {
    if (editMode === 'create') {
      return (
        <>
          {!showNewResponsibilityForm ? (
            <>
              <div className="space-y-2">
                <Label>Выбрать существующую ответственность</Label>
                <Select
                  value={selectedExistingResponsibilityId?.toString() || ''}
                  onValueChange={(val) => setSelectedExistingResponsibilityId?.(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Поиск..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="max-h-[300px] overflow-y-auto">
                      {allResponsibilities
                        ?.sort((a, b) => a.responsibility.localeCompare(b.responsibility))
                        .map((resp) => (
                          <SelectItem key={resp.id} value={resp.id.toString()}>
                            {resp.responsibility}
                          </SelectItem>
                        ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewResponsibilityForm?.(true)}
                className="w-full"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Создать новую ответственность
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <Label>Создание новой ответственности</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewResponsibilityForm?.(false)}
                >
                  <Icon name="ArrowLeft" size={16} className="mr-1" />
                  Назад
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Ответственность</Label>
                <Textarea
                  value={editItem.responsibility || ''}
                  onChange={(e) => setEditItem({ ...editItem, responsibility: e.target.value })}
                />
              </div>
            </>
          )}
        </>
      );
    }

    return (
      <div className="space-y-2">
        <Label>Ответственность</Label>
        <Textarea
          value={editItem.responsibility || ''}
          onChange={(e) => setEditItem({ ...editItem, responsibility: e.target.value })}
        />
      </div>
    );
  }

  if (editType === 'basic_need') {
    return (
      <>
        <div className="space-y-2">
          <Label>Базовая потребность</Label>
          <Input
            value={editItem.basic_need || ''}
            onChange={(e) => setEditItem({ ...editItem, basic_need: e.target.value })}
            placeholder="Например: Сон, Еда, Движение"
          />
        </div>
        <div className="space-y-2">
          <Label>Описание</Label>
          <Textarea
            value={editItem.description || ''}
            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
            placeholder="Подробное описание потребности"
          />
        </div>
      </>
    );
  }

  return null;
};

export default ChakraDataEditForm;