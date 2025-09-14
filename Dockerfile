# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Install git for git dependencies
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package.json bun.lockb ./

# Install dependencies with proper Git handling
RUN bun install --frozen-lockfile

# Copy source code and configuration
COPY . .

# Build the application
RUN bun run build:prod

# Production stage - use Node.js for runtime compatibility
FROM node:20-alpine AS production

WORKDIR /app

# Copy the built application with all dependencies included
COPY --from=builder /app/.output ./.output

# Copy package.json for reference (optional)
COPY --from=builder /app/package.json ./

# Set environment variables
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

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]
