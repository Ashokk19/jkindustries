import { Link } from 'react-router-dom';
import type { Product } from '@/types/product';
import MachineImage from '@/components/ui/MachineImage';

interface SpotlightViewportProps {
  product: Product;
}

export default function SpotlightViewport({ product }: SpotlightViewportProps) {
  return (
    <section className="w-full bg-[var(--color-surface)] py-[var(--spacing-xl)] border-b border-[var(--color-surface-variant)]">
      <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
        <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] overflow-hidden">
          {/* Structural Top Bar */}
          <div className="bg-[var(--color-surface-container-low)] px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b border-[var(--color-surface-variant)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[var(--color-primary-container)]" />
              <span className="font-label-technical uppercase tracking-widest text-[var(--color-on-surface)] font-semibold">
                SELECTED SPECIFICATION VIEWPORT
              </span>
              <span className="text-[var(--color-outline-variant)]">|</span>
              <span className="font-data-mono text-[var(--color-primary)] font-bold">
                {product.modelCode}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                FABRICATION STANDARD: TIRUPUR HEAVY-DUTY
              </span>
              <span className="font-label-badge text-[var(--color-on-primary)] bg-[var(--color-primary)] px-2.5 py-1 uppercase tracking-widest">
                ■ {product.category === 'automatic' ? 'AUTOMATIC' : 'MANUAL UNIT'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Machine Image Frame */}
            <div className="lg:col-span-7 bg-[var(--color-surface-container)] border-b lg:border-b-0 lg:border-r border-[var(--color-surface-variant)] relative flex flex-col justify-between p-[var(--spacing-md)]">
              <div className="relative w-full h-[360px] md:h-[460px] bg-white border border-[var(--color-surface-variant)] overflow-hidden">
                <MachineImage
                  product={product}
                  className="w-full h-full bg-white"
                  imgClassName="w-full h-full object-contain p-4 transition-transform duration-300"
                />

                {/* Engineering Schematics Floating Callout */}
                {product.highlightText && (
                  <div className="absolute bottom-4 left-4 z-10 w-[calc(100%-2rem)] sm:w-80 max-w-sm bg-white/95 backdrop-blur-md border border-[var(--color-surface-variant)] border-l-4 border-l-[var(--color-primary-container)] p-3.5 shadow-md">
                    <span className="font-label-technical text-[var(--color-secondary)] uppercase block mb-1">
                      ENGINEERING BENCHMARK
                    </span>
                    <span className="font-body-sm font-semibold text-[var(--color-on-surface)] block">
                      {product.highlightText}
                    </span>
                  </div>
                )}
              </div>

              {/* Viewport Footnote */}
              <div className="flex items-center justify-between pt-[var(--spacing-sm)]">
                <span className="font-label-technical text-[var(--color-secondary)] uppercase tracking-wider">
                  RIGID CAST-IRON MONOBLOCK CHASSIS
                </span>
                <span className="font-label-technical text-[var(--color-primary)] uppercase">
                  FULL FACTORY VERIFIED
                </span>
              </div>
            </div>

            {/* Technical Spec Sheet Panel */}
            <div className="lg:col-span-5 p-[var(--spacing-lg)] flex flex-col justify-between bg-[var(--color-surface-container-lowest)]">
              <div>
                <div className="flex items-center gap-2 mb-[var(--spacing-xs)]">
                  <span className="font-data-mono font-bold text-[var(--color-primary)]">
                    {product.indexNumber} / 10
                  </span>
                  <span className="text-[var(--color-outline-variant)]">•</span>
                  <span className="font-label-badge text-[var(--color-secondary)] uppercase tracking-widest">
                    {product.badge || 'PRODUCTION SERIES'}
                  </span>
                </div>
                <h2 className="font-headline-md font-bold text-[var(--color-on-surface)] tracking-tight uppercase leading-tight">
                  {product.name}
                </h2>
                <p className="font-body-md text-[var(--color-on-surface-variant)] mt-[var(--spacing-sm)]">
                  {product.description}
                </p>

                {/* Application Scope */}
                {product.applicationScope && (
                  <div className="mt-[var(--spacing-md)] pt-[var(--spacing-md)] border-t border-[var(--color-surface-variant)]">
                    <span className="font-label-technical text-[var(--color-secondary)] uppercase block mb-1">
                      Application Scope
                    </span>
                    <p className="font-body-sm text-[var(--color-on-surface)] font-medium">
                      {product.applicationScope}
                    </p>
                  </div>
                )}

                {/* Technical Specifications Table */}
                <div className="mt-[var(--spacing-md)] border border-[var(--color-surface-variant)]">
                  <div className="bg-[var(--color-surface-container-low)] px-3 py-2 border-b border-[var(--color-surface-variant)]">
                    <span className="font-label-technical text-[var(--color-on-surface)] uppercase font-semibold">
                      Technical Architecture Matrix
                    </span>
                  </div>
                  <div className="divide-y divide-[var(--color-surface-variant)]">
                    {product.specs.map((spec, idx) => (
                      <div
                        key={spec.label}
                        className={`grid grid-cols-2 p-2.5 text-body-sm ${idx % 2 === 0
                          ? 'bg-[var(--color-surface-container-lowest)]'
                          : 'bg-[var(--color-surface-container-low)]'
                          }`}
                      >
                        <span className="font-body-sm text-[var(--color-secondary)]">
                          {spec.label}
                        </span>
                        <span className="font-data-mono text-[var(--color-on-surface)] font-semibold">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="pt-[var(--spacing-lg)] border-t border-[var(--color-surface-variant)] flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-sm font-semibold tracking-wider uppercase border-l-4 border-[var(--color-primary-container)] transition-colors"
                >
                  <span className="font-data-mono mr-2">[RFQ]</span> Request a Quotation
                </Link>
                <Link
                  to={`/products/${product.slug}`}
                  className="inline-flex items-center justify-center px-4 py-3 border border-[var(--color-inverse-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] font-body-sm font-semibold tracking-wider uppercase transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] mr-1.5">description</span>
                  Full Specs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
