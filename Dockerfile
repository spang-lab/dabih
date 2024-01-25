FROM node:20-alpine
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN apk add --no-cache libc6-compat
RUN npm install pm2 -g

RUN mkdir -p /app/api
RUN mkdir -p /app/client
RUN mkdir -p /app/nextjs

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app/api
COPY api/package.json api/package-lock.json ./ 
RUN npm ci
COPY api .


WORKDIR /app/client
COPY client/package.json client/package-lock.json ./ 
RUN npm ci
COPY client .
RUN npm run build

WORKDIR /app/nextjs
RUN cp -r /app/client/public ./public
RUN cp -r /app/client/.next/standalone ./
RUN cp -r /app/client/.next/static ./.next/static


WORKDIR /app
COPY ecosystem.config.js ecosystem.config.js

EXPOSE 3000
ENV PORT 3000

CMD ["pm2-runtime", "ecosystem.config.js"]



