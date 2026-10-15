import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/ui/LoginModal';
import jkLogo from '@/assets/JK_Logo.png';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const WHATSAPP_NUMBER = '919865238680';
const WHATSAPP_PREFILLED_MESSAGE =
  'Hello J.K. Industries, I am interested in your industrial machinery and would like to request a quote and product details.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREFILLED_MESSAGE)}`;

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
        {/* Main navigation bar */}
        <div className="h-20 max-w-7xl mx-auto px-[var(--spacing-gutter)] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={jkLogo}
              alt="J.K. Industries Logo"
              className="h-12 w-auto object-contain"
            />
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
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* WhatsApp Direct Chat */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm hover:shadow transition-all duration-200 hover:scale-105 active:scale-95"
              title="Chat with J.K. Industries on WhatsApp (+91 9865238680)"
              aria-label="Chat with us on WhatsApp"
            >
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>

            {/* Get a Quote */}
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
              <div className="flex items-center gap-3 mt-2">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 inline-flex items-center justify-center pl-4 pr-5 py-2.5 bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] font-body-sm font-semibold tracking-wider uppercase border-l-4 border-[var(--color-primary)]"
                >
                  <span className="font-data-mono mr-2">[RFQ]</span>Get a Quote
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#25D366] text-white flex-shrink-0 shadow-sm"
                  title="Chat with J.K. Industries on WhatsApp (+91 9865238680)"
                  aria-label="Chat with us on WhatsApp"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Login Popup Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
