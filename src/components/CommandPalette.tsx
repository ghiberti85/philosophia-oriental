'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { dict } from '@/data/dictionary';
import { philosophers } from '@/data/philosophers';
import { schools } from '@/data/schools';
import { t, type Locale } from '@/lib/i18n';
import { Modal } from './dashboard/ui';

export function CommandPalette({
  locale,
  onSelect,
  open,
  onClose,
}: {
  locale: Locale;
  onSelect: (slug: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const schoolResults = useMemo(() => {
    if (!query) return schools.slice(0, 5);
    const q = query.toLowerCase();
    return schools.filter((s) => t(s.name, locale).toLowerCase().includes(q)).slice(0, 5);
  }, [query, locale]);

  const sageResults = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return philosophers.filter((p) => t(p.name, locale).toLowerCase().includes(q)).slice(0, 5);
  }, [query, locale]);

  const allResults = useMemo(
    () => [
      ...schoolResults.map((s) => ({ type: 'school' as const, slug: s.slug, label: t(s.name, locale), emblem: s.emblem })),
      ...sageResults.map((p) => ({ type: 'sage' as const, slug: p.slug, label: t(p.name, locale), emblem: '' })),
    ],
    [schoolResults, sageResults, locale],
  );

  function handleSelect(item: (typeof allResults)[number]) {
    if (item.type === 'school') {
      onSelect(item.slug);
      onClose();
    } else {
      router.push(`/${locale}/philosophers/${item.slug}`);
      onClose();
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      const item = allResults[cursor];
      if (item) handleSelect(item);
    }
  }

  if (!open) return null;

  const schoolCount = schoolResults.length;

  return (
    <Modal open onClose={onClose} variant="modal--palette" labelledby="cmd-label">
      <div className="palette-input-wrap">
        <input
          ref={inputRef}
          id="cmd-label"
          className="palette-input"
          placeholder={t(dict.cmdSearch, locale)}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
          onKeyDown={handleKey}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="palette-results" role="listbox">
        {allResults.length === 0 && (
          <p className="palette-empty mono">{t(dict.cmdEmpty, locale)}</p>
        )}
        {schoolResults.length > 0 && (
          <>
            <p className="palette-group mono">{t(dict.cmdSchools, locale)}</p>
            {schoolResults.map((s, i) => (
              <button
                key={s.slug}
                className={`palette-item${cursor === i ? ' is-active' : ''}`}
                role="option"
                aria-selected={cursor === i}
                onMouseEnter={() => setCursor(i)}
                onClick={() => handleSelect(allResults[i])}
              >
                <span className="palette-item__emblem serif">{s.emblem}</span>
                <span className="palette-item__label">{t(s.name, locale)}</span>
              </button>
            ))}
          </>
        )}
        {sageResults.length > 0 && (
          <>
            <p className="palette-group mono">{t(dict.cmdSages, locale)}</p>
            {sageResults.map((p, i) => {
              const idx = schoolCount + i;
              return (
                <button
                  key={p.slug}
                  className={`palette-item${cursor === idx ? ' is-active' : ''}`}
                  role="option"
                  aria-selected={cursor === idx}
                  onMouseEnter={() => setCursor(idx)}
                  onClick={() => handleSelect(allResults[idx])}
                >
                  <span className="palette-item__emblem serif">人</span>
                  <span className="palette-item__label">{t(p.name, locale)}</span>
                </button>
              );
            })}
          </>
        )}
      </div>
    </Modal>
  );
}
