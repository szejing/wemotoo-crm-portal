# ==============================
# Build stage
# ==============================
# Use buildx for multi-platform support
# For local development: native architecture (arm64 on Apple Silicon)
# For production: amd64 for Digital Ocean
FROM --platform=${BUILDPLATFORM:-linux/arm64} oven/bun:1 AS builder

WORKDIR /app

# Install git for git-based dependencies
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy dependency files first (better caching)
COPY package.json bun.lockb ./

# Install ALL deps (dev + prod)
RUN bun install --frozen-lockfile

# Copy full project
COPY . .

# Build Nuxt app (production) with increased memory
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN bun run build:prod


# ==============================
# Production stage
# ==============================
# Always use target platform for production (amd64 for Digital Ocean)
FROM --platform=${TARGETPLATFORM:-linux/amd64} node:20-alpine AS production

WORKDIR /app

# Copy only built output (server + public assets)
COPY --from=builder /app/.output/ ./.output/

# Copy package.json (useful for debugging/env checks)
COPY --from=builder /app/package.json ./

# Copy environment file if it exists
COPY .env.prod* ./

# Env vars
ENV NODE_ENV=production
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001

# Set permissions
RUN chown -R nuxt:nodejs /app
USER nuxt

# Expose Nuxt app port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000 || exit 1

# Start Nuxt SSR server
CMD ["node", ".output/server/index.mjs"]
