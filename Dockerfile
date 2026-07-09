# syntax=docker/dockerfile:1

# ---- deps: install once, cached between builds while package*.json is unchanged
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: compile the Next.js standalone output
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# There is no real backend for this challenge, so MSW is baked into the
# production bundle by default. Override at build time (--build-arg) to
# point the app at a real API instead.
ARG NEXT_PUBLIC_API_URL=/api
ARG NEXT_PUBLIC_ENABLE_MSW=true
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_ENABLE_MSW=${NEXT_PUBLIC_ENABLE_MSW}
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- runner: minimal image with only the standalone server + static assets
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
