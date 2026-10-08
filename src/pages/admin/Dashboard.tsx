import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const autoCount = products.filter((p) => p.category === 'automatic').length;
  const manualCount = products.filter((p) => p.category === 'manual').length;

  return (
    <div className="w-full bg-[var(--color-background)] min-h-[85vh] py-8 px-[var(--spacing-gutter)]">
      <div className="max-w-7xl mx-auto">
        {/* Top Control Bar */}
        <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[var(--color-primary-container)]" />
              <span className="font-label-technical uppercase tracking-widest text-[var(--color-primary)] font-bold">
                PLANT MANAGEMENT CONSOLE
              </span>
            </div>
            <h1 className="font-headline-md font-bold uppercase text-[var(--color-on-surface)]">
              Operations Dashboard
            </h1>
            <p className="font-body-sm text-[var(--color-on-surface-variant)] mt-1">
              Authenticated Session: <span className="font-data-mono font-medium">{user?.email || 'Admin'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products"
              target="_blank"
              className="inline-flex items-center justify-center px-4 py-2.5 border border-[var(--color-surface-variant)] hover:bg-[var(--color-surface-container)] font-body-sm font-semibold uppercase tracking-wider transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] mr-1.5">open_in_new</span>
              Live Catalogue
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-error)] text-[var(--color-on-primary)] font-body-sm font-semibold uppercase tracking-wider transition-colors border-l-4 border-[var(--color-primary-container)]"
            >
              <span className="material-symbols-outlined text-[18px] mr-1.5">logout</span>
              Sign Out
            </button>
          </div>
        </div>

        {/* Status Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] p-6">
            <span className="font-label-technical text-[var(--color-secondary)] uppercase block">
              TOTAL INDEXED MACHINERY
            </span>
            <span className="font-data-mono text-4xl font-bold text-[var(--color-on-surface)] mt-2 block">
              {loading ? '--' : products.length}
            </span>
            <span className="font-label-badge text-[var(--color-primary)] uppercase mt-2 block">
              ■ VERIFIED ACTIVE UNITS
            </span>
          </div>

          <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] p-6">
            <span className="font-label-technical text-[var(--color-secondary)] uppercase block">
              AUTOMATIC PRODUCTION LINE
            </span>
            <span className="font-data-mono text-4xl font-bold text-[var(--color-on-surface)] mt-2 block">
              {loading ? '--' : autoCount}
            </span>
            <span className="font-label-badge text-[var(--color-primary)] uppercase mt-2 block">
              SERVO &amp; ULTRASONIC UNITS
            </span>
          </div>

          <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] p-6">
            <span className="font-label-technical text-[var(--color-secondary)] uppercase block">
              MANUAL &amp; CONVERTING UNITS
            </span>
            <span className="font-data-mono text-4xl font-bold text-[var(--color-on-surface)] mt-2 block">
              {loading ? '--' : manualCount}
            </span>
            <span className="font-label-badge text-[var(--color-secondary)] uppercase mt-2 block">
              WORKSHOP &amp; SLITTING LINES
            </span>
          </div>
        </div>

        {/* Quick Management Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[24px] text-[var(--color-primary)]">
                  inventory_2
                </span>
                <h3 className="font-headline-sm font-bold uppercase text-[var(--color-on-surface)]">
                  Machinery Portfolio Manager
                </h3>
              </div>
              <p className="font-body-md text-[var(--color-on-surface-variant)]">
                View, inspect, edit specifications, or modify active catalogue status for all 10 industrial machines.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--color-surface-variant)]">
              <Link
                to="/admin/products"
                className="inline-flex items-center justify-center pl-6 pr-8 py-3 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-sm font-semibold uppercase tracking-wider transition-colors border-l-4 border-[var(--color-primary-container)]"
              >
                Open Equipment Directory
                <span className="material-symbols-outlined text-[18px] ml-2">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[24px] text-[var(--color-primary)]">
                  add_circle
                </span>
                <h3 className="font-headline-sm font-bold uppercase text-[var(--color-on-surface)]">
                  Commission New Machine
                </h3>
              </div>
              <p className="font-body-md text-[var(--color-on-surface-variant)]">
                Add a new equipment model specification with technical parameters, application scope, and asset image assignment.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--color-surface-variant)]">
              <Link
                to="/admin/products/new"
                className="inline-flex items-center justify-center px-6 py-3 border border-[var(--color-inverse-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] font-body-sm font-semibold uppercase tracking-wider transition-colors"
              >
                Create Product Entry
                <span className="material-symbols-outlined text-[18px] ml-2">add</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
