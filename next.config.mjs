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
}

export default nextConfig
