import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
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
  editType: 'concept' | 'organ' | 'science' | 'responsibility' | 'user';
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          {editType === 'organ' && editItem && editMode === 'create' && (
            <>
              {!showNewOrganForm ? (
                <>
                  <div className="space-y-2">
                    <Label>Выбрать существующий орган</Label>
                    <Select
                      value={selectedExistingOrganId?.toString() || ''}
                      onValueChange={(val) => setSelectedExistingOrganId(parseInt(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Поиск органа..." />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="max-h-[300px] overflow-y-auto">
                          {allOrgans
                            .sort((a, b) => a.organ_name.localeCompare(b.organ_name))
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
                    onClick={() => setShowNewOrganForm(true)}
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
                      onClick={() => setShowNewOrganForm(false)}
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
          )}

          {editType === 'organ' && editItem && editMode === 'edit' && (
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

          {editType === 'science' && editItem && editMode === 'create' && (
            <>
              {!showNewScienceForm ? (
                <>
                  <div className="space-y-2">
                    <Label>Выбрать существующую науку</Label>
                    <Select
                      value={selectedExistingScienceId?.toString() || ''}
                      onValueChange={(val) => setSelectedExistingScienceId(parseInt(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Поиск науки..." />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="max-h-[300px] overflow-y-auto">
                          {allSciences
                            .sort((a, b) => a.science_name.localeCompare(b.science_name))
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
                    onClick={() => setShowNewScienceForm(true)}
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
                      onClick={() => setShowNewScienceForm(false)}
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
          )}

          {editType === 'science' && editItem && editMode === 'edit' && (
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

          {editType === 'responsibility' && editItem && editMode === 'create' && (
            <>
              {!showNewResponsibilityForm ? (
                <>
                  <div className="space-y-2">
                    <Label>Выбрать существующую ответственность</Label>
                    <Select
                      value={selectedExistingResponsibilityId?.toString() || ''}
                      onValueChange={(val) => setSelectedExistingResponsibilityId(parseInt(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Поиск..." />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="max-h-[300px] overflow-y-auto">
                          {allResponsibilities
                            .sort((a, b) => a.responsibility.localeCompare(b.responsibility))
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
                    onClick={() => setShowNewResponsibilityForm(true)}
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
                      onClick={() => setShowNewResponsibilityForm(false)}
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
          )}

          {editType === 'responsibility' && editItem && editMode === 'edit' && (
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button 
            onClick={onSave}
            disabled={
              (editType === 'concept' && editMode === 'create' && !showNewConceptForm && !selectedExistingConceptId) ||
              (editType === 'organ' && editMode === 'create' && !showNewOrganForm && !selectedExistingOrganId) ||
              (editType === 'science' && editMode === 'create' && !showNewScienceForm && !selectedExistingScienceId) ||
              (editType === 'responsibility' && editMode === 'create' && !showNewResponsibilityForm && !selectedExistingResponsibilityId)
            }
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChakraEditDialog;
