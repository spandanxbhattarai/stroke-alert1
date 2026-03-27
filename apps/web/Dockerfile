FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN bun install
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web
RUN cd packages/shared && bunx tsc
RUN cd apps/web && bunx next build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000
WORKDIR /app/apps/web
CMD ["bunx", "next", "start", "-p", "3000"]
