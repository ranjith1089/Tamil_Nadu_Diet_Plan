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
