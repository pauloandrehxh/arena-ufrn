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
RUN apk add --no-cache python3 make g++ \
    && corepack enable \
    && corepack prepare pnpm@12.3.4 --activate
COPY backend/package.json backend/pnpm-lock.yaml backend/pnpm-workspace.yaml \
    backend/prisma7.config.ts ./
COPY backend/prisma ./prisma
ENV DATABASE_URL=file:./dev.db
RUN pnpm install --frozen-lockfile \
    && pnpm prisma generate --config prisma7.config.ts

FROM node:22-alpine AS runner
WORKDIR /app/backend
ENV NODE_ENV=production \
    PORT=10000 \
    DATABASE_URL=file:/data/arena.db \
    SERVE_STATIC=true \
    PUBLIC_DIR=/app/public
RUN mkdir -p /data /app/public
COPY --from=backend-deps /app/backend/node_modules ./node_modules
COPY --from=backend-deps /app/backend/package.json ./package.json
COPY --from=backend-deps /app/backend/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=backend-deps /app/backend/prisma7.config.ts ./prisma7.config.ts
COPY --from=backend-deps /app/backend/prisma ./prisma
COPY backend/server.js ./server.js
COPY backend/src ./src
COPY --from=frontend-build /app/dist /app/public
EXPOSE 10000
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy --config prisma7.config.ts && node server.js"]
