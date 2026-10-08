import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '@/services/productService';
import MachineImage from '@/components/ui/MachineImage';
import type { Product } from '@/types/product';

/** Featured machine card with image — alternating layout */
function FeaturedMachine({
  product,
  imagePosition = 'left',
}: {
  product: Product;
  imagePosition?: 'left' | 'right';
}) {
  const imageBlock = (
    <div className={`lg:col-span-6 ${imagePosition === 'right' ? 'order-1 lg:order-2' : ''}`}>
      <div className="relative overflow-hidden bg-white border border-[var(--color-surface-variant)] p-2">
        <MachineImage product={product} aspectRatio="16/10" className="w-full h-full bg-white" imgClassName="w-full h-full object-contain" />
        {product.badge && (
          <span className="absolute top-2 left-2 bg-[var(--color-inverse-surface)] text-[var(--color-on-primary)] font-label-badge px-2 py-0.5 uppercase">
            {product.badge}
          </span>
        )}
      </div>
    </div>
  );

  const textBlock = (
    <div className={`lg:col-span-6 flex flex-col ${imagePosition === 'right' ? 'order-2 lg:order-1' : ''}`}>
      <span className="font-label-technical text-[var(--color-primary)] font-semibold uppercase">
        {product.indexLabel}
      </span>
      <h4 className="font-headline-md font-bold text-[var(--color-on-surface)] uppercase tracking-tight mt-1 mb-2">
        {product.name}
      </h4>
      <p className="font-body-md text-[var(--color-on-surface-variant)] mb-[var(--spacing-md)]">
        {product.description}
      </p>
      {product.specs.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-[var(--spacing-md)] bg-[var(--color-surface-container-low)] p-3">
          {product.specs.slice(0, 2).map((spec) => (
            <div key={spec.label}>
              <span className="font-label-technical text-[var(--color-secondary)] block uppercase">
                {spec.label}
              </span>
              <span className="font-data-mono text-[var(--color-on-surface)] font-semibold">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      )}
      <div>
        <Link
          to={`/products/${product.slug}`}
          className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-on-primary-container)] font-body-md font-semibold uppercase tracking-wider"
        >
          View Machine Details &amp; Request Spec
          <span className="material-symbols-outlined ml-1 text-[18px]">arrow_right_alt</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--color-surface-container-lowest)] p-[var(--spacing-md)] md:p-[var(--spacing-lg)] shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-gutter)] items-center">
        {imagePosition === 'left' ? (
          <>{imageBlock}{textBlock}</>
        ) : (
          <>{textBlock}{imageBlock}</>
        )}
      </div>
    </div>
  );
}

/** Compact machine card — no image */
function CompactCard({ product }: { product: Product }) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] p-[var(--spacing-md)] shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-label-technical text-[var(--color-primary)] uppercase">
            {product.indexLabel}
          </span>
          {product.badge && (
            <span className="font-label-badge bg-[var(--color-surface-container-low)] text-[var(--color-secondary)] px-2 py-0.5">
              {product.badge}
            </span>
          )}
        </div>
        <h4 className="font-headline-sm font-bold text-[var(--color-on-surface)] uppercase tracking-tight mb-2">
          {product.name}
        </h4>
        <p className="font-body-md text-[var(--color-on-surface-variant)] mb-[var(--spacing-md)] line-clamp-3">
          {product.description || product.shortDescription}
        </p>
      </div>
      {product.specs.length > 0 && (
        <div className="bg-[var(--color-surface-container-low)] p-3 mb-[var(--spacing-md)]">
          <div className="flex justify-between items-center text-body-sm">
            <span className="text-[var(--color-secondary)] uppercase font-label-technical">
              {product.specs[0].label}
            </span>
            <span className="font-data-mono font-medium text-[var(--color-on-surface)]">
              {product.specs[0].value}
            </span>
          </div>
        </div>
      )}
      <Link
        to={`/products/${product.slug}`}
        className="inline-flex items-center text-[var(--color-primary)] font-body-md font-semibold uppercase tracking-wider"
      >
        Request Specifications
        <span className="material-symbols-outlined ml-1 text-[18px]">arrow_right_alt</span>
      </Link>
    </div>
  );
}

/** Small card for manual machines sidebar */
function SmallCard({ product }: { product: Product }) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] p-4 shadow-sm">
      <span className="font-label-technical text-[var(--color-secondary)] uppercase">
        {product.indexLabel}
      </span>
      <h5 className="font-headline-sm font-bold text-[var(--color-on-surface)] uppercase">
        {product.name}
      </h5>
      <p className="font-body-sm text-[var(--color-on-surface-variant)] mt-1 mb-2 line-clamp-3">
        {product.description || product.shortDescription}
      </p>
      {product.technicalHighlight && (
        <span className="font-label-badge text-[var(--color-primary)] uppercase">
          {product.technicalHighlight}
        </span>
      )}
    </div>
  );
}

export default function CatalogueSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productService.getProducts().then(setProducts);
  }, []);

  const automatic = products.filter((p) => p.category === 'automatic');
  const manual = products.filter((p) => p.category === 'manual');

  // First 3 automatic = featured alternating, last 2 = compact grid
  const featured = automatic.slice(0, 3);
  const compact = automatic.slice(3, 5);

  // Manual: first = featured with image, rest = small cards
  const manualFeatured = manual[0];
  const manualSmall = manual.slice(1);

  return (
    <section className="w-full bg-[var(--color-background)] py-[var(--spacing-xl)]">
      <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[var(--spacing-lg)] border-b border-[var(--color-surface-variant)] pb-[var(--spacing-sm)]">
          <div>
            <span className="font-label-badge text-[var(--color-primary)] uppercase">
              COMPLETE EQUIPMENT RANGE
            </span>
            <h2 className="font-headline-lg-mobile lg:font-headline-lg font-bold text-[var(--color-on-surface)] uppercase tracking-tight">
              Machines for Printing, Cutting &amp; Converting
            </h2>
          </div>
          <span className="font-label-technical text-[var(--color-secondary)] uppercase mt-2 md:mt-0">
            {products.length} VERIFIED FACTORY CONFIGURATIONS
          </span>
        </div>

        {/* CATEGORY 01: AUTOMATIC */}
        <div className="mb-[var(--spacing-xl)]">
          <div className="bg-[var(--color-surface-container-low)] px-4 py-2.5 mb-[var(--spacing-md)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-label-badge text-[var(--color-on-primary-container)] bg-[var(--color-primary-container)] px-2 py-0.5">
                CATEGORY 01
              </span>
              <h3 className="font-headline-sm font-bold uppercase tracking-tight text-[var(--color-on-surface)]">
                AUTOMATIC CONVERTING MACHINES
              </h3>
            </div>
            <span className="font-label-technical text-[var(--color-secondary)] uppercase hidden sm:inline-block">
              {automatic.length} SERVO-DRIVEN CONFIGURATIONS
            </span>
          </div>

          <div className="flex flex-col gap-[var(--spacing-gutter)]">
            {/* Featured machines with alternating layout */}
            {featured.map((product, i) => (
              <FeaturedMachine
                key={product.id}
                product={product}
                imagePosition={i % 2 === 0 ? 'left' : 'right'}
              />
            ))}

            {/* Compact 2-up grid */}
            {compact.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-gutter)]">
                {compact.map((product) => (
                  <CompactCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CATEGORY 02: MANUAL & CONVERTING */}
        <div>
          <div className="bg-[var(--color-surface-container-low)] px-4 py-2.5 mb-[var(--spacing-md)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-label-badge text-[var(--color-on-primary-container)] bg-[var(--color-primary-container)] px-2 py-0.5">
                CATEGORY 02
              </span>
              <h3 className="font-headline-sm font-bold uppercase tracking-tight text-[var(--color-on-surface)]">
                MANUAL &amp; CONVERTING UNITS
              </h3>
            </div>
            <span className="font-label-technical text-[var(--color-secondary)] uppercase hidden sm:inline-block">
              {manual.length} WORKSHOP-GRADE CONFIGURATIONS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-gutter)]">
            {/* Featured manual machine with image */}
            {manualFeatured && (
              <div className="lg:col-span-7 bg-[var(--color-surface-container-lowest)] p-[var(--spacing-md)] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative overflow-hidden mb-[var(--spacing-md)] bg-white border border-[var(--color-surface-variant)] p-2">
                    <MachineImage
                      product={manualFeatured}
                      aspectRatio="16/9"
                      className="w-full h-full bg-white"
                      imgClassName="w-full h-full object-contain"
                    />
                    {manualFeatured.badge && (
                      <span className="absolute top-2 left-2 bg-[var(--color-inverse-surface)] text-[var(--color-on-primary)] font-label-badge px-2 py-0.5 uppercase">
                        {manualFeatured.technicalHighlight?.replace('■ ', '')}
                      </span>
                    )}
                  </div>
                  <span className="font-label-technical text-[var(--color-primary)] font-semibold uppercase">
                    {manualFeatured.indexLabel}
                  </span>
                  <h4 className="font-headline-md font-bold text-[var(--color-on-surface)] uppercase tracking-tight mt-1 mb-2">
                    {manualFeatured.name}
                  </h4>
                  <p className="font-body-md text-[var(--color-on-surface-variant)] mb-[var(--spacing-md)]">
                    {manualFeatured.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 bg-[var(--color-surface-container-low)] p-3">
                  <span className="font-data-mono text-[var(--color-on-surface)]">
                    MAX ROLL DIA: {manualFeatured.specs.find(s => s.label === 'Max Roll Dia')?.value || '600 MM'}
                  </span>
                  <Link
                    to={`/products/${manualFeatured.slug}`}
                    className="font-body-sm font-bold text-[var(--color-primary)] hover:underline uppercase"
                  >
                    Enquire Unit →
                  </Link>
                </div>
              </div>
            )}

            {/* Small manual machine cards */}
            {manualSmall.length > 0 && (
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-[var(--spacing-sm)]">
                {manualSmall.map((product) => (
                  <SmallCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
