
FROM node:18-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY package.json package-lock.json ./ 
RUN npm ci

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY . .

# Create and give access to folders and files that will be edited during build time
RUN mkdir -p .next
RUN touch next-env.d.ts
RUN chmod -R ugo+rwX .next next-env.d.ts

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["/bin/sh", "-c", "npm run build && npm run prod"]
