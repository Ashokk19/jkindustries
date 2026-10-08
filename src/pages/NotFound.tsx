import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="w-full bg-[var(--color-background)] min-h-[70vh] flex items-center justify-center py-16 px-[var(--spacing-gutter)]">
      <div className="max-w-md w-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-variant)] p-8 text-center shadow-sm">
        <span className="font-data-mono text-6xl font-bold text-[var(--color-outline-variant)] block mb-2">
          404
        </span>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2 h-2 bg-[var(--color-primary-container)]" />
          <span className="font-label-technical text-[var(--color-primary)] uppercase tracking-wider">
            ROUTING FAULT // UNINDEXED ENDPOINT
          </span>
        </div>
        <h1 className="font-headline-sm uppercase text-[var(--color-on-surface)] font-bold">
          Page Not Located
        </h1>
        <p className="font-body-sm text-[var(--color-on-surface-variant)] mt-2">
          The requested system route does not exist in the J.K. Industries application map.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center pl-6 pr-8 py-3 bg-[var(--color-inverse-surface)] hover:bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-sm font-semibold uppercase tracking-wider transition-colors border-l-4 border-[var(--color-primary-container)]"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
