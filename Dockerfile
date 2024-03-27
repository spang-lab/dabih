FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY next/package.json next/package-lock.json ./ 
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY next .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build


# Production image, copy all the files and run next
FROM base AS runner
RUN npm install pm2 -g

WORKDIR /app/next
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

WORKDIR /app/api
COPY api .
RUN npm ci

WORKDIR /app
COPY helpers.cjs helpers.cjs
COPY prod.config.cjs prod.config.cjs

EXPOSE 3000
ENV PORT 3000

CMD ["pm2-runtime", "pm2.prod.config.cjs"]



