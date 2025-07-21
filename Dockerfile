FROM node:24-alpine AS base

FROM base AS api-builder
WORKDIR /app
COPY api/package*.json ./
RUN npm ci
COPY api .
RUN npm run build



# Build stage for Vite client
FROM base AS vite-builder
WORKDIR /vite
COPY vite/package*.json .
RUN npm ci
COPY vite .


# Copy generated API types from api-builder to expected location
COPY --from=api-builder /app/build/api.ts /vite/src/lib/api/
COPY --from=api-builder /app/build/schema.d.ts /vite/src/lib/api/
COPY --from=api-builder /app/src/api/types /vite/src/lib/api/types

RUN npm run build



# Production runner stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production


COPY --from=api-builder /app/node_modules /app/node_modules
COPY --from=api-builder /app/build/app /app
COPY --from=api-builder /app/package.json /app/package.json
COPY --from=api-builder /app/prisma /app/prisma
COPY --from=api-builder /app/info.yaml /app/info.yaml
COPY --from=vite-builder /vite/dist /app/dist


EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]




