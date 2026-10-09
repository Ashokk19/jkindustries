import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

  // All other products ordered in round-robin fashion (all categories)
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [roundRobinIndex, setRoundRobinIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    productService.getProducts().then((products) => {
      setAllProducts(products);
    });
  }, []);

  // Compute circular round-robin list of other machines starting after current product
  const roundRobinList = useMemo(() => {
    if (!allProducts.length) return [];
    const currentIndex = allProducts.findIndex((p) => p.id === product.id);
    if (currentIndex === -1) return allProducts.filter((p) => p.id !== product.id);

    const ordered: Product[] = [];
    for (let i = 1; i < allProducts.length; i++) {
      const idx = (currentIndex + i) % allProducts.length;
      ordered.push(allProducts[idx]);
    }
    return ordered;
  }, [allProducts, product.id]);

  // Reset offset when navigating to a new product
  useEffect(() => {
    setRoundRobinIndex(0);
  }, [product.id]);

  // Manual navigation handlers
  const handlePrev = useCallback(() => {
    if (!roundRobinList.length) return;
    setRoundRobinIndex((prev) => (prev - 1 + roundRobinList.length) % roundRobinList.length);
  }, [roundRobinList.length]);

  const handleNext = useCallback(() => {
    if (!roundRobinList.length) return;
    setRoundRobinIndex((prev) => (prev + 1) % roundRobinList.length);
  }, [roundRobinList.length]);

  // Gentle auto-rotation every 6 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused || roundRobinList.length <= 3) return;
    const interval = setInterval(() => {
      setRoundRobinIndex((prev) => (prev + 1) % roundRobinList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, roundRobinList.length]);

  // Current visible window of 3 machines in round-robin order
  const displayedMachines = useMemo(() => {
    if (!roundRobinList.length) return [];
    if (roundRobinList.length <= 3) return roundRobinList;
    const len = roundRobinList.length;
    return [
      roundRobinList[roundRobinIndex % len],
      roundRobinList[(roundRobinIndex + 1) % len],
      roundRobinList[(roundRobinIndex + 2) % len],
    ];
  }, [roundRobinList, roundRobinIndex]);

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
                    href="mailto:jkindustries1905@gmail.com"
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

      {/* Similar Portfolio — Round Robin Catalogue (All Machines) */}
      {roundRobinList.length > 0 && (
        <section
          className="w-full bg-[var(--color-background)] py-[var(--spacing-xl)] border-b border-[var(--color-surface-variant)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-surface-variant)] pb-[var(--spacing-sm)] mb-[var(--spacing-lg)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-label-badge text-[var(--color-primary)] uppercase">
                    SIMILAR PORTFOLIO
                  </span>
                  <span className="text-[var(--color-secondary)] font-data-mono text-xs">
                    // ROUND-ROBIN RANGE
                  </span>
                </div>
                <h3 className="font-headline-sm font-bold text-[var(--color-on-surface)] uppercase">
                  Complete Machinery Range
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-data-mono text-xs text-[var(--color-secondary)] hidden md:inline-block">
                  CYCLE [{((roundRobinIndex % roundRobinList.length) + 1).toString().padStart(2, '0')} / {roundRobinList.length.toString().padStart(2, '0')}]
                </span>

                <Link
                  to="/products"
                  className="font-label-technical text-[var(--color-primary)] uppercase hover:underline"
                >
                  View All [{allProducts.length}]
                </Link>

                {/* Round Robin Navigation Controls */}
                <div className="flex items-center gap-1 border border-[var(--color-surface-variant)] p-0.5 bg-[var(--color-surface-container-low)]">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-1.5 hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface)] transition-colors flex items-center justify-center"
                    title="Previous machine in round-robin cycle"
                    aria-label="Previous machine"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaused((p) => !p)}
                    className="px-2 py-1 text-[10px] font-data-mono uppercase tracking-wider text-[var(--color-secondary)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
                    title={isPaused ? 'Resume auto-rotation' : 'Pause auto-rotation'}
                  >
                    {isPaused ? 'PAUSED' : 'AUTO'}
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-1.5 hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface)] transition-colors flex items-center justify-center"
                    title="Next machine in round-robin cycle"
                    aria-label="Next machine"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Machine Cards in Round Robin Order */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-gutter)]">
              {displayedMachines.map((rel) => (
                <MachineCard key={rel.id} product={rel} />
              ))}
            </div>

            {/* Round-robin cycle indicators */}
            <div className="mt-[var(--spacing-md)] flex items-center justify-between border-t border-[var(--color-surface-variant)] pt-[var(--spacing-sm)]">
              <div className="flex items-center gap-1.5">
                {roundRobinList.map((p, idx) => {
                  const len = roundRobinList.length;
                  const isVisible = [
                    roundRobinIndex % len,
                    (roundRobinIndex + 1) % len,
                    (roundRobinIndex + 2) % len,
                  ].includes(idx);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setRoundRobinIndex(idx)}
                      className={`h-1.5 transition-all duration-300 ${
                        isVisible
                          ? 'w-6 bg-[var(--color-primary-container)]'
                          : 'w-2 bg-[var(--color-surface-variant)] hover:bg-[var(--color-secondary)]'
                      }`}
                      title={`Jump to ${p.name}`}
                      aria-label={`Jump to ${p.name}`}
                    />
                  );
                })}
              </div>
              <span className="font-label-technical text-xs text-[var(--color-secondary)] uppercase">
                ROTATING THROUGH AUTOMATIC &amp; MANUAL UNITS
              </span>
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
