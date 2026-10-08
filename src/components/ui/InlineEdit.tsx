import { useState, useRef, useEffect } from 'react';

/* ──────────────────────────────────────────────────────────────
   Inline Editable Text — renders as normal text for visitors,
   but becomes a live-editing input for logged-in admins.
   Auto-saves on every keystroke (debounced by the parent).

   KEY DESIGN RULE:
   - 'textarea' mode always renders as a block-level <div> or <textarea>
     so that w-full always has a proper parent width to fill against.
   - 'input' mode stays inline (<span> / <input>).
   ────────────────────────────────────────────────────────────── */

interface InlineEditProps {
  value: string;
  onChange: (value: string) => void;
  as?: 'input' | 'textarea';
  rows?: number;
  className?: string;
  editClassName?: string;
  placeholder?: string;
  isAdmin: boolean;
}

export default function InlineEdit({
  value,
  onChange,
  as = 'input',
  rows = 3,
  className = '',
  editClassName = '',
  placeholder = 'Click to edit…',
  isAdmin,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  // ── Non-admin: static display ──────────────────────────────
  if (!isAdmin) {
    return <span className={className}>{value || ''}</span>;
  }

  // ── TEXTAREA MODE ──────────────────────────────────────────
  // Must stay block-level at all times so w-full always resolves.
  if (as === 'textarea') {
    if (!editing) {
      return (
        <div
          className={`${className} cursor-pointer group w-full`}
          onClick={() => setEditing(true)}
          title="Click to edit"
        >
          <div className="flex items-start gap-1.5 w-full">
            <span className="flex-1 min-w-0 break-words">
              {value || <span className="opacity-40 italic">{placeholder}</span>}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-primary)] shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[14px]">edit</span>
            </span>
          </div>
        </div>
      );
    }

    return (
      <textarea
        ref={(el) => { inputRef.current = el; }}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        placeholder={placeholder}
        style={{ width: '100%', display: 'block', boxSizing: 'border-box' }}
        className={`bg-white border-2 border-[var(--color-primary)] p-1.5 text-[var(--color-on-surface)] outline-none shadow-sm resize-y min-h-[48px] ${editClassName || className}`}
      />
    );
  }

  // ── INPUT MODE ─────────────────────────────────────────────
  if (!editing) {
    return (
      <span
        className={`${className} cursor-pointer inline-flex items-center gap-1 group`}
        onClick={() => setEditing(true)}
        title="Click to edit"
      >
        <span>{value || <span className="opacity-40 italic">{placeholder}</span>}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-primary)] shrink-0">
          <span className="material-symbols-outlined text-[14px]">edit</span>
        </span>
      </span>
    );
  }

  return (
    <input
      ref={(el) => { inputRef.current = el; }}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setEditing(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') setEditing(false);
      }}
      placeholder={placeholder}
      style={{ width: '100%', boxSizing: 'border-box' }}
      className={`bg-white border-2 border-[var(--color-primary)] p-1.5 text-[var(--color-on-surface)] outline-none shadow-sm ${editClassName || className}`}
    />
  );
}
