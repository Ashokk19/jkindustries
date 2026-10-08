import { useState, type FormEvent, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setErrorMsg(null);
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message || 'Invalid administrative credentials');
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
        }}
      />

      {/* Modal Dialog — centered */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: '100%',
          maxWidth: '440px',
          margin: '0 auto',
          padding: '0 16px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-surface-variant)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* Structural Header */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-low)',
              padding: '16px',
              borderBottom: '1px solid var(--color-surface-variant)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'var(--color-primary-container)',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span className="font-label-technical" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-on-surface)', fontWeight: 700 }}>
                ADMIN PORTAL
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="font-label-badge" style={{ color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                RESTRICTED
              </span>
              <button
                onClick={onClose}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label="Close login dialog"
              >
                <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)', fontSize: '20px' }}>
                  close
                </span>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 className="font-headline-sm" style={{ textTransform: 'uppercase', color: 'var(--color-on-surface)', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Administrative Sign-In
              </h2>
              <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                Authorized access only for J.K. Industries catalog and equipment management.
              </p>
            </div>

            {errorMsg && (
              <div style={{
                marginBottom: '20px',
                padding: '12px',
                borderLeft: '4px solid var(--color-error)',
                backgroundColor: 'rgba(186, 26, 26, 0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-error)', fontSize: '20px' }}>
                    error
                  </span>
                  <span className="font-label-badge" style={{ color: 'var(--color-error)', textTransform: 'uppercase', fontWeight: 700 }}>
                    AUTHENTICATION FAILED
                  </span>
                </div>
                <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                  {errorMsg}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label
                    htmlFor="modal-admin-email"
                    className="font-label-technical"
                    style={{ textTransform: 'uppercase', color: 'var(--color-on-surface)', fontWeight: 600 }}
                  >
                    Admin Email
                  </label>
                  <span className="font-label-technical" style={{ color: 'var(--color-secondary)' }}>[AUTH-01]</span>
                </div>
                <input
                  id="modal-admin-email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jkindustries-tirupur.com"
                  style={{
                    display: 'block',
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    color: 'var(--color-on-surface)',
                    fontSize: '15px',
                    lineHeight: '24px',
                    fontFamily: 'var(--font-body)',
                    borderLeft: '2px solid var(--color-primary-container)',
                    borderTop: '1px solid var(--color-surface-variant)',
                    borderRight: '1px solid var(--color-surface-variant)',
                    borderBottom: '1px solid var(--color-surface-variant)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label
                    htmlFor="modal-admin-password"
                    className="font-label-technical"
                    style={{ textTransform: 'uppercase', color: 'var(--color-on-surface)', fontWeight: 600 }}
                  >
                    Master Passkey
                  </label>
                  <span className="font-label-technical" style={{ color: 'var(--color-secondary)' }}>[AUTH-02]</span>
                </div>
                <input
                  id="modal-admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    display: 'block',
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    color: 'var(--color-on-surface)',
                    fontSize: '15px',
                    lineHeight: '24px',
                    fontFamily: 'var(--font-body)',
                    borderLeft: '2px solid var(--color-primary-container)',
                    borderTop: '1px solid var(--color-surface-variant)',
                    borderRight: '1px solid var(--color-surface-variant)',
                    borderBottom: '1px solid var(--color-surface-variant)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ paddingTop: '8px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px 24px',
                    backgroundColor: submitting ? 'var(--color-outline)' : 'var(--color-inverse-surface)',
                    color: 'var(--color-on-primary)',
                    fontSize: '15px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: 'none',
                    borderLeft: '4px solid var(--color-primary-container)',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.6 : 1,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined" style={{ marginRight: '8px', fontSize: '20px', animation: 'spin 1s linear infinite' }}>
                        progress_activity
                      </span>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ marginRight: '8px', fontSize: '20px', color: 'var(--color-primary-container)' }}>
                        lock_open
                      </span>
                      Sign In to Console
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Security footnote */}
            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-surface-variant)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span className="font-label-technical" style={{ color: 'var(--color-secondary)', textTransform: 'uppercase' }}>
                SECURITY PROTOCOL
              </span>
              <span className="font-label-badge" style={{ color: 'var(--color-secondary)', textTransform: 'uppercase' }}>
                RLS ENFORCED
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
