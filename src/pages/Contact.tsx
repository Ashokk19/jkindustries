import ContactSection from '@/components/home/ContactSection';

export default function Contact() {
  return (
    <div className="w-full">
      {/* Top Breadcrumb / Title Bar */}
      <section className="w-full bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-surface-variant)] py-8">
        <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-[var(--color-primary-container)]" />
            <span className="font-label-technical text-[var(--color-primary)] uppercase tracking-widest">
              DIRECT ENGINEERING DESK // TIRUPUR
            </span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg font-bold text-[var(--color-on-surface)] tracking-tight uppercase">
            Technical Quotations &amp; Enquiries
          </h1>
          <p className="font-body-lg text-[var(--color-on-surface-variant)] mt-2 max-w-2xl">
            Contact our engineering and sales department to discuss custom tooling, machine specifications, or request a formal commercial quotation.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <ContactSection />
    </div>
  );
}
