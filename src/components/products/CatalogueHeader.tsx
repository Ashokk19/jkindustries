import type { Product, MachineCategory } from '@/types/product';

interface CatalogueHeaderProps {
  currentCategory: 'all' | MachineCategory;
  onSelectCategory: (cat: 'all' | MachineCategory) => void;
  products: Product[];
}

export default function CatalogueHeader({
  currentCategory,
  onSelectCategory,
  products,
}: CatalogueHeaderProps) {
  const counts = {
    all: products.length,
    automatic: products.filter((p) => p.category === 'automatic').length,
    manual: products.filter((p) => p.category === 'manual').length,
  };

  return (
    <section className="w-full bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-surface-variant)]">
      <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)] py-[var(--spacing-xl)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-[var(--spacing-lg)]">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-2 mb-[var(--spacing-xs)]">
              <span className="inline-block w-2 h-2 bg-[var(--color-primary-container)]" />
              <span className="font-label-technical text-[var(--color-secondary)] uppercase tracking-widest">
                ENGINEERING CELL • TIRUPUR WORKS
              </span>
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg font-bold text-[var(--color-on-surface)] tracking-tight uppercase">
              Machine Catalogue
            </h1>
            <p className="font-body-lg text-[var(--color-on-surface-variant)] mt-[var(--spacing-xs)]">
              Explore our range of automatic and manual machinery for printing, cutting, counting and winding applications.
            </p>
          </div>

          <div className="bg-[var(--color-surface-container-low)] p-[var(--spacing-md)] border-l-4 border-[var(--color-primary)] flex flex-col justify-between self-start md:self-auto min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                CATALOGUE INDEX
              </span>
              <span className="font-label-badge text-[var(--color-primary)] bg-[var(--color-surface-container)] px-1.5 py-0.5 uppercase">
                VERIFIED RIGID BUILD
              </span>
            </div>
            <div className="font-data-mono text-[var(--color-on-surface)] mt-2 font-semibold">
              SERIES: JKI-2025-IND
            </div>
            <span className="font-label-technical text-[var(--color-on-surface-variant)] mt-1">
              LOCATION: TAMIL NADU INDUSTRIAL CORRIDOR
            </span>
          </div>
        </div>

        {/* Filter Tabs Navigation */}
        <div className="flex items-center gap-2 border-t border-[var(--color-surface-variant)] pt-[var(--spacing-md)] overflow-x-auto">
          <button
            onClick={() => onSelectCategory('all')}
            className={`group relative px-5 py-3 font-label-technical uppercase tracking-wider transition-all whitespace-nowrap ${
              currentCategory === 'all'
                ? 'text-[var(--color-on-surface)] border-b-2 border-[var(--color-primary-container)] bg-[var(--color-surface-container-low)] font-semibold'
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] border-b-2 border-transparent hover:border-[var(--color-surface-variant)]'
            }`}
          >
            All Machines [{String(counts.all).padStart(2, '0')}]
          </button>
          <button
            onClick={() => onSelectCategory('automatic')}
            className={`group relative px-5 py-3 font-label-technical uppercase tracking-wider transition-all whitespace-nowrap ${
              currentCategory === 'automatic'
                ? 'text-[var(--color-on-surface)] border-b-2 border-[var(--color-primary-container)] bg-[var(--color-surface-container-low)] font-semibold'
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] border-b-2 border-transparent hover:border-[var(--color-surface-variant)]'
            }`}
          >
            Automatic Machines [{String(counts.automatic).padStart(2, '0')}]
          </button>
          <button
            onClick={() => onSelectCategory('manual')}
            className={`group relative px-5 py-3 font-label-technical uppercase tracking-wider transition-all whitespace-nowrap ${
              currentCategory === 'manual'
                ? 'text-[var(--color-on-surface)] border-b-2 border-[var(--color-primary-container)] bg-[var(--color-surface-container-low)] font-semibold'
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] border-b-2 border-transparent hover:border-[var(--color-surface-variant)]'
            }`}
          >
            Manual &amp; Converting Units [{String(counts.manual).padStart(2, '0')}]
          </button>
        </div>
      </div>
    </section>
  );
}
