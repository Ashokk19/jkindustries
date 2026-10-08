interface MachinePlaceholderProps {
  machineName: string;
  className?: string;
  aspectRatio?: string;
}

/**
 * Clean placeholder for missing machine images.
 * Matches the Stitch design's surface-container-low background
 * with a technical engineering aesthetic.
 */
export default function MachinePlaceholder({
  machineName,
  className = '',
  aspectRatio = '16/10',
}: MachinePlaceholderProps) {
  return (
    <div
      className={`bg-[var(--color-surface-container-low)] flex flex-col items-center justify-center ${className}`}
      style={{ aspectRatio }}
    >
      <span className="material-symbols-outlined text-[var(--color-outline-variant)] text-[64px] mb-[var(--spacing-sm)]">
        precision_manufacturing
      </span>
      <span className="font-label-technical text-[var(--color-secondary)] uppercase text-center px-[var(--spacing-md)]">
        {machineName}
      </span>
      <span className="font-label-badge text-[var(--color-outline)] uppercase mt-1">
        IMAGE PENDING
      </span>
    </div>
  );
}
