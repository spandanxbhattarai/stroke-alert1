FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN bun install
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web
RUN cd packages/shared && bunx tsc
RUN cd apps/web && bunx next build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
RUN npm install -g next@14.0.4
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/next.config.js ./apps/web/next.config.js
COPY --from=builder /app/apps/web/.next ./apps/web/.next
EXPOSE 3000
CMD ["npx", "next", "start", "apps/web", "-p", "3000"]
