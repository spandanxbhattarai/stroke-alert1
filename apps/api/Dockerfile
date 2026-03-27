FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/api/prisma ./apps/api/prisma
RUN bun install
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
RUN cd packages/shared && bunx tsc
RUN cd apps/api && bunx tsc
ENV NODE_ENV=production
WORKDIR /app/apps/api
EXPOSE 10000
CMD ["sh", "-c", "bunx prisma db push --skip-generate 2>/dev/null; bun run dist/server.js"]
