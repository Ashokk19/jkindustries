import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '@/services/productService';
import MachineImage from '@/components/ui/MachineImage';
import type { Product } from '@/types/product';

export default function Hero() {
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);

  useEffect(() => {
    productService.getProducts().then((products) => {
      if (products.length > 0) {
        setFeaturedProduct(products[0]);
      }
    });
  }, []);

  return (
    <section className="w-full bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-surface-variant)]">
      <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)] py-[var(--spacing-xl)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-gutter)] items-center">
          {/* Left text block */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-2 mb-[var(--spacing-sm)]">
              <span className="w-2 h-2 bg-[var(--color-primary-container)]" />
              <span className="font-label-technical text-[var(--color-primary)] uppercase tracking-widest">
                INDUSTRIAL AUTOMATION SYSTEMS
              </span>
            </div>

            <h1 className="font-display-mobile lg:font-display text-[var(--color-on-surface)] uppercase tracking-tight mb-[var(--spacing-md)]">
              Automation Machinery Built for Production.
            </h1>

            <p className="font-body-lg text-[var(--color-on-surface-variant)] mb-[var(--spacing-lg)]">
              Machines designed for consistent output in label printing, ultrasonic cutting, screen printing, winding, and precision converting operations.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-[var(--spacing-sm)]">
              <Link
                to="/products"
                className="inline-flex items-center justify-center pl-6 pr-8 py-3.5 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-md font-semibold tracking-wider uppercase transition-colors border-l-4 border-[var(--color-primary-container)]"
              >
                <span className="material-symbols-outlined mr-2 text-[var(--color-primary-container)] text-[20px]">
                  precision_manufacturing
                </span>
                Explore Machines
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-[var(--color-inverse-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] font-body-md font-semibold tracking-wider uppercase transition-colors"
              >
                Request a Quote
              </Link>
            </div>

            {/* Quick specs strip */}
            <div className="mt-[var(--spacing-lg)] grid grid-cols-2 gap-[var(--spacing-sm)] bg-[var(--color-surface-container-low)] p-[var(--spacing-sm)]">
              <div>
                <span className="font-label-technical text-[var(--color-secondary)] block uppercase">
                  PRODUCTION FOCUS
                </span>
                <span className="font-data-mono text-[var(--color-on-surface)] font-semibold">
                  LABEL &amp; PACKAGING
                </span>
              </div>
              <div>
                <span className="font-label-technical text-[var(--color-secondary)] block uppercase">
                  ENGINEERING BASE
                </span>
                <span className="font-data-mono text-[var(--color-on-surface)] font-semibold">
                  TIRUPUR, TAMIL NADU
                </span>
              </div>
            </div>
          </div>

          {/* Right: Featured machine viewport */}
          <div className="lg:col-span-7">
            <div className="bg-[var(--color-surface-container-low)] p-2 shadow-sm">
              <div className="relative overflow-hidden bg-white">
                {featuredProduct ? (
                  <Link
                    to={`/products/${featuredProduct.slug}`}
                    className="block w-full h-full group"
                    title={`View ${featuredProduct.name} specifications`}
                  >
                    <MachineImage
                      product={featuredProduct}
                      aspectRatio="16/10"
                      className="w-full h-full bg-white"
                      imgClassName="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </Link>
                ) : (
                  <div className="w-full aspect-[16/10] bg-[var(--color-surface-container)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-[var(--color-primary)] animate-spin">
                      progress_activity
                    </span>
                  </div>
                )}
                {/* Engineering benchmark callout overlay - matches Product Page */}
                {featuredProduct && (featuredProduct.highlightText || featuredProduct.technicalHighlight) && (
                  <div className="absolute bottom-4 left-4 z-10 w-[calc(100%-2rem)] max-w-[22rem] bg-white/95 backdrop-blur-md border border-[var(--color-surface-variant)] border-l-4 border-l-[var(--color-primary-container)] p-3.5 shadow-md">
                    <span className="font-label-technical text-[var(--color-secondary)] uppercase block mb-1">
                      ENGINEERING BENCHMARK
                    </span>
                    <span className="font-body-sm font-semibold text-[var(--color-on-surface)] block">
                      {featuredProduct.highlightText || featuredProduct.technicalHighlight}
                    </span>
                  </div>
                )}
              </div>
              {/* Bottom spec strip - mirrors Product Page Technical Architecture Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 bg-[var(--color-surface-container)] p-3">
                {featuredProduct && featuredProduct.specs.length > 0 ? (
                  featuredProduct.specs.slice(0, 4).map((spec, idx) => (
                    <div key={idx} className="min-w-0">
                      <span
                        className="font-label-technical text-[var(--color-secondary)] block uppercase text-[11px] mb-0.5 truncate"
                        title={spec.label}
                      >
                        {spec.label}
                      </span>
                      <span
                        className="font-data-mono text-[var(--color-on-surface)] font-semibold text-xs leading-snug block line-clamp-2"
                        title={spec.value}
                      >
                        {spec.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-1 text-center font-label-technical text-[var(--color-secondary)] text-xs uppercase">
                    LOADING SPECIFICATIONS...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
