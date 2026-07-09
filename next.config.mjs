const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    // 'unsafe-inline' on script/style is a deliberate relaxation: the theme
    // bootstrap script in app/layout.tsx is inline (it must run before
    // hydration to avoid a flash of the wrong theme) and swagger-ui-react
    // injects inline styles. A stricter policy would need a per-request
    // nonce, which isn't worth it for a project without a real backend.
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self';",
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a self-contained `.next/standalone` folder with only the
  // production dependencies actually used, which keeps the Docker image lean.
  output: 'standalone',
  // msw (used only for local API mocking) ships several transitive
  // dependencies as ESM-only packages. Declaring them here lets both the
  // Next.js build and `next/jest` (via its generated transformIgnorePatterns)
  // transpile them instead of failing to parse `import` syntax inside
  // node_modules.
  transpilePackages: [
    'msw',
    '@mswjs/interceptors',
    '@bundled-es-modules',
    '@open-draft',
    'until-async',
    'strict-event-emitter',
    'headers-polyfill',
    'outvariant',
    'rettime',
  ],
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
}

export default nextConfig
