import type { Product } from '@/types/product';
import MachineCard from './MachineCard';

interface MachineGridProps {
  products: Product[];
  selectedProductId?: string;
  onSelectProduct: (product: Product) => void;
}

export default function MachineGrid({
  products,
  selectedProductId,
  onSelectProduct,
}: MachineGridProps) {
  if (products.length === 0) {
    return (
      <section className="w-full bg-[var(--color-background)] py-[var(--spacing-xl)]">
        <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
          <div className="p-12 text-center bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)]">
            <span className="material-symbols-outlined text-[48px] text-[var(--color-outline)] mb-2">
              inventory_2
            </span>
            <h3 className="font-headline-sm uppercase text-[var(--color-on-surface)]">
              No Machinery Found
            </h3>
            <p className="font-body-md text-[var(--color-on-surface-variant)] mt-1">
              No equipment models match the selected category criteria.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[var(--color-background)] py-[var(--spacing-xl)]">
      <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
        {/* Section Meta Divider */}
        <div className="flex items-center justify-between border-b border-[var(--color-surface-variant)] pb-[var(--spacing-sm)] mb-[var(--spacing-lg)]">
          <div className="flex items-center gap-2">
            <span className="font-label-technical text-[var(--color-primary)] font-bold uppercase">
              SECTION 02 •
            </span>
            <span className="font-label-technical text-[var(--color-secondary)] uppercase tracking-wider">
              RIGID INDUSTRIAL MACHINERY PORTFOLIO
            </span>
          </div>
          <span className="font-label-technical text-[var(--color-secondary)] uppercase">
            SHOWING {products.length} FACTORY UNITS
          </span>
        </div>

        {/* Machinery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
          {products.map((product) => (
            <MachineCard
              key={product.id}
              product={product}
              isSelected={selectedProductId === product.id}
              onSelect={() => onSelectProduct(product)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
