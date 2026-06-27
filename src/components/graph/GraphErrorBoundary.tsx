'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { dict } from '@/data/dictionary';
import { t, type Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches WebGL / Three.js errors that would otherwise produce a blank canvas
 * with no feedback. Falls back to a styled message that lets the user continue
 * using the accessible list view.
 */
export class GraphErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in all envs; replace with Sentry/Vercel log in production.
    console.error('[GraphScene]', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const { locale } = this.props;
    return (
      <div className="graph-error">
        <span className="graph-error__icon" aria-hidden="true">◇</span>
        <p className="graph-error__msg mono">
          {locale === 'pt'
            ? 'O grafo 3D não pôde ser carregado neste dispositivo.'
            : 'The 3D graph could not be loaded on this device.'}
        </p>
        <p className="graph-error__sub">
          {locale === 'pt'
            ? 'Use o botão ☰ acima para navegar pela lista acessível.'
            : 'Use the ☰ button above to browse the accessible list view.'}
        </p>
        <button
          className="btn-ghost"
          onClick={() => this.setState({ error: null })}
        >
          {t(dict.playAgain, locale).replace('(new questions)', '').trim()} ↺
        </button>
      </div>
    );
  }
}
