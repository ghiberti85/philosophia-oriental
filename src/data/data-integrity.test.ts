import { describe, expect, it } from 'vitest';
import { LOCALES } from '@/lib/i18n';
import { dict } from './dictionary';
import { philosophers } from './philosophers';
import { quizQuestions, getQuestionsFor } from './quizzes';
import { schools } from './schools';
import { schoolDetails } from './school-details';
import { historicalFacts } from './historical-facts';

/**
 * Content integrity suite: guarantees that every piece of content is fully
 * translated and that cross-references between schools, philosophers, quizzes
 * and graph relations never dangle.
 */

const philosopherSlugs = new Set(philosophers.map((p) => p.slug));
const schoolSlugs = new Set(schools.map((s) => s.slug));
const REGIONS = new Set(['china', 'india', 'japan']);
const RELATION_TYPES = new Set(['influence', 'opposition', 'synthesis', 'lineage']);

describe('dictionary', () => {
  it('has every UI string translated into every locale', () => {
    for (const [key, value] of Object.entries(dict)) {
      for (const locale of LOCALES) {
        expect(value[locale], `dict.${key}.${locale}`).toBeTruthy();
      }
    }
  });
});

describe('schools', () => {
  it('has unique slugs', () => {
    expect(schoolSlugs.size).toBe(schools.length);
  });

  it('only references existing philosophers', () => {
    for (const school of schools) {
      for (const slug of school.philosopherSlugs) {
        expect(philosopherSlugs.has(slug), `${school.slug} → ${slug}`).toBe(true);
      }
    }
  });

  it('has a valid region and a single-glyph emblem', () => {
    for (const school of schools) {
      expect(REGIONS.has(school.region), `${school.slug} region`).toBe(true);
      expect(school.emblem.length, `${school.slug} emblem`).toBeGreaterThan(0);
      expect([...school.emblem].length, `${school.slug} emblem is one glyph`).toBe(1);
    }
  });

  it('is fully translated', () => {
    for (const school of schools) {
      for (const locale of LOCALES) {
        expect(school.name[locale]).toBeTruthy();
        expect(school.description[locale]).toBeTruthy();
        expect(school.coreIdeas[locale].length).toBeGreaterThan(0);
      }
    }
  });

  it('has key works with bilingual titles', () => {
    for (const school of schools) {
      for (const work of school.keyWorks ?? []) {
        for (const locale of LOCALES) {
          expect(work.title[locale], `${school.slug} work title ${locale}`).toBeTruthy();
          expect(work.author[locale]).toBeTruthy();
        }
        expect(work.year).toBeTruthy();
      }
    }
  });
});

describe('graph relations', () => {
  it('references existing schools, never itself', () => {
    for (const school of schools) {
      for (const rel of school.relations) {
        expect(schoolSlugs.has(rel.to), `${school.slug} → ${rel.to}`).toBe(true);
        expect(rel.to).not.toBe(school.slug);
        expect(RELATION_TYPES.has(rel.type), `${school.slug} → ${rel.type}`).toBe(true);
      }
    }
  });

  it('declares each undirected edge only once', () => {
    const keys = schools.flatMap((s) =>
      s.relations.map((r) => [s.slug, r.to].sort().join('|')),
    );
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('school details', () => {
  it('aligns optional idea essays with core ideas and has translated context', () => {
    for (const [slug, detail] of Object.entries(schoolDetails)) {
      const school = schools.find((s) => s.slug === slug);
      expect(school, `details for unknown school ${slug}`).toBeTruthy();
      for (const locale of LOCALES) {
        if (detail.ideaDetails) {
          expect(detail.ideaDetails[locale].length, `${slug} ideaDetails ${locale}`).toBe(
            school!.coreIdeas[locale].length,
          );
        }
        expect(detail.contextLong[locale].length, `${slug} contextLong ${locale}`).toBeGreaterThan(0);
      }
    }
  });
});

describe('historical facts', () => {
  it('references existing schools and is fully translated', () => {
    for (const [slug, facts] of Object.entries(historicalFacts)) {
      expect(schoolSlugs.has(slug), `facts for unknown school ${slug}`).toBe(true);
      expect(facts.length, `${slug} facts`).toBeGreaterThan(0);
      for (const f of facts) {
        expect(f.year, `${slug} fact year`).toBeTruthy();
        for (const locale of LOCALES) {
          expect(f.fact[locale], `${slug} fact ${locale}`).toBeTruthy();
        }
      }
    }
  });
});

describe('philosophers', () => {
  it('has unique slugs', () => {
    expect(philosopherSlugs.size).toBe(philosophers.length);
  });

  it('belongs to existing schools, and every school lists it back', () => {
    for (const p of philosophers) {
      expect(p.schoolSlugs.length).toBeGreaterThan(0);
      for (const slug of p.schoolSlugs) {
        expect(schoolSlugs.has(slug), `${p.slug} → ${slug}`).toBe(true);
        const school = schools.find((s) => s.slug === slug)!;
        expect(school.philosopherSlugs, `${slug} should list ${p.slug}`).toContain(p.slug);
      }
    }
  });

  it('has complete, translated content sections', () => {
    for (const p of philosophers) {
      for (const locale of LOCALES) {
        expect(p.biography[locale].length, `${p.slug} biography ${locale}`).toBeGreaterThan(0);
        expect(p.contributions[locale].length).toBeGreaterThan(0);
        expect(p.traits[locale].length).toBeGreaterThan(0);
        expect(p.facts[locale].length).toBeGreaterThan(0);
      }
      expect(p.quotes.length, `${p.slug} quotes`).toBeGreaterThan(0);
      for (const quote of p.quotes) {
        for (const locale of LOCALES) expect(quote.text[locale]).toBeTruthy();
      }
    }
  });
});

describe('quiz questions', () => {
  it('has unique ids', () => {
    const ids = new Set(quizQuestions.map((q) => q.id));
    expect(ids.size).toBe(quizQuestions.length);
  });

  it('references existing philosophers, and every philosopher has a pool', () => {
    for (const q of quizQuestions) {
      expect(philosopherSlugs.has(q.philosopherSlug), q.id).toBe(true);
    }
    for (const slug of philosopherSlugs) {
      expect(getQuestionsFor(slug).length, `no quiz questions for ${slug}`).toBeGreaterThan(0);
    }
  });

  it('has exactly four distinct, translated options per locale', () => {
    for (const q of quizQuestions) {
      for (const locale of LOCALES) {
        const options = q.options[locale];
        expect(options, `${q.id} options ${locale}`).toHaveLength(4);
        expect(new Set(options).size, `${q.id} duplicate options in ${locale}`).toBe(4);
        expect(q.prompt[locale]).toBeTruthy();
        expect(q.explanation[locale]).toBeTruthy();
      }
    }
  });
});
