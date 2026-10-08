import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';

export default function Footer() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productService.getProducts().then(setProducts);
  }, []);

  const automatic = products.filter((p) => p.category === 'automatic');
  const manual = products.filter((p) => p.category === 'manual');

  return (
    <footer className="w-full bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-surface-variant)]">
      <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)] py-[var(--spacing-xl)]">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--spacing-gutter)] pb-[var(--spacing-lg)] border-b border-[var(--color-surface-variant)]">
          {/* Company info */}
          <div className="md:col-span-4 flex flex-col">
            <div className="flex items-center gap-3 mb-[var(--spacing-sm)]">
              <span className="w-2 h-2 bg-[var(--color-primary-container)]" />
              <span className="font-headline-sm font-bold uppercase tracking-tight text-[var(--color-on-surface)]">
                J.K. INDUSTRIES
              </span>
            </div>
            <p className="font-body-sm text-[var(--color-on-surface-variant)] mb-[var(--spacing-md)] max-w-sm">
              Heavy-duty printing, converting, and industrial label finishing apparatus engineered for high duty-cycle production.
            </p>
            <div className="bg-[var(--color-surface-container-low)] p-[var(--spacing-sm)] border border-[var(--color-surface-variant)] mb-[var(--spacing-sm)]">
              <span className="font-label-technical text-[var(--color-secondary)] block uppercase">
                Works &amp; Plant Location
              </span>
              <span className="font-body-sm text-[var(--color-on-surface)] font-medium block">
                Tirupur, Tamil Nadu, 641604, India
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label-technical text-[var(--color-secondary)]">PLANT STATUS:</span>
              <span className="font-label-badge text-[var(--color-primary)] bg-[var(--color-surface-container)] px-2 py-0.5 uppercase tracking-wider">
                OPERATIONAL 08:00-20:00 IST
              </span>
            </div>
          </div>

          {/* Index & Corporate links */}
          <div className="md:col-span-2 flex flex-col">
            <span className="font-label-technical text-[var(--color-secondary)] uppercase tracking-wider mb-[var(--spacing-md)]">
              Index &amp; Corporate
            </span>
            <ul className="flex flex-col space-y-2">
              <li><Link to="/" className="font-body-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">Home</Link></li>
              <li><Link to="/products" className="font-body-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">Machinery Catalogue</Link></li>
              <li><Link to="/about" className="font-body-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">About Works</Link></li>
              <li><Link to="/contact" className="font-body-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">Engineering Enquiries</Link></li>
            </ul>
          </div>

          {/* Automatic Line Machinery */}
          <div className="md:col-span-3 flex flex-col">
            <span className="font-label-technical text-[var(--color-secondary)] uppercase tracking-wider mb-[var(--spacing-md)]">
              Automatic Line Machinery
            </span>
            <ul className="flex flex-col space-y-2">
              {automatic.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/products/${p.slug}`}
                    className="font-body-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Converting & Manual Units */}
          <div className="md:col-span-3 flex flex-col">
            <span className="font-label-technical text-[var(--color-secondary)] uppercase tracking-wider mb-[var(--spacing-md)]">
              Converting &amp; Manual Units
            </span>
            <ul className="flex flex-col space-y-2">
              {manual.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/products/${p.slug}`}
                    className="font-body-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-[var(--spacing-md)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-label-badge text-[var(--color-primary)] uppercase">
              ■ SERVO &amp; HYDRAULIC DRIVEN
            </span>
            <span className="font-body-sm text-[var(--color-on-surface-variant)]">
              Precision manufacturing standards maintained at industrial facility, Tirupur, Tamil Nadu.
            </span>
          </div>
          <div className="font-label-technical text-[var(--color-secondary)] text-right">
            © 2025 J.K. INDUSTRIES. ALL ENGINEERING SPECIFICATIONS SUBJECT TO VERIFIED COMMISSIONING.
          </div>
        </div>
      </div>
    </footer>
  );
}
