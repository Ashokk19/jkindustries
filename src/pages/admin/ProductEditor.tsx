import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '@/services/productService';
import type { Product, ProductSpec } from '@/types/product';

export default function ProductEditor() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'automatic' as 'automatic' | 'manual',
    modelCode: '',
    indexNumber: '11',
    indexLabel: '',
    badge: '',
    technicalHighlight: '',
    highlightText: '',
    applicationScope: '',
    shortDescription: '',
    description: '',
  });

  const [specs, setSpecs] = useState<ProductSpec[]>([
    { label: 'Substrate Capability', value: '' },
    { label: 'Drive Mechanism', value: '' },
  ]);

  useEffect(() => {
    if (isEditing && id) {
      productService.getProducts().then((list) => {
        const found = list.find((p) => p.id === id);
        if (found) {
          setFormData({
            name: found.name,
            slug: found.slug,
            category: found.category,
            modelCode: found.modelCode,
            indexNumber: found.indexNumber,
            indexLabel: found.indexLabel,
            badge: found.badge || '',
            technicalHighlight: found.technicalHighlight || '',
            highlightText: found.highlightText || '',
            applicationScope: found.applicationScope || '',
            shortDescription: found.shortDescription || '',
            description: found.description || '',
          });
          if (found.specs && found.specs.length > 0) {
            setSpecs(found.specs);
          }
        }
        setLoading(false);
      });
    }
  }, [id, isEditing]);

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing
        ? prev.slug
        : name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
    }));
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const validSpecs = specs.filter((s) => s.label.trim() && s.value.trim());

    const payload: Partial<Product> = {
      ...formData,
      specs: validSpecs,
      categoryLabel: formData.category === 'automatic' ? 'Automatic Machines' : 'Manual & Converting Units',
      indexLabel: formData.indexLabel || `${formData.indexNumber} / INDUSTRIAL SERIES`,
    };

    try {
      if (isEditing && id) {
        const res = await productService.updateProduct(id, payload);
        if (res.error) throw res.error;
        setStatusMsg({ type: 'success', text: 'Machine specification updated successfully.' });
      } else {
        const res = await productService.createProduct(payload);
        if (res.error) throw res.error;
        setStatusMsg({ type: 'success', text: 'New equipment model successfully indexed.' });
        setTimeout(() => navigate('/admin/products'), 1200);
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save machine entry.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <span className="material-symbols-outlined text-[36px] text-[var(--color-primary)] animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--color-background)] min-h-[85vh] py-8 px-[var(--spacing-gutter)]">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <Link
            to="/admin/products"
            className="font-label-technical text-[var(--color-secondary)] hover:text-[var(--color-primary)] uppercase flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Equipment Directory
          </Link>
          <span className="text-[var(--color-outline-variant)]">/</span>
          <span className="font-label-technical text-[var(--color-primary)] uppercase font-semibold">
            {isEditing ? 'Edit Specification' : 'Commission Machine'}
          </span>
        </div>

        <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] p-6 md:p-8">
          <div className="border-b border-[var(--color-surface-variant)] pb-4 mb-6 flex items-center justify-between">
            <div>
              <span className="font-label-badge text-[var(--color-primary)] uppercase block mb-1">
                ENGINEERING CONFIGURATOR
              </span>
              <h1 className="font-headline-md font-bold uppercase text-[var(--color-on-surface)]">
                {isEditing ? `Edit: ${formData.name}` : 'New Machine Entry'}
              </h1>
            </div>
            <span className="font-data-mono text-[var(--color-secondary)] font-bold text-lg">
              {formData.modelCode || 'JKI-NEW'}
            </span>
          </div>

          {statusMsg && (
            <div
              className={`p-4 mb-6 border-l-4 ${
                statusMsg.type === 'success'
                  ? 'bg-[var(--color-surface-container-low)] border-[var(--color-primary)] text-[var(--color-on-surface)]'
                  : 'bg-[var(--color-error-container)]/30 border-[var(--color-error)] text-[var(--color-on-surface)]'
              }`}
            >
              <span className="font-label-badge font-bold uppercase">
                {statusMsg.type === 'success' ? 'STATUS // SAVED' : 'ERROR // FAILED'}
              </span>
              <p className="font-body-sm mt-1">{statusMsg.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Machine Designation / Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Rotary Label Inspection Unit"
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Asset Slug / URL Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. rotary-label-inspection-unit"
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                />
              </div>
            </div>

            {/* Row 2: Category, Model Code, Index */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Machine Classification *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as 'automatic' | 'manual' })
                  }
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                >
                  <option value="automatic">Automatic Production Line</option>
                  <option value="manual">Manual &amp; Converting Unit</option>
                </select>
              </div>

              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Factory Model Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.modelCode}
                  onChange={(e) => setFormData({ ...formData, modelCode: e.target.value })}
                  placeholder="e.g. JKI-RLI-11"
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Index Number
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

            {/* Row 3: Badges & Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                  Technical Badge Pill
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
                  Highlight Benchmark Text
                </label>
                <input
                  type="text"
                  value={formData.highlightText}
                  onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                  placeholder="e.g. High precision digital servo loop with 0.01mm feedback"
                  className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                Short Description (Card Summary)
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief technical summary for catalogue cards..."
                className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                Full Technical Description *
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive mechanical and operational overview..."
                className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold block mb-1">
                Application Scope &amp; Target Substrates
              </label>
              <input
                type="text"
                value={formData.applicationScope}
                onChange={(e) => setFormData({ ...formData, applicationScope: e.target.value })}
                placeholder="e.g. Satin ribbons, printed garment tags, polypropylene tapes"
                className="w-full px-3 py-2 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none"
              />
            </div>

            {/* Dynamic Specs Matrix */}
            <div className="border border-[var(--color-surface-variant)] p-4 bg-[var(--color-surface-container-low)]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-technical uppercase font-bold text-[var(--color-on-surface)]">
                  Technical Architecture Matrix (Specs)
                </span>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="px-3 py-1 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] hover:bg-[var(--color-surface-container)] font-label-technical uppercase text-xs font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Parameter
                </button>
              </div>

              <div className="space-y-2">
                {specs.map((s, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Parameter (e.g. Drive)"
                      value={s.label}
                      onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                      className="w-1/3 px-2.5 py-1.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-sm border border-[var(--color-surface-variant)] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. AC Servo 1.5 kW)"
                      value={s.value}
                      onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-sm border border-[var(--color-surface-variant)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-1.5 text-[var(--color-error)] hover:bg-[var(--color-error-container)]/30 border border-transparent transition-colors"
                      title="Remove"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-[var(--color-surface-variant)] flex items-center justify-between">
              <Link
                to="/admin/products"
                className="px-6 py-3 border border-[var(--color-surface-variant)] font-body-sm uppercase font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center pl-6 pr-8 py-3 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-sm font-semibold uppercase tracking-wider transition-colors border-l-4 border-[var(--color-primary-container)] disabled:opacity-50"
              >
                {saving ? 'Writing Database...' : isEditing ? 'Update Specification' : 'Commission Machine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
