import { DiaryAuthProvider } from '@/contexts/DiaryAuthContext';
import DiaryLoginPage from '@/components/diary/admin/DiaryLoginPage';

export default function DiaryLogin() {
  return (
    <DiaryAuthProvider>
      <DiaryLoginPage />
    </DiaryAuthProvider>
  );
}
