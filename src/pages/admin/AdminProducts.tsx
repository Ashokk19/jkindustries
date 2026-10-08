import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await productService.getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    await productService.deleteProduct(id);
    setDeleteConfirmId(null);
    setDeleting(false);
    await fetchProducts();
  };

  return (
    <div className="w-full bg-[var(--color-background)] min-h-[85vh] py-8 px-[var(--spacing-gutter)]">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--color-surface-variant)] mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                to="/admin"
                className="font-label-technical text-[var(--color-secondary)] hover:text-[var(--color-primary)] uppercase flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Console
              </Link>
              <span className="text-[var(--color-outline-variant)]">/</span>
              <span className="font-label-technical text-[var(--color-primary)] uppercase font-semibold">
                Equipment Portfolio
              </span>
            </div>
            <h1 className="font-headline-md font-bold uppercase text-[var(--color-on-surface)]">
              Machinery Inventory Matrix
            </h1>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center pl-4 pr-6 py-2.5 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-sm font-semibold uppercase tracking-wider transition-colors border-l-4 border-[var(--color-primary-container)]"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">add</span>
            Add Machine
          </Link>
        </div>

        {/* Machine Table / Cards */}
        {loading ? (
          <div className="p-12 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] text-center">
            <span className="material-symbols-outlined text-[36px] text-[var(--color-primary)] animate-spin mb-2">
              progress_activity
            </span>
            <p className="font-label-technical text-[var(--color-secondary)] uppercase">
              QUERYING EQUIPMENT DATABASE...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] text-center">
            <span className="material-symbols-outlined text-[48px] text-[var(--color-outline)] mb-2">
              inventory_2
            </span>
            <h3 className="font-headline-sm uppercase text-[var(--color-on-surface)]">
              No Equipment Records Found
            </h3>
            <p className="font-body-sm text-[var(--color-on-surface-variant)] mt-1">
              Commission your first machine entry using the button above.
            </p>
          </div>
        ) : (
          <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-container-low)] border-b border-[var(--color-surface-variant)]">
                  <th className="p-3.5 font-label-technical text-[var(--color-secondary)] uppercase">
                    Index &amp; Model
                  </th>
                  <th className="p-3.5 font-label-technical text-[var(--color-secondary)] uppercase">
                    Machine Designation
                  </th>
                  <th className="p-3.5 font-label-technical text-[var(--color-secondary)] uppercase">
                    Category
                  </th>
                  <th className="p-3.5 font-label-technical text-[var(--color-secondary)] uppercase">
                    Technical Badge
                  </th>
                  <th className="p-3.5 font-label-technical text-[var(--color-secondary)] uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-surface-variant)] font-body-sm">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--color-surface-container-low)]/50 transition-colors">
                    <td className="p-3.5 font-data-mono font-semibold text-[var(--color-primary)]">
                      {p.indexNumber} / {p.modelCode}
                    </td>
                    <td className="p-3.5 font-semibold text-[var(--color-on-surface)]">
                      {p.name}
                    </td>
                    <td className="p-3.5 font-label-badge uppercase">
                      <span
                        className={`inline-block px-2 py-0.5 ${
                          p.category === 'automatic'
                            ? 'bg-[var(--color-primary-container)]/20 text-[var(--color-primary)]'
                            : 'bg-[var(--color-surface-container)] text-[var(--color-secondary)]'
                        }`}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-label-technical text-[var(--color-on-surface-variant)]">
                      {p.badge || '—'}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Link
                        to={`/products/${p.slug}`}
                        target="_blank"
                        className="inline-flex items-center px-2.5 py-1 text-xs font-label-technical uppercase border border-[var(--color-surface-variant)] hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface)] transition-colors"
                        title="View live product page"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-label-technical uppercase bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] border border-[var(--color-surface-variant)] text-[var(--color-primary)] font-semibold transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-label-technical uppercase bg-[var(--color-surface-container-low)] hover:bg-[var(--color-error)] hover:text-white border border-[var(--color-surface-variant)] text-[var(--color-error)] transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-[var(--color-surface-container-lowest)] border-2 border-[var(--color-error)] max-w-md w-full p-6">
              <div className="flex items-center gap-2 mb-2 text-[var(--color-error)]">
                <span className="material-symbols-outlined text-[24px]">warning</span>
                <span className="font-headline-sm font-bold uppercase">
                  Confirm Decommission
                </span>
              </div>
              <p className="font-body-md text-[var(--color-on-surface-variant)]">
                Are you sure you want to remove this machine entry from the active equipment registry?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  disabled={deleting}
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 border border-[var(--color-surface-variant)] font-body-sm uppercase font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)]"
                >
                  Cancel
                </button>
                <button
                  disabled={deleting}
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 bg-[var(--color-error)] text-white font-body-sm uppercase font-semibold hover:opacity-90"
                >
                  {deleting ? 'Removing...' : 'Confirm Remove'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
