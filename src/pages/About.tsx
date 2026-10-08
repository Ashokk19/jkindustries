import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="w-full">
      {/* Top Banner */}
      <section className="w-full bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-surface-variant)] py-[var(--spacing-xl)]">
        <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[var(--color-primary-container)]" />
              <span className="font-label-technical text-[var(--color-primary)] uppercase tracking-widest">
                MANUFACTURING FACILITY // TIRUPUR, INDIA
              </span>
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg font-bold text-[var(--color-on-surface)] tracking-tight uppercase">
              Practical Engineering for Heavy-Duty Production.
            </h1>
            
            <div className="mt-6 space-y-4">
              <p className="font-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
                J.K. Industries is an industrial equipment manufacturer rooted in Tirupur, Tamil Nadu — the textile and apparel capital of South India. With{' '}
                <strong className="font-semibold text-[var(--color-on-surface)]">
                  25+ years of expertise in industrial machinery manufacturing
                </strong>
                , we specialize in designing and fabricating reliable printing, cutting, counting, and winding machines built to withstand demanding multi-shift factory operations.
              </p>

              <p className="font-body-md md:font-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
                Our experience spans decades of working closely with manufacturers and understanding the practical challenges of industrial production. We focus on delivering machines that combine{' '}
                <strong className="font-semibold text-[var(--color-on-surface)]">
                  robust construction, consistent performance, ease of operation, and long-term reliability
                </strong>
                .
              </p>

              <p className="font-body-md md:font-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
                From conventional machinery to customized solutions, we develop equipment with a strong emphasis on{' '}
                <strong className="font-semibold text-[var(--color-on-surface)]">
                  precision engineering, durability, and practical factory requirements
                </strong>
                . Our goal is simple — to provide dependable machinery that helps businesses improve productivity while minimizing downtime and maintenance.
              </p>

              <div className="mt-6 p-4 md:p-5 bg-[var(--color-surface-container-low)] border-l-4 border-[var(--color-primary)]">
                <p className="font-body-md md:font-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
                  With a strong manufacturing foundation in Tirupur and a commitment to continuous improvement,{' '}
                  <strong className="font-semibold text-[var(--color-on-surface)]">
                    J.K. Industries continues to build industrial machines designed for real-world production environments.
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Specs & Capabilities */}
      <section className="w-full bg-[var(--color-background)] py-[var(--spacing-xl)] border-b border-[var(--color-surface-variant)]">
        <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-gutter)]">
            <div className="lg:col-span-4 bg-[var(--color-surface-container-lowest)] p-[var(--spacing-lg)] border border-[var(--color-surface-variant)]">
              <span className="font-label-badge text-[var(--color-primary)] uppercase block mb-2">
                01 // FOUNDATION
              </span>
              <h3 className="font-headline-sm font-bold uppercase text-[var(--color-on-surface)] mb-2">
                Built Around The Workshop
              </h3>
              <p className="font-body-md text-[var(--color-on-surface-variant)]">
                Our machinery is developed directly from the factory floor realities of garment trims, woven label mills, and packaging converters. We use heavy steel side plates to absorb vibration, ensuring micron-accurate printing and cutting.
              </p>
            </div>

            <div className="lg:col-span-4 bg-[var(--color-surface-container-lowest)] p-[var(--spacing-lg)] border border-[var(--color-surface-variant)]">
              <span className="font-label-badge text-[var(--color-primary)] uppercase block mb-2">
                02 // REPEATABILITY
              </span>
              <h3 className="font-headline-sm font-bold uppercase text-[var(--color-on-surface)] mb-2">
                Automation First
              </h3>
              <p className="font-body-md text-[var(--color-on-surface-variant)]">
                Replacing labor-intensive manual indexing with synchronized AC servo drives, opto-electronic registration, and ultrasonic sonotrode horns that eliminate frayed edges on synthetic fabrics.
              </p>
            </div>

            <div className="lg:col-span-4 bg-[var(--color-surface-container-lowest)] p-[var(--spacing-lg)] border border-[var(--color-surface-variant)]">
              <span className="font-label-badge text-[var(--color-primary)] uppercase block mb-2">
                03 // MAINTAINABILITY
              </span>
              <h3 className="font-headline-sm font-bold uppercase text-[var(--color-on-surface)] mb-2">
                Accessible Spares
              </h3>
              <p className="font-body-md text-[var(--color-on-surface-variant)]">
                We avoid closed proprietary protocols. All bearings, pneumatic actuators, cylinders, and PLCs use globally standardized industrial ratings so plant mechanics can maintain units with standard workshop tools.
              </p>
            </div>
          </div>

          {/* Plant Facts Matrix */}
          <div className="mt-[var(--spacing-xl)] bg-[var(--color-surface-container-low)] border border-[var(--color-surface-variant)] p-[var(--spacing-lg)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-surface-variant)] mb-6">
              <span className="font-label-technical uppercase text-[var(--color-on-surface)] font-bold">
                PLANT SPECIFICATIONS &amp; QUALITY STANDARDS
              </span>
              <span className="font-label-badge text-[var(--color-primary)] uppercase">
                TIRUPUR INDUSTRIAL WORKS
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="font-label-technical text-[var(--color-secondary)] uppercase block">
                  Location
                </span>
                <span className="font-data-mono text-lg font-bold text-[var(--color-on-surface)] block mt-1">
                  Tirupur, TN, India
                </span>
                <span className="font-body-sm text-[var(--color-on-surface-variant)]">
                  Garment &amp; Machinery Corridor
                </span>
              </div>
              <div>
                <span className="font-label-technical text-[var(--color-secondary)] uppercase block">
                  Machine Classes
                </span>
                <span className="font-data-mono text-lg font-bold text-[var(--color-on-surface)] block mt-1">
                  10 Standard Models
                </span>
                <span className="font-body-sm text-[var(--color-on-surface-variant)]">
                  Automatic &amp; Manual lines
                </span>
              </div>
              <div>
                <span className="font-label-technical text-[var(--color-secondary)] uppercase block">
                  Trial Policy
                </span>
                <span className="font-data-mono text-lg font-bold text-[var(--color-on-surface)] block mt-1">
                  100% Substrate Test
                </span>
                <span className="font-body-sm text-[var(--color-on-surface-variant)]">
                  Verified before dispatch
                </span>
              </div>
              <div>
                <span className="font-label-technical text-[var(--color-secondary)] uppercase block">
                  Spares Standard
                </span>
                <span className="font-data-mono text-lg font-bold text-[var(--color-on-surface)] block mt-1">
                  Global Metric Spec
                </span>
                <span className="font-body-sm text-[var(--color-on-surface-variant)]">
                  Zero proprietary lock-in
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center pl-6 pr-8 py-3.5 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-md font-semibold tracking-wider uppercase transition-colors border-l-4 border-[var(--color-primary-container)]"
            >
              <span className="material-symbols-outlined mr-2 text-[var(--color-primary-container)]">
                precision_manufacturing
              </span>
              Explore Our Machine Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
