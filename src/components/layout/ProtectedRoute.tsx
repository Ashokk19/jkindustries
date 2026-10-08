import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-[var(--color-background)]">
        <div className="p-8 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] flex flex-col items-center text-center max-w-sm">
          <span className="material-symbols-outlined text-[40px] text-[var(--color-primary)] animate-spin mb-3">
            progress_activity
          </span>
          <span className="font-label-technical text-[var(--color-secondary)] uppercase">
            VERIFYING ADMINISTRATIVE CREDENTIALS
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
