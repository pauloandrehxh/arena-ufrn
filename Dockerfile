# syntax=docker/dockerfile:1

FROM node:22-alpine AS frontend-build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@12.3.4 --activate
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm build

FROM node:22-alpine AS backend-deps
WORKDIR /app/backend
RUN corepack enable && corepack prepare pnpm@12.3.4 --activate
COPY backend/package.json backend/pnpm-lock.yaml backend/pnpm-workspace.yaml \
    backend/prisma7.config.ts ./
COPY backend/prisma ./prisma
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN pnpm install --frozen-lockfile \
    && pnpm prisma generate --config prisma7.config.ts

FROM node:22-alpine AS runner
WORKDIR /app/backend
ENV NODE_ENV=production \
    PORT=10000 \
    SERVE_STATIC=true \
    PUBLIC_DIR=/app/public

RUN mkdir -p /app/backend /app/public && chown -R node:node /app

COPY --chown=node:node --from=backend-deps /app/backend/node_modules ./node_modules
COPY --chown=node:node --from=backend-deps /app/backend/package.json ./package.json
COPY --chown=node:node --from=backend-deps /app/backend/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --chown=node:node --from=backend-deps /app/backend/prisma7.config.ts ./prisma7.config.ts
COPY --chown=node:node --from=backend-deps /app/backend/prisma ./prisma
COPY --chown=node:node backend/server.js ./server.js
COPY --chown=node:node backend/src ./src
COPY --chown=node:node --from=frontend-build /app/dist /app/public

USER node

EXPOSE 10000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 10000) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy --config prisma7.config.ts && node server.js"]
