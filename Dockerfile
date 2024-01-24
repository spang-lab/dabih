FROM node:20-alpine AS base
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN apk add --no-cache libc6-compat

RUN mkdir -p /app/api
RUN mkdir -p /app/client

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app/api
COPY api/package.json api/package-lock.json ./ 
RUN npm ci
COPY api /app/api


WORKDIR /app/client
COPY client/package.json client/package-lock.json ./ 
RUN npm ci
COPY client /app/client
RUN npm run build









FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./ 
RUN npm ci


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1


COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
