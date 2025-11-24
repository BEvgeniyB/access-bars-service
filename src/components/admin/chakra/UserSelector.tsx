import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

interface UserSelectorProps {
  currentUser: User | null;
  users: User[];
  chakras: Chakra[];
  selectedUserId: number | null;
  setSelectedUserId: (id: number) => void;
  onCreateUser: () => void;
  onEditUser: () => void;
}

const UserSelector = ({
  currentUser,
  users,
  chakras,
  selectedUserId,
  setSelectedUserId,
  onCreateUser,
  onEditUser,
}: UserSelectorProps) => {
  const sortedUsers = [...users].sort((a, b) => {
    const chakraA = chakras.find((c) => c.id === a.chakra_id);
    const chakraB = chakras.find((c) => c.id === b.chakra_id);
    const posA = chakraA?.position ?? 999;
    const posB = chakraB?.position ?? 999;
    if (posA !== posB) return posA - posB;
    return a.name.localeCompare(b.name);
  });

  if (!currentUser?.is_admin) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Выбор пользователя</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 order-2 sm:order-1">
            <Button size="sm" onClick={onCreateUser} className="flex-1 sm:flex-none">
              <Icon name="Plus" size={16} className="mr-1" />
              Добавить
            </Button>
            {selectedUserId && (
              <Button size="sm" variant="outline" onClick={onEditUser} className="flex-1 sm:flex-none">
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
  );
};

export default UserSelector;
