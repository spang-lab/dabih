# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dabih is a secure data storage platform with end-to-end encryption. The system consists of:

- **API Server** (`api/`) - Node.js/TypeScript backend using Koa, Prisma ORM, PostgreSQL, and Redis
- **Next.js Client** (`next/`) - React frontend with authentication and file management UI
- **Vite Client** (`vite/`) - Alternative React frontend using Vite
- **Tauri Desktop App** (`tauri/`) - Cross-platform desktop application
- **CLI Tool** (`cli/`) - Rust-based command-line interface

## Development Commands

### Initial Setup
```bash
# Install dependencies and set up database
cd api && npm install && npm run dev:migrate
cd ../next && npm install && npm run client
cd ../vite && npm install
```

### Development Environment
```bash
# Start full development environment (API + Vite client)
./start.sh

# Or start individual components:
cd api && npm run dev
cd vite && npm start
cd next && npm run start
```

### Database Operations
```bash
cd api
npm run dev:migrate          # Run database migrations
npm run studio              # Open Prisma Studio
npm run dev:startdb         # Start PostgreSQL container
npm run dev:startredis      # Start Redis container
```

### Testing
```bash
cd api
npm test                    # Run API tests with test database
npm run test:api           # Run tests only (requires test DB to be running)

cd next
npm test                   # Run Next.js tests

cd vite
npm test                   # Run Vite tests
```

### Build and Production
```bash
cd api
npm run build              # Build API (generates routes, docs, client types)
npm run build:client      # Generate client types from OpenAPI spec

cd next
npm run build             # Build Next.js app
npm run client            # Copy API types to Next.js

cd vite
npm run build            # Build Vite app
npm run openapi          # Copy API types to Vite
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
- PM2 configuration in `pm2.dev.config.cjs`
- Runs API server and Vite client concurrently
- Auto-restart disabled for development

### Type Safety
- Shared types between API and clients via OpenAPI generation
- Import paths configured in `api/package.json` for clean imports
- TypeScript strict mode enabled across all projects

### Testing Strategy
- AVA test framework for API tests
- Serial test execution to avoid database conflicts
- Separate test database and Redis instance
- Test utilities in `api/src/lib/ava.ts`