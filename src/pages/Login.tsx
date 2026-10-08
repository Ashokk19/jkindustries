import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message || 'Invalid administrative credentials');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[var(--color-background)] min-h-[80vh] flex items-center justify-center py-12 px-[var(--spacing-gutter)]">
      <div className="max-w-md w-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] shadow-sm">
        {/* Structural Header */}
        <div className="bg-[var(--color-surface-container-low)] p-4 border-b border-[var(--color-surface-variant)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[var(--color-primary-container)]" />
            <span className="font-label-technical uppercase tracking-wider text-[var(--color-on-surface)] font-bold">
              PLANT ADMINISTRATION PORTAL
            </span>
          </div>
          <span className="font-label-badge text-[var(--color-primary)] uppercase">
            RESTRICTED
          </span>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h1 className="font-headline-sm uppercase text-[var(--color-on-surface)] font-bold tracking-tight">
              Administrative Sign-In
            </h1>
            <p className="font-body-sm text-[var(--color-on-surface-variant)] mt-1">
              Authorized access only for J.K. Industries catalog and equipment management.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-[var(--color-error-container)]/30 border-l-4 border-[var(--color-error)] text-[var(--color-on-surface)]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-error)] text-[20px]">
                  error
                </span>
                <span className="font-label-badge text-[var(--color-error)] uppercase font-bold">
                  AUTHENTICATION FAILED
                </span>
              </div>
              <p className="font-body-sm text-[var(--color-on-surface-variant)] mt-1">
                {errorMsg}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="admin-email"
                  className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold"
                >
                  Admin Email
                </label>
                <span className="font-label-technical text-[var(--color-secondary)]">[AUTH-01]</span>
              </div>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jkindustries-tirupur.com"
                className="w-full px-3 py-2.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none focus:bg-[var(--color-surface-container-low)]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="admin-password"
                  className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold"
                >
                  Master Passkey
                </label>
                <span className="font-label-technical text-[var(--color-secondary)]">[AUTH-02]</span>
              </div>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none focus:bg-[var(--color-surface-container-low)]"
              />
            </div>

            {/* ONLY LOGIN BUTTON — NO SIGNUP/REGISTER */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full relative inline-flex items-center justify-center pl-6 pr-8 py-3.5 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-md font-semibold tracking-wider uppercase transition-colors border-l-4 border-[var(--color-primary-container)] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined mr-2 animate-spin text-[20px]">
                      progress_activity
                    </span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2 text-[var(--color-primary-container)] text-[20px]">
                      lock_open
                    </span>
                    Sign In to Console
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security footnote */}
          <div className="mt-8 pt-4 border-t border-[var(--color-surface-variant)] flex items-center justify-between">
            <span className="font-label-technical text-[var(--color-secondary)] uppercase">
              SECURITY PROTOCOL
            </span>
            <span className="font-label-badge text-[var(--color-secondary)] uppercase">
              RLS ENFORCED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
