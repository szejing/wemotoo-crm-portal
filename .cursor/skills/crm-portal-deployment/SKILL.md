---
name: crm-portal-deployment
description: Build and deploy the Wemotoo CRM stack (NestJS backend + Nuxt frontend) with Docker to Digital Ocean. Use when building images for ecommerce-nestjs or wemotoo-crm-portal, pushing to registry.digitalocean.com/wemotoo/wemotoo-ecommerce or wemotoo/wemotoo-crm-portal, or deploying with the root docker-compose.
---

# Wemotoo CRM Stack Deployment

Deploy **backend** (ecommerce-nestjs) and **frontend** (wemotoo-crm-portal) to Digital Ocean using the root repo `docker-compose.yml` at `wemotoo-crm/docker-compose.yml`.

## Registries and Images (from root docker-compose.yml)

| Service  | Context                | Image                                              | Port |
|----------|------------------------|----------------------------------------------------|------|
| Backend  | `ecommerce-nestjs/`    | `registry.digitalocean.com/wemotoo/wemotoo-ecommerce:1.0.0` | 8888 |
| Frontend | `wemotoo-crm-portal/` | `registry.digitalocean.com/wemotoo/wemotoo-crm-portal:1.0.0`  | 3000 |

Use **linux/amd64** for production (both services set `platform: linux/amd64` in root compose).

---

## 1. Build and push images

Run from the **monorepo root** (`wemotoo-crm/`) so paths match the compose file.

**Backend (ecommerce-nestjs):**
```bash
cd ecommerce-nestjs
docker build --platform linux/amd64 -t registry.digitalocean.com/wemotoo/wemotoo-ecommerce:1.0.0 .
docker push registry.digitalocean.com/wemotoo/wemotoo-ecommerce:1.0.0
cd ..
```

**Frontend (wemotoo-crm-portal):**
```bash
cd wemotoo-crm-portal
docker build --platform linux/amd64 -t registry.digitalocean.com/wemotoo/wemotoo-crm-portal:1.0.0 .
docker push registry.digitalocean.com/wemotoo/wemotoo-crm-portal:1.0.0
cd ..
```

**Build and push both (typical release):**
```bash
# From wemotoo-crm/
docker build --platform linux/amd64 -t registry.digitalocean.com/wemotoo/wemotoo-ecommerce:1.0.0 ./ecommerce-nestjs
docker build --platform linux/amd64 -t registry.digitalocean.com/wemotoo/wemotoo-crm-portal:1.0.0 ./wemotoo-crm-portal
docker push registry.digitalocean.com/wemotoo/wemotoo-ecommerce:1.0.0
docker push registry.digitalocean.com/wemotoo/wemotoo-crm-portal:1.0.0
```

**Using root docker-compose to build only (no push):**
```bash
# From wemotoo-crm/
docker compose build --platform linux/amd64
```

---

## 2. Deploy on Digital Ocean

**Prerequisites:** `doctl` installed and authenticated; env files present:
- `ecommerce-nestjs/.env.prod`
- `wemotoo-crm-portal/.env.prod`

**Login to registry:**
```bash
doctl registry login
```

**On the server (or from a machine that has the compose file and env):**
```bash
# From wemotoo-crm/
docker pull registry.digitalocean.com/wemotoo/wemotoo-ecommerce:1.0.0
docker pull registry.digitalocean.com/wemotoo/wemotoo-crm-portal:1.0.0
docker compose up -d
```

**Restart after config change:**
```bash
docker compose down
docker compose up -d
```

---

## 3. Backend (ecommerce-nestjs) notes

- **Dockerfile:** Multi-stage; builder runs `bun run build:prod`, production runs `bun init:prod` on port 8888.
- **Env:** Expects `NODE_ENV=prod`, `PORT=8888`; compose mounts `./ecommerce-nestjs/.env.prod` and volumes for `logs` and `uploads`.
- **Healthcheck:** `curl -f http://localhost:8888/health` every 30s.
- The repo’s `deploy.sh` uses a different image name/tag; for stack deploys use the images above to match root `docker-compose.yml`.

---

## 4. Frontend (wemotoo-crm-portal) notes

- **Dockerfile:** Build stage runs `bun run build:prod` (Nuxt); production runs `node .output/server/index.mjs` on port 3000.
- **Env:** `NODE_ENV=production`, `NITRO_HOST=0.0.0.0`, `NITRO_PORT=3000`; compose uses `./wemotoo-crm-portal/.env.prod`.
- **Healthcheck:** `curl -f http://localhost:3000` every 30s.
- **Compose:** Frontend `depends_on` backend with `condition: service_healthy`.

Use image `registry.digitalocean.com/wemotoo/wemotoo-crm-portal:1.0.0` when using the root docker-compose.

---

## 5. Package scripts (wemotoo-crm-portal)

From portal `package.json`:

- `docker:dev` – docker-compose with `docker-compose.dev.yml`, up --build
- `docker:prod` – docker-compose with `docker-compose.prod.yml`, up --build
- `docker:build:dev` – buildx linux/arm64, tag `wemotoo-crm:dev`
- `docker:build:prod` – buildx linux/amd64, tag `wemotoo-crm:prod`

For Digital Ocean production, use the root `wemotoo-crm/docker-compose.yml` and the `wemotoo-ecommerce` / `wemotoo-crm-portal` image names above.
