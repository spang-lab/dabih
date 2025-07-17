# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dabih is a secure data storage platform with end-to-end encryption. The system consists of:

- **API Server** (`api/`) - Node.js/TypeScript backend using Koa, Prisma ORM, PostgreSQL, and Redis
- **Vite Client** (`vite/`) - React frontend with authentication and file management UI
- **CLI Tool** (`cli/`) - Rust-based command-line interface with OpenAPI client generation

## Development Commands

### Initial Setup
```bash
# Install dependencies and set up database
cd api && npm install && npm run dev:migrate
cd ../vite && npm install
```

### Development Environment
```bash
# Start full development environment (API + Vite client) - uses PM2
./start.sh

# Or start individual components:
cd api && npm run dev
cd vite && npm start
```

### Database Operations
```bash
cd api
npm run dev:migrate          # Run database migrations
npm run studio              # Open Prisma Studio
npm run dev:startdb         # Start PostgreSQL container (pg-dabih)
npm run dev:stopdb          # Stop and remove PostgreSQL container
npm run dev:startredis      # Start Redis container (redis-dabih)
npm run dev:stopredis       # Stop and remove Redis container
```

### Testing
```bash
cd api
npm test                    # Full test suite: setup test DB, run tests with AVA --serial, cleanup
npm run test:api           # Run tests only (requires test DB/Redis to be running)
npm run test:startdb       # Start PostgreSQL test container on port 15432
npm run test:stopdb        # Stop and remove PostgreSQL test container
npm run test:startredis    # Start Redis test container on port 6380
npm run test:stopredis     # Stop and remove Redis test container
npm run test:clean         # Remove test data directory
npm run test:prepare       # Deploy Prisma migrations to test database

cd vite
npm test                   # Run Vite tests with AVA
```

### Build and Production
```bash
cd api
npm run build              # Full build: TSOA spec+routes, OpenAPI docs, client types
npm run build:tsoa        # Generate TSOA spec and routes (basePath: /api/v1)
npm run build:docs        # Generate OpenAPI documentation with Redocly
npm run build:client      # Generate TypeScript client types from OpenAPI spec

cd vite
npm run build            # Build Vite app (TypeScript check + Vite build)
npm run openapi          # Copy API types (api.ts, schema.d.ts) to Vite client
npm run start            # Copy API types and start dev server
```

### Code Quality
```bash
cd api && npm run lint
cd next && npm run lint
cd vite && npm run lint
```

## Architecture

### Authentication & Security
- JWT-based authentication with refresh tokens
- End-to-end encryption for file storage
- Multiple authentication providers (UR, GitHub, demo mode)
- Role-based access control with permissions

### Data Layer
- PostgreSQL database with Prisma ORM
- Redis for caching and session management
- File storage with encryption at rest
- Database migrations in `api/prisma/migrations/`

### API Structure
- RESTful API built with Koa and TSOA
- OpenAPI specification auto-generated
- Controllers in `api/src/api/*/controller.ts`
- Route registration via TSOA decorators
- Middleware for logging, error handling, serialization

### Frontend Architecture
- React with TypeScript
- Zustand for state management
- React Router (Vite) / Next.js routing
- Tailwind CSS for styling
- File upload/download with progress tracking
- Drag-and-drop file management

### Key Components
- **File System** (`api/src/api/fs/`) - File and directory operations
- **Upload/Download** (`api/src/api/upload/`, `api/src/api/download/`) - File transfer logic
- **Authentication** (`api/src/api/auth/`) - Sign-in, token management
- **User Management** (`api/src/api/user/`) - User CRUD operations
- **Job System** (`api/src/api/job/`) - Background task processing

### Crypto Implementation
- Custom cryptography library in `api/src/lib/crypto/`
- AES encryption for file data
- RSA key pairs for user authentication
- JWT tokens for session management

## Development Notes

### Environment Files
- `.env.dev` - Development environment (API)
- `.env.test` - Test environment (API)
- `.env.local` - Local overrides (API)

### Process Management
- PM2 configuration in `pm2.config.cjs`
- Runs API server and Vite client concurrently
- Auto-restart disabled for development
- Start via `./start.sh` which runs `pm2-runtime pm2.config.cjs`

### Type Safety
- Shared types between API and clients via OpenAPI generation
- Import aliases in API: `#lib/*`, `#crypto`, `#ava` (configured in package.json)
- TypeScript strict mode enabled across all projects

### Testing Strategy
- AVA test framework with `--serial` flag for both API and Vite tests
- Serial test execution to avoid database conflicts
- Separate test database (port 15432) and Redis instance (port 6380)
- Test utilities in `api/src/lib/ava.ts`: `client()`, `addFile()`, `addDirectory()`, `addUser()`
- Test files follow pattern `./**/*.test.ts`
- Uses `tsx` for TypeScript execution in tests

### Worker System
- Background processing using Piscina worker threads
- Search functionality runs in separate workers
- Worker wrapper (`api/src/worker/wrapper.cjs`) handles TypeScript execution
- Job management via Redis-backed queue system

### Container Architecture
- PostgreSQL development container: `pg-dabih` (port 5432)
- Redis development container: `redis-dabih` (port 6379)
- Test containers: `pg-dabih-test` (port 15432), `redis-dabih-test` (port 6380)
- Multi-stage Docker build: API builder → Vite builder → Production runner
- Production image serves Vite client from API's `/dist` folder via koa-static

### CLI Development
- Rust-based CLI with OpenAPI client generation
- Uses `openapi-generator` via `cli/generate.sh`
- Cargo workspace with separate OpenAPI client library in `cli/openapi/`
- Main CLI source in `cli/src/` with config, error handling, and private key modules

### Version Management
- Coordinated versioning via `./version.sh` script
- Updates API, Vite, and CLI versions simultaneously
- Automatically commits and tags releases

### Docker Deployment
```bash
# Build production image
docker build -t dabih:latest .

# Run with environment variables
docker run -p 3000:3000 --env-file .env dabih:latest
```

**Build Process:**
1. **API Builder**: Installs dependencies, builds TSOA routes/spec, generates OpenAPI docs and client types
2. **Vite Builder**: Installs dependencies, copies API types, builds Vite client with assets
3. **Production Runner**: Copies API source, build artifacts, and Vite dist to final image