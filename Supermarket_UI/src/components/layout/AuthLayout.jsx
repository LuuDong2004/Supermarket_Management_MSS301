// components/layout/AuthLayout.jsx
// Layout for auth pages (no sidebar, just background)
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../configs/routes';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  // Redirect already-logged-in users to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="auth-wrapper">
      <Outlet />
    </div>
  );
}
