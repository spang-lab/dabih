FROM node:24-alpine AS base

# Build stage for API (generates OpenAPI types)
FROM base AS api-builder
WORKDIR /app
COPY api/package*.json ./
RUN npm ci
COPY api .
RUN npm run build



# Build stage for Vite client
FROM base AS vite-builder
WORKDIR /app
COPY vite/package*.json ./vite/
RUN cd vite && npm ci
COPY vite ./vite


# Copy generated API types from api-builder to expected location
COPY --from=api-builder /app/build/api.ts /app/src/lib/api/
COPY --from=api-builder /app/build/schema.d.ts /app/src/lib/api/
COPY --from=api-builder /app/src/api/types /app/src/lib/api/types



# Build the vite client
RUN cd vite && npm run build

# Production runner stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install API dependencies
COPY api/package*.json ./
RUN npm ci 


EXPOSE 3000
ENV PORT=3000

CMD ["node", "build/server.cjs"]




