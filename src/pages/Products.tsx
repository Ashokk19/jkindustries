import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product, MachineCategory } from '@/types/product';
import { productService } from '@/services/productService';
import { useAuth } from '@/hooks/useAuth';
import CatalogueHeader from '@/components/products/CatalogueHeader';
import SpotlightViewport from '@/components/products/SpotlightViewport';
import MachineGrid from '@/components/products/MachineGrid';
import AddMachineModal from '@/components/ui/AddMachineModal';

export default function Products() {
  const { user } = useAuth();
  const isAdmin = Boolean(user);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | MachineCategory>('all');
  const [spotlightProduct, setSpotlightProduct] = useState<Product | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Load products from database
  useEffect(() => {
    setLoading(true);
    productService.getProducts().then((products) => {
      setAllProducts(products);
      if (products.length > 0 && !spotlightProduct) {
        setSpotlightProduct(products[0]);
      }
      setLoading(false);
    });
  }, []);

  const filteredProducts =
    selectedCategory === 'all'
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  const handleSelectProduct = (product: Product) => {
    setSpotlightProduct(product);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Reload products after adding a new machine
  const handleMachineAdded = () => {
    productService.getProducts().then((products) => {
      setAllProducts(products);
    });
  };

  return (
    <div className="w-full">
      {/* Admin Add Machine Bar */}
      {isAdmin && (
        <div className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)]">
          <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)] py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span className="font-label-technical uppercase tracking-wider font-bold">
                ADMIN MODE — Click any machine to edit inline
              </span>
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 font-label-technical uppercase tracking-wider font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              ADD NEW MACHINE
            </button>
          </div>
        </div>
      )}

      {/* Top Banner and Category Tabs — uses DB counts */}
      <CatalogueHeader
        currentCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        products={allProducts}
      />

      {/* Loading indicator */}
      {loading && (
        <div className="w-full py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[48px] text-[var(--color-primary)] animate-spin">
              progress_activity
            </span>
            <span className="font-label-technical text-[var(--color-secondary)] uppercase tracking-wider">
              Loading Machine Catalogue...
            </span>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Interactive Machinery Spotlight Focal Viewport */}
          {spotlightProduct && <SpotlightViewport product={spotlightProduct} />}

          {/* Machinery Grid */}
          <MachineGrid
            products={filteredProducts}
            selectedProductId={spotlightProduct?.id}
            onSelectProduct={handleSelectProduct}
          />
        </>
      )}

      {/* Technical Inquiry Callout Section */}
      <section className="w-full bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-surface-variant)] py-[var(--spacing-xl)]">
        <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
          <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-surface-variant)] p-[var(--spacing-lg)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-[var(--spacing-xs)]">
                <span className="font-label-badge text-[var(--color-primary)] uppercase">
                  ■ INDUSTRIAL COMMISSIONS
                </span>
                <span className="text-[var(--color-outline-variant)]">|</span>
                <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                  DIRECT WORKSHOP FABRICATION
                </span>
              </div>
              <h2 className="font-headline-md font-bold text-[var(--color-on-surface)] uppercase tracking-tight">
                Need Custom Machine Tooling or Custom Stroke Widths?
              </h2>
              <p className="font-body-md text-[var(--color-on-surface-variant)] mt-2">
                All apparatus are manufactured at our facility in Tirupur, Tamil Nadu. We configure frame sizes, sensor arrays, and core shafts according to client converting requirements.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-sm font-semibold tracking-wider uppercase border-l-4 border-[var(--color-primary-container)] transition-colors whitespace-nowrap"
              >
                <span className="font-data-mono mr-2">[CONTACT]</span> Inquire with Works
              </Link>
              <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] p-2.5 flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-[24px]">
                  precision_manufacturing
                </span>
                <div className="flex flex-col">
                  <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                    ISO 9001 PROCESS
                  </span>
                  <span className="font-data-mono font-bold text-[var(--color-on-surface)]">
                    TIRUPUR PLANT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Machine Modal */}
      <AddMachineModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdded={handleMachineAdded}
      />
    </div>
  );
}
