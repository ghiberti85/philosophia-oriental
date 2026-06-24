import withPWA from 'next-pwa';

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
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default withPWA({
  dest: 'public',
  disable: isDev,
})(nextConfig);
