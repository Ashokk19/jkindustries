import jkLogo from '@/assets/JK_Logo.png';

const MAP_QUERY = 'J.K. Industries, No 33/2, A.V.P. Road, Anuparpalayam, Tiruppur, Tamil Nadu 641652';
const GOOGLE_MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
const GOOGLE_MAPS_DIRECT_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-surface-variant)]">
      <div className="max-w-7xl mx-auto px-[var(--spacing-gutter)] py-[var(--spacing-xl)]">
        {/* Main footer grid: 45-50% left contact details, 50-55% right map section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[46%_1fr] gap-8 xl:gap-12 pb-[var(--spacing-lg)] border-b border-[var(--color-surface-variant)] items-center">
          {/* Company & Contact Info (Left Column: ~46-50%) */}
          <div className="w-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-[var(--spacing-sm)]">
              <img src={jkLogo} alt="J.K. Industries Logo" className="h-10 w-auto object-contain" />
              <span className="font-headline-sm font-bold uppercase tracking-tight text-[var(--color-on-surface)]">
                J.K. INDUSTRIES
              </span>
            </div>
            <p className="font-body-sm text-[var(--color-on-surface-variant)] mb-[var(--spacing-md)]">
              Precision-engineered machinery for printing, cutting, counting, and winding applications.
            </p>
            <div className="bg-[var(--color-surface-container-low)] p-[var(--spacing-sm)] border border-[var(--color-surface-variant)] mb-[var(--spacing-sm)]">
              <span className="font-label-technical text-[var(--color-secondary)] block uppercase">
                Works &amp; Plant Location
              </span>
              <span className="font-body-sm text-[var(--color-on-surface)] font-medium block">
                No 33/2, A.V.P. Road, Anuparpalayam,<br />Tiruppur, Tamil Nadu, 641652, India
              </span>
            </div>
            <div className="bg-[var(--color-surface-container-low)] p-[var(--spacing-sm)] border border-[var(--color-surface-variant)]">
              <span className="font-label-technical text-[var(--color-secondary)] block uppercase">
                Contact
              </span>
              <span className="font-body-sm text-[var(--color-on-surface)] font-medium block">
                Phone: <a href="tel:+919865238680" className="text-[var(--color-primary)] hover:underline">9865238680</a>
              </span>
              <span className="font-body-sm text-[var(--color-on-surface)] font-medium block">
                Email: <a href="mailto:jkindustries1905@gmail.com" className="text-[var(--color-primary)] hover:underline">jkindustries1905@gmail.com</a>
              </span>
            </div>
          </div>

          {/* Google Maps Section (Right Column: balanced with left contact block) */}
          <div className="w-full flex flex-col justify-center items-center">
            {/* Header neatly positioned above map, aligned with map left edge */}
            <div className="w-full max-w-[380px] flex items-center gap-2 mb-2 px-1">
              <span className="w-2 h-2 bg-[#38B7AD]" />
              <span className="font-label-technical text-[var(--color-primary)] uppercase tracking-wider text-xs font-semibold">
                PLANT LOCATION // TIRUPPUR
              </span>
            </div>

            {/* Compact rounded-oval container matching left column height (~290px) */}
            <a
              href={GOOGLE_MAPS_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full max-w-[380px] oval-map-frame border border-[#38B7AD] bg-[var(--color-surface-container-highest)] shadow-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38B7AD] focus:ring-offset-2 cursor-pointer"
              style={{
                aspectRatio: '1.3 / 1',
                maxHeight: '300px',
              }}
              aria-label="View J.K. Industries manufacturing facility location in Google Maps (opens in new tab)"
            >
              <iframe
                title="Google Maps location of J.K. Industries manufacturing facility in Tiruppur"
                src={GOOGLE_MAPS_EMBED_URL}
                className="w-full h-full pointer-events-none"
                style={{ width: '100%', height: '100%', border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-[var(--spacing-md)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-label-badge text-[var(--color-primary)] uppercase">
              ■ SERVO &amp; HYDRAULIC DRIVEN
            </span>
            <span className="font-body-sm text-[var(--color-on-surface-variant)]">
              Precision manufacturing standards maintained at industrial facility, Tirupur, Tamil Nadu.
            </span>
          </div>
          <div className="font-label-technical text-[var(--color-secondary)] text-right">
            © 2025 J.K. INDUSTRIES. ALL ENGINEERING SPECIFICATIONS SUBJECT TO VERIFIED COMMISSIONING.
          </div>
        </div>
      </div>
    </footer>
  );
}
