# API App (NestJS)

Initial scaffold for modular monolith backend. Feature modules (auth, food, tracking, diet, device) will be implemented in subsequent steps.

## Step 2 (Backend + Prisma + PostgreSQL)

### Required environment variables
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `API_PORT` (optional, default `4000`)

### Prisma commands
Run inside `apps/api`:

```bash
pnpm prisma:generate
pnpm prisma:migrate:deploy
```

For local development migration creation:

```bash
pnpm prisma:migrate:dev --name init
```

## Step 3 (Authentication)

Implemented endpoints:
- `POST /auth/login` (request OTP)
- `POST /auth/verify-otp` (verify OTP and issue JWT access token)

Notes:
- OTP is currently generated and returned by API response for scaffold/testing.
- Production SMS provider integration will replace this in later steps.
