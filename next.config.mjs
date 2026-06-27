import withPWA from 'next-pwa';
import withBundleAnalyzer from '@next/bundle-analyzer';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Content-Security-Policy.
 *
 * `style-src` keeps `'unsafe-inline'` because Next.js and the design system
 * inject inline styles (CSS variables per school accent). Google Fonts are
 * pulled from fonts.googleapis.com (stylesheets) and fonts.gstatic.com (woff2).
 * `script-src` allows `'unsafe-eval'` only in development (Next's fast refresh).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  'font-src \'self\' https://fonts.gstatic.com data:',
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "worker-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
]
  .join('; ')
  .concat(';');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  async redirects() {
    return [
      // The app lives entirely under /<locale>; send the root to the default locale.
      { source: '/', destination: '/en', permanent: false },
    ];
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // The service-worker script must never be served from the HTTP cache,
      // otherwise the browser keeps revalidating against a stale copy and a
      // newly deployed worker (with skipWaiting) is never picked up. Forcing
      // revalidation is what guarantees a fresh deploy reaches installed PWAs.
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
      },
    ];
  },
};

const analyze = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

export default analyze(withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  // Activate a freshly deployed service worker immediately and take control of
  // all open tabs, instead of waiting until every tab is closed. This is what
  // makes new deploys show up on the next load rather than days later.
  skipWaiting: true,
  // When connectivity is (re)gained, reload so the latest assets are shown.
  reloadOnOnline: true,
  // Always fetch the HTML document from the network first (falling back to the
  // cache only when offline), so a new deploy's markup — which points at the
  // new hashed CSS/JS — is picked up right away.
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-pages',
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/_next/static/'),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-static',
        expiration: { maxEntries: 128, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: ({ url }) =>
        url.origin === 'https://fonts.googleapis.com' ||
        url.origin === 'https://fonts.gstatic.com',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 16, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/figures/') || url.pathname.endsWith('.svg'),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
  ],
})(nextConfig));
