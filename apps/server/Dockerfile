# ── 后端 Dockerfile（多阶段构建）──
FROM node:22-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/config/package.json ./packages/config/package.json
RUN pnpm install --frozen-lockfile

# 构建
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .
RUN pnpm --filter @mono/server build

# 运行
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/.env.production ./.env.production
EXPOSE 3001
CMD ["node", "dist/index.js"]
