---
name: crm-portal-deployment
description: Build and deploy the Wemotoo CRM Portal (Nuxt) with Docker to Digital Ocean. Use when building images, pushing to registry.digitalocean.com/wemotoo/crm-portal or wemotoo/frontend, or running the portal container.
---

# Wemotoo CRM Portal Deployment

## Registries and Images

From the project README, both names appear in use:

- **CRM Portal:** `registry.digitalocean.com/wemotoo/crm-portal:latest`
- **Frontend (alt):** `registry.digitalocean.com/wemotoo/frontend:1.0.0`

Use the registry and tag that match your pipeline. App port in container: **3000**.

## Build and Push

Use **linux/amd64** for production (matches parent repo `docker-compose.yml` frontend platform).

**Build and push CRM portal:**
```bash
docker build --platform linux/amd64 -t registry.digitalocean.com/wemotoo/crm-portal:latest .
docker push registry.digitalocean.com/wemotoo/crm-portal:latest
```

**Pull:**
```bash
docker pull registry.digitalocean.com/wemotoo/crm-portal:latest
```

**Compose (down/up):**
```bash
docker compose down
docker compose up -d
```

**Compose build and run:**
```bash
docker-compose up --build wemotoo-crm
docker-compose build --no-cache frontend
```

**Run container in background (frontend image):**
```bash
docker run -d -p 3000:3000 --name wemotoo-crm registry.digitalocean.com/wemotoo/frontend:1.0.0
```

**Push both frontend and backend (when releasing together):**
```bash
docker push registry.digitalocean.com/wemotoo/frontend:1.0.0 && docker push registry.digitalocean.com/wemotoo/backend:1.0.0
```

**Pull both:**
```bash
docker pull registry.digitalocean.com/wemotoo/frontend:1.0.0
docker pull registry.digitalocean.com/wemotoo/backend:1.0.0
```

## Package Scripts (Docker)

From `package.json`:

- `docker:dev` – docker-compose with `docker-compose.dev.yml`, up --build
- `docker:prod` – docker-compose with `docker-compose.prod.yml`, up --build
- `docker:build:dev` – buildx linux/arm64, tag `wemotoo-crm:dev`
- `docker:build:prod` – buildx linux/amd64, tag `wemotoo-crm:prod`

## Dockerfile Notes

- **Build stage:** Bun + Node 20, `bun run build:prod` (Nuxt build); output in `.output/`.
- **Production stage:** `node:20-alpine`, copies `.output/`; runs `node .output/server/index.mjs`.
- **Env:** `NODE_ENV=production`, `PORT=3000`, `NITRO_HOST=0.0.0.0`, `NITRO_PORT=3000`.
- **User:** runs as non-root user `nuxt`.
- **Healthcheck:** wget to `http://127.0.0.1:3000` every 30s.

For production deploys (e.g. Digital Ocean), always use **linux/amd64** so the image matches the parent repo (`wemotoo-crm/docker-compose.yml` frontend `platform: linux/amd64`). Optionally copy `.env.prod` into the image if your setup expects it in the container.
