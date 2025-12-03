import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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

interface ChakraDataTabsProps {
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

const ChakraDataTabs = ({
  concepts = [],
  organs = [],
  sciences = [],
  responsibilities = [],
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
}: ChakraDataTabsProps) => {
  return (
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
              <Button size="sm" onClick={() => {
                console.log('🔵 Кнопка Создать Энергию нажата');
                onCreateConcept();
              }}>
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
                      onClick={() => {
                        console.log('🔵 Кнопка Редактировать Энергию нажата, item:', item);
                        onEditConcept(item);
                      }}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteConcept(item.id)}
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
              <Button size="sm" onClick={onCreateOrgan}>
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
                      onClick={() => onEditOrgan(item)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteOrgan(item.id)}
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
              <Button size="sm" onClick={onCreateScience}>
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
                      onClick={() => onEditScience(item)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteScience(item.id)}
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
              <Button size="sm" onClick={onCreateResponsibility}>
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
                      onClick={() => onEditResponsibility(item)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteResponsibility(item.id)}
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
  );
};

export default ChakraDataTabs;