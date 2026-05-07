import { Navigate } from 'react-router-dom';
import { useAdminStore } from '../admin/store/adminStore';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
}
