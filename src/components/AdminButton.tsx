import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const AdminButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button
        onClick={() => navigate('/admin/login')}
        className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        title="Админ-панель"
      >
        <Icon name="Settings" size={20} />
      </Button>
    </div>
  );
};

export default AdminButton;