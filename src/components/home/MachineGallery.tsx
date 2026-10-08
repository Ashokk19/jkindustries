import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MachineImage from '@/components/ui/MachineImage';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';

export default function MachineGallery() {
  const [prod1, setProd1] = useState<Product | null>(null);
  const [prod2, setProd2] = useState<Product | null>(null);
  const [prod3, setProd3] = useState<Product | null>(null);
  const [prod4, setProd4] = useState<Product | null>(null);

  useEffect(() => {
    productService.getProducts().then((products) => {
      setProd1(products.find((p) => p.slug === 'flatbed-label-printing-machine') || products[0] || null);
      setProd2(products.find((p) => p.slug === 'label-ultrasonic-cutting-machine') || products[1] || null);
      setProd3(products.find((p) => p.slug === 'roll-to-roll-winding-machine') || products[2] || null);
      setProd4(products.find((p) => p.slug === 'tape-roll-screen-printing-machine') || products[3] || null);
    });
  }, []);

  return (
    <section className="w-full bg-[var(--color-surface-container-lowest)] py-[var(--spacing-xl)] border-b border-[var(--color-surface-variant)]">
      <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[var(--spacing-lg)]">
          <div>
            <span className="font-label-badge text-[var(--color-primary)] uppercase">
              EQUIPMENT ARCHIVE
            </span>
            <h2 className="font-headline-lg-mobile md:font-headline-lg font-bold text-[var(--color-on-surface)] uppercase tracking-tight">
              Explore Our Machines
            </h2>
            <p className="font-body-md text-[var(--color-on-surface-variant)] mt-1">
              Curated machinery gallery across label printing, ultrasonic cutting, roll winding, and screen printing units.
            </p>
          </div>
          <Link
            to="/products"
            className="mt-4 md:mt-0 inline-flex items-center text-[var(--color-primary)] font-body-md font-bold uppercase tracking-wider hover:underline"
          >
            View Complete Catalogue
            <span className="material-symbols-outlined ml-1 text-[20px]">arrow_forward</span>
          </Link>
        </div>

        {/* Asymmetric 4-Image Collage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--spacing-gutter)]">
          {/* Hero Machine (Wide Left - 7 cols) */}
          {prod1 && (
            <div className="md:col-span-7 group relative overflow-hidden bg-[var(--color-surface-container)] border border-[var(--color-surface-variant)]">
              <Link to={`/products/${prod1.slug}`} className="block">
                <div className="aspect-[16/10] overflow-hidden bg-white flex items-center justify-center">
                  <MachineImage
                    product={prod1}
                    aspectRatio="aspect-[16/10]"
                    className="w-full h-full bg-white"
                    imgClassName="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-surface-variant)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                        CATALOGUE ITEM 01
                      </span>
                      <h4 className="font-headline-sm font-bold uppercase text-[var(--color-on-surface)]">
                        {prod1.name}
                      </h4>
                    </div>
                    <span className="font-data-mono text-[var(--color-primary)] font-bold">
                      280 MM WEB
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Cutting Rig (Tall Right - 5 cols) */}
          {prod2 && (
            <div className="md:col-span-5 group relative overflow-hidden bg-[var(--color-surface-container)] border border-[var(--color-surface-variant)] flex flex-col">
              <Link to={`/products/${prod2.slug}`} className="flex flex-col h-full">
                <div className="aspect-square overflow-hidden bg-white flex items-center justify-center">
                  <MachineImage
                    product={prod2}
                    aspectRatio="aspect-square"
                    className="w-full h-full bg-white"
                    imgClassName="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-surface-variant)] mt-auto">
                  <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                    CATALOGUE ITEM 02
                  </span>
                  <h4 className="font-headline-sm font-bold uppercase text-[var(--color-on-surface)]">
                    {prod2.name}
                  </h4>
                  <span className="font-label-badge text-[var(--color-primary)] uppercase block mt-1">
                    ■ 300 CUTS / MINUTE CAPABLE
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* Winding Unit (Bottom Left - 6 cols) */}
          {prod3 && (
            <div className="md:col-span-6 group relative overflow-hidden bg-[var(--color-surface-container)] border border-[var(--color-surface-variant)]">
              <Link to={`/products/${prod3.slug}`} className="block">
                <div className="aspect-[16/9] overflow-hidden bg-white flex items-center justify-center">
                  <MachineImage
                    product={prod3}
                    aspectRatio="aspect-[16/9]"
                    className="w-full h-full bg-white"
                    imgClassName="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-surface-variant)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                        CATALOGUE ITEM 03
                      </span>
                      <h4 className="font-headline-sm font-bold uppercase text-[var(--color-on-surface)]">
                        {prod3.name}
                      </h4>
                    </div>
                    <span className="font-data-mono text-[var(--color-secondary)]">
                      AIR SHAFT CHUCK
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Screen Printer (Bottom Right - 6 cols) */}
          {prod4 && (
            <div className="md:col-span-6 group relative overflow-hidden bg-[var(--color-surface-container)] border border-[var(--color-surface-variant)]">
              <Link to={`/products/${prod4.slug}`} className="block">
                <div className="aspect-[16/9] overflow-hidden bg-white flex items-center justify-center">
                  <MachineImage
                    product={prod4}
                    aspectRatio="aspect-[16/9]"
                    className="w-full h-full bg-white"
                    imgClassName="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-surface-variant)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                        CATALOGUE ITEM 04
                      </span>
                      <h4 className="font-headline-sm font-bold uppercase text-[var(--color-on-surface)]">
                        {prod4.name}
                      </h4>
                    </div>
                    <span className="font-data-mono text-[var(--color-secondary)]">
                      TEXTILE INK READY
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
