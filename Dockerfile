# Build stage
FROM --platform=linux/amd64 oven/bun:1 AS builder

WORKDIR /app

# Copy package files first
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build:prod

# Production stage
FROM --platform=linux/amd64 oven/bun:1

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/.output ./
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["bun", "start:prod"] 
