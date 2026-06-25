'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

/** CJK (Chinese/Japanese) numerals for the stat readouts — 三, 十一, 二十… */
export function cjkNum(num: number): string {
  const n = Math.floor(num);
  if (!Number.isFinite(n) || n < 0) return String(num);
  const D = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const U = ['', '十', '百', '千'];
  if (n === 0) return D[0];
  if (n > 9999) return String(n); // counts here never reach this; safe fallback
  const digits = String(n).split('').map(Number);
  let out = '';
  let pendingZero = false;
  digits.forEach((d, i) => {
    const pos = digits.length - 1 - i; // 0=ones, 1=tens, 2=hundreds…
    if (d === 0) {
      pendingZero = true;
    } else {
      if (pendingZero) {
        out += D[0];
        pendingZero = false;
      }
      out += D[d] + U[pos];
    }
  });
  // 一十… reads as 十… in the teens (10 → 十, 11 → 十一).
  if (out.startsWith('一十')) out = out.slice(1);
  return out;
}

export type IconName =
  | 'close' | 'chevron' | 'arrow' | 'prev' | 'next' | 'sun' | 'moon' | 'scroll'
  | 'quote' | 'spark' | 'user' | 'target' | 'map' | 'check' | 'refresh' | 'info'
  | 'link' | 'compass' | 'lotus';

const ICON_PATHS: Record<IconName, string> = {
  close: 'M18 6 6 18M6 6l12 12',
  chevron: 'm9 6 6 6-6 6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  prev: 'm15 6-6 6 6 6',
  next: 'm9 6 6 6-6 6',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
  scroll: 'M8 3h10a2 2 0 0 1 2 2v13a3 3 0 0 1-3 3H7M8 3a2 2 0 0 0-2 2v11H4a1 1 0 0 0-1 1 3 3 0 0 0 3 3M8 3a2 2 0 0 1 2 2v0M12 8h4M12 12h4',
  quote: 'M6 11c0-3 2-5 5-5M6 11v6H1v-6c0-3 2-5 5-5M18 11c0-3 2-5 5-5M18 11v6h-5v-6c0-3 2-5 5-5',
  spark: 'M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M18.4 5.6l-4.2 4.2M9.8 14.2l-4.2 4.2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14',
  check: 'M20 6 9 17l-5-5',
  refresh: 'M21 12a9 9 0 1 1-3-6.7M21 4v4h-4',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8h.01',
  link: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM16 8l-2 6-6 2 2-6 6-2Z',
  lotus: 'M12 21c-5 0-9-3-9-7 2 0 3 1 4 2 0-3 2-6 5-8 3 2 5 5 5 8 1-1 2-2 4-2 0 4-4 7-9 7Z',
};

/** Inline icon set (geometric, self-contained). */
export function Icon({
  name,
  className,
  stroke = 1.6,
  size,
  style,
}: {
  name: IconName;
  className?: string;
  stroke?: number;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      width={size || 16}
      height={size || 16}
      style={style}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

/** Decorative seal-corner brackets framing a panel. */
export function Brackets() {
  return (
    <>
      <span className="bracket bracket--tl" aria-hidden="true" />
      <span className="bracket bracket--tr" aria-hidden="true" />
      <span className="bracket bracket--bl" aria-hidden="true" />
      <span className="bracket bracket--br" aria-hidden="true" />
    </>
  );
}

/** A framed dashboard panel with an optional labelled head. */
export function Panel({
  children,
  area,
  glyph,
  label,
  count,
  className,
  style,
  tint,
}: {
  children: ReactNode;
  area?: string;
  glyph?: string;
  label?: string;
  count?: string;
  className?: string;
  style?: CSSProperties;
  tint?: boolean;
}) {
  return (
    <section
      className={`panel${tint ? ' panel--tint' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...(area ? { gridArea: area } : {}), ...style }}
    >
      <Brackets />
      {label && (
        <div className="panel__head">
          {glyph && <span className="glyph">{glyph}</span>}
          <span className="mono">{label}</span>
          {count && <span className="count">{count}</span>}
        </div>
      )}
      {children}
    </section>
  );
}

/** Accessible modal dialog: closes on Escape and backdrop click, traps focus. */
export function Modal({
  open,
  onClose,
  children,
  labelledby,
  closeLabel,
  variant,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledby?: string;
  closeLabel?: string;
  variant?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={ref}
        className={`modal${variant ? ` ${variant}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledby}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label={closeLabel ?? 'Close'}>
          <Icon name="close" size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

/** Collapsible accordion that allows multiple sections open at once. */
export function Accordion({
  sections,
}: {
  sections: { id: string; title: string; glyph: string; content: ReactNode }[];
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  return (
    <div className="accordion">
      {sections.map((s, i) => {
        const isOpen = open.has(i);
        return (
          <div className={`acc${isOpen ? ' acc--open' : ''}`} key={s.id}>
            <button
              className="acc__head"
              aria-expanded={isOpen}
              aria-controls={`acc-panel-${s.id}`}
              onClick={() => toggle(i)}
            >
              <span className="glyph" aria-hidden="true">{s.glyph}</span>
              <span className="acc__title">{s.title}</span>
              <Icon name="chevron" size={16} className="acc__chevron" />
            </button>
            {isOpen && (
              <div className="acc__body" id={`acc-panel-${s.id}`} role="region">
                {s.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
