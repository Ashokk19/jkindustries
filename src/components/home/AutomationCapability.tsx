import { useState, useEffect } from 'react';
import MachineImage from '@/components/ui/MachineImage';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';

export default function AutomationCapability() {
  const [ultrasonicProduct, setUltrasonicProduct] = useState<Product | null>(null);

  useEffect(() => {
    productService
      .getProductBySlug('label-ultrasonic-cutting-machine')
      .then(setUltrasonicProduct);
  }, []);

  return (
    <section className="w-full bg-[var(--color-surface-container-lowest)] py-[var(--spacing-xl)] border-b border-[var(--color-surface-variant)]">
      <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-gutter)] items-center">
          {/* Close-up mechanical precision showcase */}
          <div className="lg:col-span-6 relative">
            <div className="bg-[var(--color-surface-container-low)] p-2 border border-[var(--color-surface-variant)]">
              <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center">
                {ultrasonicProduct ? (
                  <MachineImage
                    product={ultrasonicProduct}
                    aspectRatio="aspect-square"
                    className="w-full h-full bg-white"
                    imgClassName="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface-container-low)]">
                    <span className="material-symbols-outlined text-[64px] text-[var(--color-outline-variant)]">
                      precision_manufacturing
                    </span>
                  </div>
                )}
                {/* Engineering precision overlay box */}
                <div className="absolute top-4 right-4 bg-[var(--color-surface-container-lowest)]/95 backdrop-blur-sm p-3 border border-[var(--color-surface-variant)] shadow-sm">
                  <span className="font-label-badge text-[var(--color-primary)] block uppercase">
                    ■ ANVIL GAP TOLERANCE
                  </span>
                  <span className="font-data-mono text-[var(--color-on-surface)] font-bold">
                    0.008 MM MICRON SPEC
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-surface-container)] border-t border-[var(--color-surface-variant)]">
                <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                  SUB-ASSEMBLY: ULTRASONIC TRANSVERSE HORN &amp; TENSION ARBOR
                </span>
                <span className="font-label-badge text-[var(--color-primary)] uppercase">
                  TIRUPUR PLANT REF
                </span>
              </div>
            </div>
          </div>

          {/* Capability editorial */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[var(--color-primary-container)]" />
              <span className="font-label-technical text-[var(--color-primary)] uppercase tracking-widest">
                MECHANICAL ENGINEERING FOCUS
              </span>
            </div>
            <h2 className="font-headline-lg-mobile lg:font-headline-lg font-bold text-[var(--color-on-surface)] uppercase tracking-tight mb-[var(--spacing-md)]">
              From Machine Concept to Production
            </h2>
            <p className="font-body-lg text-[var(--color-on-surface-variant)] mb-[var(--spacing-md)]">
              J.K. Industries focuses on practical automation machinery for printing, cutting, counting and winding applications. Our machines are developed around the production requirements of manufacturers looking for repeatable and efficient processes.
            </p>
            <p className="font-body-md text-[var(--color-on-surface-variant)] mb-[var(--spacing-lg)]">
              Instead of over-complicating factory units with fragile electronics, our Tirupur engineering facility pairs industrial standard servo drives and heavy structural steel frames with straightforward operator control consoles that factory staff can operate with confidence.
            </p>

            {/* Core Capability Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-gutter)] bg-[var(--color-surface-container-low)] p-[var(--spacing-md)] border border-[var(--color-surface-variant)]">
              <div>
                <span className="font-label-badge text-[var(--color-primary)] block uppercase mb-1">
                  TECHNICAL SUPPORT
                </span>
                <span className="font-headline-sm font-bold text-[var(--color-on-surface)] block">
                  Always Available Anywhere
                </span>
                <span className="font-body-sm text-[var(--color-on-surface-variant)] mt-1 block">
                  Technical support available always anywhere to ensure seamless production and minimal downtime.
                </span>
              </div>
              <div>
                <span className="font-label-badge text-[var(--color-primary)] block uppercase mb-1">
                  PARTS AVAILABILITY
                </span>
                <span className="font-headline-sm font-bold text-[var(--color-on-surface)] block">
                  Standard Spares
                </span>
                <span className="font-body-sm text-[var(--color-on-surface-variant)] mt-1 block">
                  Off-the-shelf industrial bearings, pneumatic valves, and standard PLCs for quick plant turnaround.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
