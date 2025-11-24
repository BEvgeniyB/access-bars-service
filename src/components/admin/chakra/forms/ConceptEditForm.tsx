import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChakraConcept {
  id: number;
  chakra_id: number;
  concept: string;
  category: string;
  user_id: number;
}

interface ConceptEditFormProps {
  editMode: 'create' | 'edit';
  editItem: any;
  setEditItem: (item: any) => void;
  allConcepts: ChakraConcept[];
  showNewConceptForm: boolean;
  setShowNewConceptForm: (show: boolean) => void;
  selectedExistingConceptId: number | null;
  setSelectedExistingConceptId: (id: number | null) => void;
}

const ConceptEditForm = ({
  editMode,
  editItem,
  setEditItem,
  allConcepts,
  showNewConceptForm,
  setShowNewConceptForm,
  selectedExistingConceptId,
  setSelectedExistingConceptId,
}: ConceptEditFormProps) => {
  if (!editItem) return null;

  if (editMode === 'create') {
    return (
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
    );
  }

  return (
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
  );
};

export default ConceptEditForm;
