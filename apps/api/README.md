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
- OTP is stored in Redis using `REDIS_URL`.
- In local development only, the API falls back to in-memory OTP storage if Redis is unavailable.
- OTP values are not returned by default. Set `OTP_DEBUG_RESPONSE=true` only for local testing.
- Production SMS provider integration should deliver the generated OTP.

## Step 4 (Food Database + APIs)

Implemented endpoints:
- `GET /foods` (list all food items)
- `GET /foods?search=idli` (search food items by name)
- `GET /foods/:id` (get one food item by id)

Seed Tamil Nadu food catalog:

```bash
pnpm prisma:seed
```

Initial seeded foods:
- idli
- dosa
- sambar
- rice
- pongal
- chapati
- chicken
- fish
