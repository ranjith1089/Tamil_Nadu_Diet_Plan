# Tamil Nadu Health & Fitness SaaS Monorepo

Production-ready monorepo scaffold for a health and fitness SaaS platform focused on:
- Weight loss
- Belly fat reduction
- Tamil Nadu diet system
- Calorie tracking
- Smartwatch and weight scale integration

## Tech Stack
- **Web:** Next.js (TypeScript)
- **API:** NestJS (TypeScript)
- **Mobile:** Flutter (Dart)
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma
- **Cache:** Redis (Railway)

## Monorepo Structure

```text
apps/
  api/        # NestJS backend
  web/        # Next.js frontend
  mobile/     # Flutter mobile app
packages/
  shared/     # Shared types, constants, utilities
infra/
  docker/     # Docker and local infrastructure files
```

## Quick Start

### 1) Prerequisites
- Node.js 20+
- pnpm 9+
- Flutter 3.22+
- Docker (optional for local DB/Redis)

### 2) Install dependencies
```bash
pnpm install
```

### 3) Start scaffold dev commands
```bash
pnpm dev
```

## Step 1 Scope
This commit includes the initial monorepo structure and project setup only.
Implementation modules (auth, food APIs, tracking, frontend screens, mobile flows) will be added in subsequent steps.


## Vercel Deployment (Web)
If Vercel shows **"No Deployment Code"**, configure the project as a monorepo web deployment:

1. Import the repository in Vercel.
2. Set **Root Directory** to `apps/web`.
3. Framework preset: **Next.js**.
4. Build command: `pnpm build` (inside `apps/web`) or leave default.
5. Install command: `pnpm install`.
6. Add env variable in Vercel project settings:
   - `NEXT_PUBLIC_API_BASE_URL`

A root `vercel.json` is included to explicitly point Vercel to the Next.js app entry (`apps/web/package.json`) for deployments where root detection fails.

## Railway Postgres: create tables + verify

From `apps/api`, run Prisma migration deploy:

```bash
pnpm prisma:migrate:deploy
```

This creates application tables in Railway Postgres.

If you want ready SQL queries for table verification and Tamil Nadu food seed data, use:

```text
apps/api/prisma/queries/railway_db_checks.sql
```

The query file includes a **safe missing/present table check** so it can run even before tables are created.

Step 2 backend deliverables now include:
- Prisma schema at `apps/api/prisma/schema.prisma`
- Initial migration SQL under `apps/api/prisma/migrations/*`

Step 3 backend deliverables now include:
- Auth endpoints: `POST /auth/login` and `POST /auth/verify-otp`
- Global DTO validation pipe in API bootstrap

Step 4 backend deliverables now include:
- Food endpoints: `GET /foods`, `GET /foods?search=`, and `GET /foods/:id`
- Repeatable Tamil Nadu food seed script: `pnpm prisma:seed`
- Reusable Prisma database module for API repositories

## Deployment Troubleshooting (Railway + Vercel)

### Railway build error: `TS5095 Option 'bundler'...`
- Cause: API inherited root TypeScript `moduleResolution: Bundler` while using `module: CommonJS`.
- Fix applied: API tsconfig now explicitly uses `moduleResolution: Node`.

### Railway error: `No start command detected`
- For API service, set Railway service Root Directory to `apps/api` and use:
  - Build command: `pnpm run build`
  - Start command: `pnpm run start`
- If deploying from monorepo root, these scripts are available:
  - `pnpm run build:api`
  - `pnpm run start:api`
- Do **not** connect your GitHub repo to the Railway Postgres service; it is a database service and should not run build/start steps.

### Vercel 404 (`NOT_FOUND`)
- Ensure project Root Directory is `apps/web`.
- Ensure a successful deployment exists for the domain.
- Confirm `NEXT_PUBLIC_API_BASE_URL` is set in Vercel project environment variables.
