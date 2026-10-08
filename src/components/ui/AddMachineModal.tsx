import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { productService } from '@/services/productService';
import type { Product, ProductSpec } from '@/types/product';

interface AddMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: (product: Product) => void;
}

export default function AddMachineModal({ isOpen, onClose, onAdded }: AddMachineModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'automatic' as 'automatic' | 'manual',
    modelCode: '',
    indexNumber: '11',
    badge: '',
    shortDescription: '',
    description: '',
    applicationScope: '',
    highlightText: '',
  });

  const [specs, setSpecs] = useState<ProductSpec[]>([
    { label: 'Substrate Capability', value: '' },
    { label: 'Drive Mechanism', value: '' },
  ]);

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, ''),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const validSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

    const payload: Partial<Product> = {
      ...formData,
      specs: validSpecs,
      categoryLabel: formData.category === 'automatic' ? 'Automatic Machines' : 'Manual & Converting Units',
      indexLabel: `${formData.indexNumber} / INDUSTRIAL SERIES`,
    };

    try {
      const res = await productService.createProduct(payload);
      if (res.error) throw res.error;
      onClose();
      if (res.data && onAdded) {
        onAdded(res.data);
      }
      // Navigate to the new product page
      if (res.data) {
        navigate(`/products/${res.data.slug}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create machine entry.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] shadow-2xl">
        {/* Header */}
        <div className="bg-[var(--color-surface-container-low)] p-4 border-b border-[var(--color-surface-variant)] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[var(--color-primary-container)]" />
            <span className="font-label-technical uppercase tracking-wider text-[var(--color-on-surface)] font-bold">
              COMMISSION NEW MACHINE
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center hover:bg-[var(--color-surface-container)] transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] text-[20px]">
              close
            </span>
          </button>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="mb-6 p-3 bg-[var(--color-error-container)]/30 border-l-4 border-[var(--color-error)]">
              <span className="font-label-badge text-[var(--color-error)] uppercase font-bold">
                ERROR
              </span>
              <p className="font-body-sm text-[var(--color-on-surface-variant)] mt-1">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Machine Designation *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Rotary Label Inspection Unit"
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                />
              </div>
              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-name"
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                />
              </div>
            </div>

            {/* Category, Model Code, Index */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Classification *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as 'automatic' | 'manual' })
                  }
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual &amp; Converting</option>
                </select>
              </div>
              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Model Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.modelCode}
                  onChange={(e) => setFormData({ ...formData, modelCode: e.target.value })}
                  placeholder="JKI-RLI-11"
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                />
              </div>
              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Index #
                </label>
                <input
                  type="text"
                  value={formData.indexNumber}
                  onChange={(e) => setFormData({ ...formData, indexNumber: e.target.value })}
                  placeholder="11"
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                />
              </div>
            </div>

            {/* Badge & Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Badge Pill
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. SERVO SYNCHRONIZED"
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                />
              </div>
              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Highlight Text
                </label>
                <input
                  type="text"
                  value={formData.highlightText}
                  onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                  placeholder="Engineering benchmark text"
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief summary for catalogue cards..."
                className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                Full Description *
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive mechanical and operational overview..."
                className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                Application Scope
              </label>
              <input
                type="text"
                value={formData.applicationScope}
                onChange={(e) => setFormData({ ...formData, applicationScope: e.target.value })}
                placeholder="e.g. Satin ribbons, printed garment tags"
                className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
              />
            </div>

            {/* Specs */}
            <div className="border border-[var(--color-surface-variant)] p-4 bg-[var(--color-surface-container-low)]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-technical uppercase font-bold text-[var(--color-on-surface)]">
                  Specifications
                </span>
                <button
                  type="button"
                  onClick={() => setSpecs([...specs, { label: '', value: '' }])}
                  className="px-3 py-1 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] hover:bg-[var(--color-surface-container)] font-label-technical uppercase text-xs font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {specs.map((s, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Parameter"
                      value={s.label}
                      onChange={(e) => {
                        const updated = [...specs];
                        updated[idx].label = e.target.value;
                        setSpecs(updated);
                      }}
                      className="w-1/3 px-2.5 py-1.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-sm border border-[var(--color-surface-variant)] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={s.value}
                      onChange={(e) => {
                        const updated = [...specs];
                        updated[idx].value = e.target.value;
                        setSpecs(updated);
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-sm border border-[var(--color-surface-variant)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                      className="p-1.5 text-[var(--color-error)] hover:bg-[var(--color-error-container)]/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-[var(--color-surface-variant)] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-[var(--color-surface-variant)] font-body-sm uppercase font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center pl-6 pr-8 py-3 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-sm font-semibold uppercase tracking-wider transition-colors border-l-4 border-[var(--color-primary-container)] disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined mr-2 animate-spin text-[18px]">progress_activity</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2 text-[18px]">add_circle</span>
                    Commission Machine
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
