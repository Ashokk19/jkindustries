import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { productService } from '@/services/productService';
import { useAuth } from '@/hooks/useAuth';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';
import MachineImage from '@/components/ui/MachineImage';
import MachineCard from '@/components/products/MachineCard';
import InlineEdit from '@/components/ui/InlineEdit';
import { getMachineGallery } from '@/utils/imageResolver';
import type { Product } from '@/types/product';

/* ──────────────────────────────────────────────────────────────
   Product Detail Page — Database-Driven with Inline Auto-Save
   
   Data flow:
     1. Load from DB via productService.getProductBySlug(slug)
     2. Admin edits field → updateField()
     3. Debounced auto-save → productService.updateProduct(id, changes)
     4. DB persists → UI stays in sync
     5. Refresh → loads fresh from DB → edited values persist
   ────────────────────────────────────────────────────────────── */

function ProductDetailContent({ initialProduct }: { initialProduct: Product }) {
  const { user } = useAuth();
  const isAdmin = Boolean(user);

  // The live product state (starts from DB-loaded data)
  const [product, setProduct] = useState<Product>(initialProduct);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Track which fields have been edited since last save
  const pendingChangesRef = useRef<Partial<Product>>({});
  const hasEditedRef = useRef(false);

  // Related products loaded from DB
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    productService
      .getProductsByCategory(product.category)
      .then((all) => setRelatedProducts(all.filter((p) => p.id !== product.id).slice(0, 3)));
  }, [product.category, product.id]);

  // Sync if initialProduct changes (e.g. navigating between products)
  useEffect(() => {
    setProduct(initialProduct);
    pendingChangesRef.current = {};
    hasEditedRef.current = false;
    setSaveStatus('idle');
    setSaveError(null);
  }, [initialProduct]);

  // The actual save — sends only changed fields to the DB
  const performSave = useCallback(async () => {
    if (!isAdmin) return;
    const changes = { ...pendingChangesRef.current };
    if (Object.keys(changes).length === 0) return;

    setSaveStatus('saving');
    setSaveError(null);

    try {
      const { error } = await productService.updateProduct(product.id, changes);
      if (error) {
        setSaveStatus('error');
        setSaveError(error.message);
        // Don't clear pending changes so they'll retry on next edit
        setTimeout(() => setSaveStatus('idle'), 4000);
      } else {
        pendingChangesRef.current = {};
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 1500);
      }
    } catch {
      setSaveStatus('error');
      setSaveError('Failed to save changes');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  }, [product.id, isAdmin]);

  const { debouncedSave } = useDebouncedSave(performSave, 800);

  // Trigger auto-save when product changes (not on first load)
  useEffect(() => {
    if (hasEditedRef.current && isAdmin) {
      debouncedSave();
    }
  }, [product, isAdmin, debouncedSave]);

  /** Update a single field — tracks pending changes for efficient DB writes */
  const updateField = (field: keyof Product, value: any) => {
    hasEditedRef.current = true;
    if (field === 'description') {
      pendingChangesRef.current = {
        ...pendingChangesRef.current,
        description: value,
        shortDescription: value,
      };
      setProduct((prev) => ({ ...prev, description: value, shortDescription: value }));
    } else {
      pendingChangesRef.current = { ...pendingChangesRef.current, [field]: value };
      setProduct((prev) => ({ ...prev, [field]: value }));
    }
  };

  const updateSpec = (index: number, field: 'label' | 'value', val: string) => {
    hasEditedRef.current = true;
    setProduct((prev) => {
      const specs = [...prev.specs];
      specs[index] = { ...specs[index], [field]: val };
      pendingChangesRef.current = { ...pendingChangesRef.current, specs };
      return { ...prev, specs };
    });
  };

  const addSpec = () => {
    hasEditedRef.current = true;
    setProduct((prev) => {
      const specs = [...prev.specs, { label: '', value: '' }];
      pendingChangesRef.current = { ...pendingChangesRef.current, specs };
      return { ...prev, specs };
    });
  };

  const removeSpec = (index: number) => {
    hasEditedRef.current = true;
    setProduct((prev) => {
      const specs = prev.specs.filter((_, i) => i !== index);
      pendingChangesRef.current = { ...pendingChangesRef.current, specs };
      return { ...prev, specs };
    });
  };

  const galleryImages = getMachineGallery(product.category, product.slug);

  return (
    <div className="w-full">
      {/* Admin Status Bar */}
      {isAdmin && (
        <div className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)]">
          <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)] py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span className="font-label-technical uppercase tracking-wider font-bold">
                ADMIN EDIT MODE — Changes auto-save as you type
              </span>
            </div>
            <div className="flex items-center gap-2">
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1 font-label-badge uppercase">
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  SAVING...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 font-label-badge uppercase">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  SAVED
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center gap-1 font-label-badge uppercase text-yellow-200">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {saveError || 'SAVE FAILED'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb / Top Bar */}
      <div className="w-full bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-surface-variant)]">
        <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)] py-3">
          <div className="flex items-center justify-between text-body-sm">
            <div className="flex items-center gap-2">
              <Link
                to="/products"
                className="font-label-technical text-[var(--color-secondary)] hover:text-[var(--color-primary)] uppercase flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Catalogue
              </Link>
              <span className="text-[var(--color-outline-variant)]">/</span>
              <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                {product.category === 'automatic' ? 'Automatic Line' : 'Manual Units'}
              </span>
              <span className="text-[var(--color-outline-variant)]">/</span>
              <span className="font-label-technical text-[var(--color-on-surface)] font-semibold uppercase truncate max-w-[200px] sm:max-w-none">
                {product.name}
              </span>
            </div>
            <span className="font-data-mono text-[var(--color-primary)] font-semibold hidden sm:inline">
              REF: {product.modelCode}
            </span>
          </div>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <section className="w-full bg-[var(--color-surface)] py-[var(--spacing-xl)] border-b border-[var(--color-surface-variant)]">
        <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
          <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] overflow-hidden">
            {/* Top Spec Bar */}
            <div className="bg-[var(--color-surface-container-low)] px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b border-[var(--color-surface-variant)] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-[var(--color-primary-container)]" />
                <span className="font-label-technical uppercase tracking-widest text-[var(--color-on-surface)] font-semibold">
                  INDEX: {product.indexLabel}
                </span>
                <span className="text-[var(--color-outline-variant)]">|</span>
                <InlineEdit
                  value={product.modelCode}
                  onChange={(v) => updateField('modelCode', v)}
                  isAdmin={isAdmin}
                  className="font-data-mono text-[var(--color-primary)] font-bold"
                  placeholder="JKI-XXX-00"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-label-badge text-[var(--color-on-primary)] bg-[var(--color-primary)] px-2.5 py-1 uppercase tracking-widest">
                  ■ {product.category === 'automatic' ? 'AUTOMATIC SPEC' : 'MANUAL SPEC'}
                </span>
                {(product.badge || isAdmin) && (
                  <InlineEdit
                    value={product.badge || ''}
                    onChange={(v) => updateField('badge', v)}
                    isAdmin={isAdmin}
                    className="font-label-badge text-[var(--color-on-surface)] bg-[var(--color-surface-container)] px-2 py-1 uppercase"
                    placeholder="BADGE TEXT"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Product Imagery */}
              <div className="lg:col-span-7 bg-[var(--color-surface-container)] border-b lg:border-b-0 lg:border-r border-[var(--color-surface-variant)] p-[var(--spacing-md)] flex flex-col justify-between">
                <div className="relative w-full h-[400px] md:h-[500px] bg-white border border-[var(--color-surface-variant)] overflow-hidden">
                  <MachineImage
                    product={product}
                    className="w-full h-full bg-white"
                    imgClassName="w-full h-full object-contain p-4"
                  />
                  {(product.highlightText || isAdmin) && (
                    <div className="absolute bottom-4 left-4 z-10 bg-white border border-[var(--color-surface-variant)] border-l-4 border-l-[var(--color-primary-container)] p-3.5 shadow-md" style={{ width: 'calc(100% - 2rem)', maxWidth: '22rem' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                          ENGINEERING BENCHMARK
                        </span>
                        {isAdmin && (
                          <span className="font-label-badge text-[var(--color-primary)] text-[10px] uppercase ml-2 shrink-0">

                          </span>
                        )}
                      </div>
                      <InlineEdit
                        value={product.highlightText || ''}
                        onChange={(v) => updateField('highlightText', v)}
                        isAdmin={isAdmin}
                        as="textarea"
                        rows={2}
                        className="font-body-sm font-semibold text-[var(--color-on-surface)]"
                        placeholder="Engineering benchmark highlight..."
                      />
                    </div>
                  )}
                </div>

                {/* Gallery thumbnails if available */}
                {galleryImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square bg-white border border-[var(--color-surface-variant)] overflow-hidden flex items-center justify-center p-1"
                      >
                        <img
                          src={img}
                          alt={`${product.name} detail view ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-[var(--spacing-sm)]">
                  <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                    PRECISION FABRICATION: TIRUPUR FACILITY
                  </span>
                  <span className="font-label-technical text-[var(--color-primary)] uppercase">
                    100% PRE-DISPATCH TRIAL RUN
                  </span>
                </div>
              </div>

              {/* Product Specifications & Details */}
              <div className="lg:col-span-5 p-[var(--spacing-lg)] flex flex-col justify-between bg-[var(--color-surface-container-lowest)]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-data-mono font-bold text-[var(--color-primary)]">
                      {product.indexNumber} / 10
                    </span>
                    <span className="text-[var(--color-outline-variant)]">•</span>
                    <span className="font-label-badge text-[var(--color-secondary)] uppercase tracking-wider">
                      {product.categoryLabel}
                    </span>
                  </div>

                  <h1 className="font-headline-md font-bold text-[var(--color-on-surface)] tracking-tight uppercase leading-tight">
                    <InlineEdit
                      value={product.name}
                      onChange={(v) => updateField('name', v)}
                      isAdmin={isAdmin}
                      className="font-headline-md font-bold text-[var(--color-on-surface)] tracking-tight uppercase leading-tight"
                      placeholder="Machine Name"
                    />
                  </h1>

                  <div className="mt-[var(--spacing-md)]">
                    <InlineEdit
                      value={product.description}
                      onChange={(v) => updateField('description', v)}
                      as="textarea"
                      rows={4}
                      isAdmin={isAdmin}
                      className="font-body-md text-[var(--color-on-surface-variant)]"
                      placeholder="Full technical description..."
                    />
                  </div>

                  {/* Application Scope */}
                  <div className="mt-[var(--spacing-md)] pt-[var(--spacing-md)] border-t border-[var(--color-surface-variant)]">
                    <span className="font-label-technical text-[var(--color-secondary)] uppercase block mb-1">
                      Application Scope &amp; Substrates
                    </span>
                    <InlineEdit
                      value={product.applicationScope || ''}
                      onChange={(v) => updateField('applicationScope', v)}
                      isAdmin={isAdmin}
                      className="font-body-sm text-[var(--color-on-surface)] font-medium"
                      placeholder="Application scope..."
                    />
                  </div>

                  {/* Architecture Specs Table */}
                  <div className="mt-[var(--spacing-md)] border border-[var(--color-surface-variant)]">
                    <div className="bg-[var(--color-surface-container-low)] px-3 py-2 border-b border-[var(--color-surface-variant)] flex items-center justify-between">
                      <span className="font-label-technical text-[var(--color-on-surface)] uppercase font-semibold">
                        Technical Architecture Matrix
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-label-technical text-[var(--color-secondary)]">
                          [METRIC]
                        </span>
                        {isAdmin && (
                          <button
                            onClick={addSpec}
                            className="flex items-center gap-1 px-2 py-0.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] hover:bg-[var(--color-surface-container)] font-label-technical text-[var(--color-primary)] uppercase text-xs font-semibold transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="divide-y divide-[var(--color-surface-variant)]">
                      {product.specs.map((spec, idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-2 p-2.5 text-body-sm ${idx % 2 === 0
                              ? 'bg-[var(--color-surface-container-lowest)]'
                              : 'bg-[var(--color-surface-container-low)]'
                            } ${isAdmin ? 'group relative' : ''}`}
                        >
                          <InlineEdit
                            value={spec.label}
                            onChange={(v) => updateSpec(idx, 'label', v)}
                            isAdmin={isAdmin}
                            className="font-body-sm text-[var(--color-secondary)]"
                            placeholder="Parameter name"
                          />
                          <div className="flex items-center justify-between">
                            <InlineEdit
                              value={spec.value}
                              onChange={(v) => updateSpec(idx, 'value', v)}
                              isAdmin={isAdmin}
                              className="font-data-mono text-[var(--color-on-surface)] font-semibold"
                              placeholder="Value"
                            />
                            {isAdmin && (
                              <button
                                onClick={() => removeSpec(idx)}
                                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-[var(--color-error)] hover:bg-[var(--color-error-container)]/30"
                                title="Remove spec"
                              >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-[var(--spacing-lg)] border-t border-[var(--color-surface-variant)] flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="flex-1 inline-flex items-center justify-center px-4 py-3.5 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-sm font-semibold tracking-wider uppercase border-l-4 border-[var(--color-primary-container)] transition-colors"
                  >
                    <span className="font-data-mono mr-2">[RFQ]</span> Request Quote for this Machine
                  </Link>
                  <a
                    href="mailto:enquiry@jkindustries-tirupur.com"
                    className="inline-flex items-center justify-center px-4 py-3.5 border border-[var(--color-inverse-surface)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] font-body-sm font-semibold tracking-wider uppercase transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] mr-1.5">mail</span>
                    Inquire
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Machinery in Same Category */}
      {relatedProducts.length > 0 && (
        <section className="w-full bg-[var(--color-background)] py-[var(--spacing-xl)] border-b border-[var(--color-surface-variant)]">
          <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
            <div className="flex items-center justify-between border-b border-[var(--color-surface-variant)] pb-[var(--spacing-sm)] mb-[var(--spacing-lg)]">
              <div>
                <span className="font-label-badge text-[var(--color-primary)] uppercase">
                  SIMILAR PORTFOLIO
                </span>
                <h3 className="font-headline-sm font-bold text-[var(--color-on-surface)] uppercase">
                  More {product.categoryLabel}
                </h3>
              </div>
              <Link
                to="/products"
                className="font-label-technical text-[var(--color-primary)] uppercase hover:underline"
              >
                View All [{relatedProducts.length + 1}]
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-gutter)]">
              {relatedProducts.map((rel) => (
                <MachineCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    productService.getProductBySlug(slug).then((p) => {
      if (p) {
        setProduct(p);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [slug]);

  if (!slug) {
    return <Navigate to="/products" replace />;
  }

  if (loading) {
    return (
      <div className="w-full bg-[var(--color-background)] min-h-[60vh] flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] text-[var(--color-primary)] animate-spin">
            progress_activity
          </span>
          <span className="font-label-technical text-[var(--color-secondary)] uppercase tracking-wider">
            Loading Machine Specification...
          </span>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="w-full bg-[var(--color-background)] min-h-[60vh] flex items-center justify-center py-20 px-gutter">
        <div className="max-w-md w-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] p-8 text-center">
          <span className="material-symbols-outlined text-[56px] text-[var(--color-outline)] mb-3">
            precision_manufacturing
          </span>
          <h2 className="font-headline-sm uppercase text-[var(--color-on-surface)]">
            Machine Specification Not Found
          </h2>
          <p className="font-body-md text-[var(--color-on-surface-variant)] mt-2">
            The requested machine model <span className="font-data-mono font-semibold">"{slug}"</span> is not indexed in our current factory catalogue.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-sm font-semibold tracking-wider uppercase transition-colors"
            >
              Return to Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ProductDetailContent key={product.id} initialProduct={product} />;
}
