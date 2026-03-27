FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN bun install
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
RUN cd packages/shared && bunx tsc
RUN cd apps/api && bunx tsc
RUN cd apps/api && bunx prisma generate

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push --skip-generate 2>/dev/null; node dist/server.js"]
