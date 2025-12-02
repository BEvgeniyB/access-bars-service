import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

interface UserChakraCardProps {
  concepts: ChakraConcept[];
  organs: ChakraOrgan[];
  sciences: ChakraScience[];
  responsibilities: ChakraResponsibility[];
  onCreateConcept: () => void;
  onEditConcept: (item: ChakraConcept) => void;
  onDeleteConcept: (id: number) => void;
  onCreateOrgan: () => void;
  onEditOrgan: (item: ChakraOrgan) => void;
  onDeleteOrgan: (id: number) => void;
  onCreateScience: () => void;
  onEditScience: (item: ChakraScience) => void;
  onDeleteScience: (id: number) => void;
  onCreateResponsibility: () => void;
  onEditResponsibility: (item: ChakraResponsibility) => void;
  onDeleteResponsibility: (id: number) => void;
}

const UserChakraCard = memo(({
  concepts,
  organs,
  sciences,
  responsibilities,
  onCreateConcept,
  onEditConcept,
  onDeleteConcept,
  onCreateOrgan,
  onEditOrgan,
  onDeleteOrgan,
  onCreateScience,
  onEditScience,
  onDeleteScience,
  onCreateResponsibility,
  onEditResponsibility,
  onDeleteResponsibility,
}: UserChakraCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Данные чакры пользователя</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Энергии */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Энергии</h3>
            <Button size="sm" onClick={onCreateConcept}>
              <Icon name="Plus" size={14} className="mr-1" />
              Создать
            </Button>
          </div>
          <div className="space-y-2">
            {concepts.map((concept) => (
              <div key={concept.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div>
                  <span className="font-medium">{concept.concept}</span>
                  <span className="text-xs text-muted-foreground ml-2">({concept.category})</span>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => onEditConcept(concept)}>
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDeleteConcept(concept.id)}>
                    <Icon name="Trash" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Органы */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Органы</h3>
            <Button size="sm" onClick={onCreateOrgan}>
              <Icon name="Plus" size={14} className="mr-1" />
              Создать
            </Button>
          </div>
          <div className="space-y-2">
            {organs.map((organ) => (
              <div key={organ.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div>
                  <span className="font-medium">{organ.organ_name}</span>
                  {organ.description && (
                    <p className="text-xs text-muted-foreground">{organ.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => onEditOrgan(organ)}>
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDeleteOrgan(organ.id)}>
                    <Icon name="Trash" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Науки */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Науки</h3>
            <Button size="sm" onClick={onCreateScience}>
              <Icon name="Plus" size={14} className="mr-1" />
              Создать
            </Button>
          </div>
          <div className="space-y-2">
            {sciences.map((science) => (
              <div key={science.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div>
                  <span className="font-medium">{science.science_name}</span>
                  {science.description && (
                    <p className="text-xs text-muted-foreground">{science.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => onEditScience(science)}>
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDeleteScience(science.id)}>
                    <Icon name="Trash" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ответственности */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Ответственности</h3>
            <Button size="sm" onClick={onCreateResponsibility}>
              <Icon name="Plus" size={14} className="mr-1" />
              Создать
            </Button>
          </div>
          <div className="space-y-2">
            {responsibilities.map((responsibility) => (
              <div key={responsibility.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="font-medium">{responsibility.responsibility}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => onEditResponsibility(responsibility)}>
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDeleteResponsibility(responsibility.id)}>
                    <Icon name="Trash" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

UserChakraCard.displayName = 'UserChakraCard';

export default UserChakraCard;
