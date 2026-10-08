import { Link } from 'react-router-dom';
import type { Product } from '@/types/product';
import MachineImage from '@/components/ui/MachineImage';

interface MachineCardProps {
  product: Product;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function MachineCard({
  product,
  isSelected,
  onSelect,
}: MachineCardProps) {
  // Extract key specs
  const driveSpec = product.specs.find(
    (s) => s.label.toLowerCase().includes('drive') || s.label.toLowerCase().includes('system')
  )?.value || (product.category === 'automatic' ? 'Precision Servo Control' : 'Heavy-Duty Mechanical Drive');

  const appSpec = product.applicationScope
    ? product.applicationScope.split(',')[0]
    : 'Converting & Production';

  return (
    <div
      className={`machine-card group bg-[var(--color-surface-container-lowest)] border transition-all flex flex-col justify-between ${
        isSelected
          ? 'border-[var(--color-primary-container)] ring-2 ring-[var(--color-primary-container)]'
          : 'border-[var(--color-surface-variant)] hover:border-[var(--color-primary-container)]'
      }`}
    >
      <div>
        {/* Card Header Bar */}
        <div className="bg-[var(--color-surface-container-low)] px-[var(--spacing-md)] py-[var(--spacing-xs)] border-b border-[var(--color-surface-variant)] flex items-center justify-between">
          <span className="font-data-mono text-[var(--color-secondary)] font-semibold">
            {product.indexNumber} / {product.modelCode}
          </span>
          <span className="font-label-badge text-[var(--color-primary)] uppercase font-bold tracking-widest">
            ■ {product.category === 'automatic' ? 'AUTOMATIC' : 'MANUAL'}
          </span>
        </div>

        {/* Machine Image Frame */}
        <div className="relative h-56 bg-white overflow-hidden border-b border-[var(--color-surface-variant)] flex items-center justify-center p-2">
          <MachineImage
            product={product}
            className="w-full h-full bg-white"
            imgClassName="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
          />
          {product.badge && (
            <span className="absolute top-2 right-2 bg-[var(--color-surface-container-lowest)]/95 px-2 py-0.5 font-label-badge text-[var(--color-on-surface)] border border-[var(--color-surface-variant)] uppercase">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-[var(--spacing-md)]">
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-headline-sm font-bold text-[var(--color-on-surface)] uppercase tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="font-body-sm text-[var(--color-on-surface-variant)] mt-2 line-clamp-3">
            {product.description || product.shortDescription}
          </p>

          <div className="mt-4 pt-3 border-t border-[var(--color-surface-variant)] space-y-1.5">
            <div className="flex justify-between text-body-sm">
              <span className="text-[var(--color-secondary)] font-label-technical uppercase">
                DRIVE
              </span>
              <span className="font-data-mono text-[var(--color-on-surface)] text-right truncate max-w-[180px]">
                {driveSpec}
              </span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-[var(--color-secondary)] font-label-technical uppercase">
                APPLICATIONS
              </span>
              <span className="font-data-mono text-[var(--color-on-surface)] text-right truncate max-w-[180px]">
                {appSpec}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-[var(--spacing-md)] pt-0 border-t border-[var(--color-surface-variant)]/50 bg-[var(--color-surface-container-lowest)] flex gap-2">
        {onSelect && (
          <button
            onClick={onSelect}
            className="flex-1 py-2.5 bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] font-label-technical text-[var(--color-on-surface)] uppercase tracking-wider font-semibold border-l-2 border-[var(--color-primary-container)] transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            Spotlight
          </button>
        )}
        <Link
          to={`/products/${product.slug}`}
          className="px-3 py-2.5 border border-[var(--color-surface-variant)] hover:bg-[var(--color-surface-container-low)] font-label-technical text-[var(--color-on-surface)] uppercase tracking-wider font-semibold transition-colors flex items-center justify-center"
          title="View detailed specification page"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
