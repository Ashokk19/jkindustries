import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services/productService';
import type { Product } from '@/types/product';

export default function ContactSection() {
  const [searchParams] = useSearchParams();
  const machineParam = searchParams.get('machine');

  const [products, setProducts] = useState<Product[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submissionRef, setSubmissionRef] = useState('JKI-REQ-OK');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    machine: '',
    notes: '',
  });

  useEffect(() => {
    productService.getProducts().then(setProducts);
  }, []);

  // Pre-select machine if specified in URL query params
  useEffect(() => {
    if (machineParam && !formData.machine) {
      setFormData((prev) => ({ ...prev, machine: machineParam }));
    }
  }, [machineParam]);

  const automatic = products.filter((p) => p.category === 'automatic');
  const manual = products.filter((p) => p.category === 'manual');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const selectedProduct = products.find((p) => p.slug === formData.machine);
    const machineName = selectedProduct ? selectedProduct.name : formData.machine;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          machineName,
          _gotcha: honeypot,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error || 'Unable to submit specification. Please verify your details or contact us directly.'
        );
      }

      setSubmitted(true);
      setSubmissionRef(
        result.id ? `JKI-${String(result.id).slice(0, 8).toUpperCase()}` : 'JKI-REQ-OK'
      );
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        machine: '',
        notes: '',
      });
    } catch (err: unknown) {
      console.error('[Quotation Submit Error]', err);
      const msg = err instanceof Error ? err.message : 'Network error occurred while submitting quotation.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-[var(--color-background)] py-[var(--spacing-xl)]" id="quote-section">
      <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-gutter)]">
          {/* Left Column: Context & Works Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-label-badge text-[var(--color-on-primary-container)] bg-[var(--color-primary-container)] px-2 py-0.5 uppercase">
                  ENGINEERING CELL
                </span>
                <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                  DIRECT ESTIMATION
                </span>
              </div>
              <h2 className="font-headline-lg-mobile lg:font-headline-lg font-bold text-[var(--color-on-surface)] uppercase tracking-tight mb-[var(--spacing-sm)]">
                Looking for a Specific Machine?
              </h2>
              <p className="font-body-lg text-[var(--color-on-surface-variant)] mb-[var(--spacing-lg)]">
                Tell us about your production requirement and our team can help identify the appropriate machine for your application.
              </p>

              {/* Practical Plant Data Box */}
              <div className="bg-[var(--color-surface-container-lowest)] p-[var(--spacing-md)] border border-[var(--color-surface-variant)] shadow-sm mb-[var(--spacing-md)]">
                <span className="font-label-technical text-[var(--color-primary)] uppercase font-bold block mb-1">
                  MANUFACTURING FACILITY &amp; WORKS
                </span>
                <p className="font-body-md text-[var(--color-on-surface)] font-medium">
                  J.K. Industries<br />
                  No 33/2, A.V.P. Road, Anuparpalayam,<br />
                  Tiruppur, Tamil Nadu, 641652
                </p>
                <div className="mt-3 pt-2 bg-[var(--color-surface-container-low)] p-2 border-t border-[var(--color-surface-variant)]">
                  <span className="font-label-technical text-[var(--color-secondary)] block uppercase">
                    OFFICIAL COMMUNICATION:
                  </span>
                  <a href="mailto:jkindustries1905@gmail.com" className="font-data-mono text-[var(--color-primary)] hover:underline block">
                    jkindustries1905@gmail.com
                  </a>
                  <a href="tel:+919865238680" className="font-data-mono text-[var(--color-primary)] hover:underline block">
                    +91 9865238680
                  </a>
                </div>
              </div>

              <div className="bg-[var(--color-surface-container-low)] p-[var(--spacing-sm)] border border-[var(--color-surface-variant)]">
                <span className="font-label-technical text-[var(--color-secondary)] uppercase block mb-1">
                  COMMISSIONING POLICY:
                </span>
                <p className="font-body-sm text-[var(--color-on-surface-variant)]">
                  Every machine trial is conducted with the client's actual production substrate (tape, satin roll, or hangtag paper) prior to dispatch.
                </p>
              </div>
            </div>

            <div className="pt-6 hidden lg:block">
              <span className="font-label-badge text-[var(--color-secondary)] uppercase">
                // J.K. INDUSTRIES TECHNICAL SALES // TIRUPUR DIVISION
              </span>
            </div>
          </div>

          {/* Right Column: Practical Enquiry Form */}
          <div className="lg:col-span-7 bg-[var(--color-surface-container-lowest)] p-[var(--spacing-md)] md:p-[var(--spacing-lg)] border border-[var(--color-surface-variant)] shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-[var(--spacing-md)]">
              <div className="flex items-center justify-between pb-2 bg-[var(--color-surface-container-low)] p-2 border-b border-[var(--color-surface-variant)]">
                <span className="font-headline-sm font-bold uppercase text-[var(--color-on-surface)]">
                  MACHINERY ENQUIRY SPECIFICATION
                </span>
                <span className="font-label-technical text-[var(--color-secondary)] uppercase">
                  [FORM RFQ-2025]
                </span>
              </div>

              {/* Name and Company Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-md)]">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="rfq-name"
                      className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold"
                    >
                      Contact Person *
                    </label>
                    <span className="font-label-technical text-[var(--color-secondary)]">[INP-01]</span>
                  </div>
                  <input
                    id="rfq-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. S. Ramanathan"
                    className="w-full px-3 py-2.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none focus:bg-[var(--color-surface-container-low)]"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="rfq-company"
                      className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold"
                    >
                      Company / Mill Name *
                    </label>
                    <span className="font-label-technical text-[var(--color-secondary)]">[INP-02]</span>
                  </div>
                  <input
                    id="rfq-company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Apparel Trims Ltd"
                    className="w-full px-3 py-2.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none focus:bg-[var(--color-surface-container-low)]"
                  />
                </div>
              </div>

              {/* Phone and Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-md)]">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="rfq-phone"
                      className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold"
                    >
                      Phone Number (with Code) *
                    </label>
                    <span className="font-label-technical text-[var(--color-secondary)]">[INP-03]</span>
                  </div>
                  <input
                    id="rfq-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98420 XXXXX"
                    className="w-full px-3 py-2.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none focus:bg-[var(--color-surface-container-low)]"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="rfq-email"
                      className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold"
                    >
                      Email Address *
                    </label>
                    <span className="font-label-technical text-[var(--color-secondary)]">[INP-04]</span>
                  </div>
                  <input
                    id="rfq-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="procurement@company.com"
                    className="w-full px-3 py-2.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none focus:bg-[var(--color-surface-container-low)]"
                  />
                </div>
              </div>

              {/* Machine Selector */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="rfq-machine"
                    className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold"
                  >
                    Machine Model / Production Requirement *
                  </label>
                  <span className="font-label-technical text-[var(--color-secondary)]">[SEL-05]</span>
                </div>
                <select
                  id="rfq-machine"
                  required
                  value={formData.machine}
                  onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none focus:bg-[var(--color-surface-container-low)]"
                >
                  <option value="" disabled>-- Select Industrial Machine Configuration --</option>
                  <optgroup label="Automatic Machines">
                    {automatic.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name} ({p.badge || 'Automated'})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Manual &amp; Converting Units">
                    {manual.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Notes */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="rfq-notes"
                    className="font-label-technical uppercase text-[var(--color-on-surface)] font-semibold"
                  >
                    Substrate Details &amp; Production Speed Target
                  </label>
                  <span className="font-label-technical text-[var(--color-secondary)]">[TXT-06]</span>
                </div>
                <textarea
                  id="rfq-notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Specify ribbon/label width, daily cycle requirement (pieces/shift), preferred drying arrangement, or special tooling specifications..."
                  className="w-full px-3 py-2.5 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-body-md border-l-2 border-[var(--color-primary-container)] border-t border-r border-b border-[var(--color-surface-variant)] focus:outline-none focus:bg-[var(--color-surface-container-low)]"
                />
              </div>

              {/* Bot protection honeypot */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="rfq-gotcha">Do not fill this field</label>
                <input
                  id="rfq-gotcha"
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto relative inline-flex items-center justify-center pl-6 pr-8 py-3.5 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] disabled:opacity-60 disabled:cursor-not-allowed text-[var(--color-on-primary)] font-body-md font-semibold tracking-wider uppercase transition-colors border-l-4 border-[var(--color-primary-container)]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined mr-2 text-[var(--color-primary-container)] text-[20px] animate-spin">
                        progress_activity
                      </span>
                      Transmitting Specification...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined mr-2 text-[var(--color-primary-container)] text-[20px]">
                        send
                      </span>
                      Request a Quote
                    </>
                  )}
                </button>
                <span className="font-label-technical text-[var(--color-secondary)] uppercase text-center sm:text-right">
                  RESPONSE FROM TIRUPUR WORKS WITHIN 24 HOURS
                </span>
              </div>

              {/* Error Alert */}
              {submitError && (
                <div
                  role="alert"
                  className="p-4 bg-red-950/20 border border-red-500/50 text-[var(--color-on-surface)] mt-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 text-[24px]">
                      error
                    </span>
                    <span className="font-label-badge text-red-400 uppercase font-bold">
                      TRANSMISSION ERROR // VERIFY DETAILS
                    </span>
                  </div>
                  <p className="font-body-sm text-[var(--color-on-surface-variant)] mt-1.5">
                    {submitError}
                  </p>
                </div>
              )}

              {/* Confirmation message */}
              {submitted && (
                <div
                  role="status"
                  className="p-4 bg-[var(--color-surface-container-low)] border border-[var(--color-primary)] text-[var(--color-on-surface)] mt-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[var(--color-primary)] text-[24px]">
                        check_circle
                      </span>
                      <span className="font-label-badge text-[var(--color-primary)] uppercase font-bold">
                        SPECIFICATION RECEIVED // REFERENCE #{submissionRef}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="font-label-technical text-xs text-[var(--color-primary)] hover:underline uppercase cursor-pointer"
                    >
                      [+ Submit Another Enquiry]
                    </button>
                  </div>
                  <p className="font-body-sm text-[var(--color-on-surface-variant)] mt-1.5">
                    Our mechanical engineering and estimating department in Tirupur will review your substrate parameters and follow up promptly.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
