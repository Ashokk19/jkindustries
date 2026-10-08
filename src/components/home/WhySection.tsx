export default function WhySection() {
  const pillars = [
    {
      num: '01',
      badge: 'CHASSIS & DRIVE',
      title: 'Built for Production',
      description:
        'Machines designed around real manufacturing workflows. We understand the dusty reality, multi-shift stresses, and operator turnover in industrial converting plants. Every lever, rail, and mount is built with high fatigue thresholds.',
      targetLabel: 'TARGET:',
      targetVal: 'Zero chassis deflection under load',
    },
    {
      num: '02',
      badge: 'REPEATABILITY',
      title: 'Automation First',
      description:
        'Solutions specifically engineered for reducing repetitive manual operations. By replacing error-prone manual cutting and registration with servo feedback loops and opto-sensors, we stabilize output quality and piece rates.',
      targetLabel: 'BENCHMARK:',
      targetVal: '±0.05 mm mechanical cut tolerance',
    },
    {
      num: '03',
      badge: 'SERVICEABILITY',
      title: 'Practical Engineering',
      description:
        'Straightforward machinery focused strictly on the production task. No locked-in proprietary protocols or opaque components. Plant mechanics can grease, inspect, and service our units using universally accessible workshop tools.',
      targetLabel: 'UPTIME FOCUS:',
      targetVal: 'Standardised global metric fastenings',
    },
  ];

  return (
    <section className="w-full bg-[var(--color-background)] py-[var(--spacing-xl)] border-b border-[var(--color-surface-variant)]">
      <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[var(--spacing-lg)] pb-[var(--spacing-sm)] border-b border-[var(--color-surface-variant)]">
          <div>
            <span className="font-label-badge text-[var(--color-primary)] uppercase tracking-wider block mb-1">
              MANUFACTURING FOUNDATION
            </span>
            <h2 className="font-headline-lg-mobile md:font-headline-lg font-bold text-[var(--color-on-surface)] uppercase tracking-tight">
              Why J.K. Industries
            </h2>
          </div>
          <span className="font-label-technical text-[var(--color-secondary)] uppercase mt-2 md:mt-0">
            FABRICATED IN TIRUPUR INDUSTRIAL HUB
          </span>
        </div>

        {/* 3-Column Minimalist Technical Typography Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              className="bg-[var(--color-surface-container-lowest)] p-[var(--spacing-lg)] border border-[var(--color-surface-variant)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between mb-[var(--spacing-md)]">
                  <span className="font-data-mono text-5xl font-bold text-[var(--color-surface-dim)]">
                    {pillar.num}
                  </span>
                  <span className="font-label-badge text-[var(--color-primary)] uppercase">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="font-headline-sm font-bold text-[var(--color-on-surface)] uppercase tracking-tight mb-[var(--spacing-sm)]">
                  {pillar.title}
                </h3>
                <p className="font-body-md text-[var(--color-on-surface-variant)]">
                  {pillar.description}
                </p>
              </div>
              <div className="mt-[var(--spacing-lg)] pt-[var(--spacing-sm)] bg-[var(--color-surface-container-low)] p-3 border-t border-[var(--color-surface-variant)]">
                <span className="font-label-technical text-[var(--color-secondary)] uppercase block">
                  {pillar.targetLabel}
                </span>
                <span className="font-data-mono font-medium text-[var(--color-on-surface)]">
                  {pillar.targetVal}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
