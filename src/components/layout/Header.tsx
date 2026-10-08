import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/ui/LoginModal';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export default function Header() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleAdminClick = () => {
    if (user) {
      // Already logged in — sign out
      signOut();
    } else {
      setLoginModalOpen(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-surface-variant)]">
        {/* Top technical info strip */}
        <div className="w-full bg-[var(--color-surface-container-low)] border-b border-[var(--color-surface-variant)]">
          <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)] flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-[var(--color-primary-container)]" />
              <span className="font-label-technical text-[var(--color-secondary)] tracking-widest uppercase">
                MANUFACTURING UNIT: TIRUPUR, TAMIL NADU | INDUSTRIAL AUTOMATION &amp; CONVERTING MACHINERY
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                PRECISION SPEC: ISO COMPLIANT CELL
              </span>
              <span className="text-[var(--color-outline-variant)]">|</span>
              <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                EST. INDUSTRIAL CORRIDOR
              </span>
            </div>
          </div>
        </div>

        {/* Main navigation bar */}
        <div className="h-20 max-w-7xl mx-auto px-[var(--spacing-gutter)] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-headline-sm font-bold tracking-tight text-[var(--color-on-surface)] uppercase leading-none">
                J.K. INDUSTRIES
              </span>
              <span className="font-label-technical text-[var(--color-primary)] tracking-widest uppercase mt-0.5">
                AUTOMATION &amp; MACHINERY
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body-md transition-colors uppercase tracking-wider ${
                  isActive(link.path)
                    ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-1 font-semibold'
                    : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="hidden sm:inline-flex relative items-center justify-center pl-4 pr-5 py-2.5 bg-[var(--color-primary-container)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary-container)] hover:text-[var(--color-on-primary)] font-body-sm font-semibold tracking-wider uppercase transition-colors border-l-4 border-[var(--color-primary)]"
            >
              <span className="font-data-mono mr-2">[RFQ]</span>Get a Quote
            </Link>

            {/* Admin login/logout icon */}
            <button
              onClick={handleAdminClick}
              className={`w-8 h-8 avatar-circle flex items-center justify-center transition-colors ${
                user
                  ? 'bg-[var(--color-primary)] hover:bg-[var(--color-error)]'
                  : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)]'
              }`}
              title={user ? 'Sign Out' : 'Admin Login'}
            >
              <span className="material-symbols-outlined text-[var(--color-on-primary)] text-[18px]">
                {user ? 'logout' : 'person'}
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[var(--color-on-surface)] text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-surface-variant)] px-[var(--spacing-gutter)] py-[var(--spacing-md)]">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-body-md uppercase tracking-wider py-2 border-b border-[var(--color-surface-variant)] ${
                    isActive(link.path)
                      ? 'text-[var(--color-primary)] font-semibold'
                      : 'text-[var(--color-on-surface-variant)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center pl-4 pr-5 py-2.5 bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-body-sm font-semibold tracking-wider uppercase border-l-4 border-[var(--color-primary)] mt-2"
              >
                <span className="font-data-mono mr-2">[RFQ]</span>Get a Quote
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Login Popup Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
