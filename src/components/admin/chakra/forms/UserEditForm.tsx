import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface UserEditFormProps {
  editItem: any;
  setEditItem: (item: any) => void;
  chakras: Chakra[];
}

const UserEditForm = ({ editItem, setEditItem, chakras }: UserEditFormProps) => {
  if (!editItem) return null;

  return (
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
  );
};

export default UserEditForm;
