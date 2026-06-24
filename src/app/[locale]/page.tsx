import { GraphDashboard } from '@/components/graph/GraphDashboard';
import type { Locale } from '@/lib/i18n';

/**
 * One-page experience: an interactive 3D constellation of the schools of
 * Eastern thought occupies the first section; selecting a node opens that
 * school's full dossier — sages, tenets, quizzes, bibliography and
 * connections — directly below.
 */
export default function HomePage({ params }: { params: { locale: Locale } }) {
  return <GraphDashboard locale={params.locale} />;
}
