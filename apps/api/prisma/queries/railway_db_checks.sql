-- Railway Postgres verification queries for Tamil_Nadu_Diet_Plan
-- Run these in Railway "Database -> Data" SQL editor after migration deploy.

-- 1) List public tables created by Prisma migration
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2) Safe table check (works even when tables are not deployed yet)
WITH expected(table_name) AS (
  VALUES
    ('User'),
    ('UserGoal'),
    ('FoodItem'),
    ('DietPlan'),
    ('DietPlanItem'),
    ('FoodLog'),
    ('DailyLog'),
    ('WeightLog'),
    ('DeviceData')
)
SELECT
  e.table_name,
  CASE WHEN t.table_name IS NOT NULL THEN 'present' ELSE 'missing' END AS status
FROM expected e
LEFT JOIN information_schema.tables t
  ON t.table_schema = 'public'
 AND t.table_name = e.table_name
ORDER BY e.table_name;

-- 3) Approximate row counts for existing tables only (never fails on missing tables)
SELECT relname AS table_name, n_live_tup::bigint AS approx_rows
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND relname IN ('User', 'UserGoal', 'FoodItem', 'DietPlan', 'DietPlanItem', 'FoodLog', 'DailyLog', 'WeightLog', 'DeviceData')
ORDER BY relname;

-- 4) Optional: seed initial Tamil Nadu food catalog
INSERT INTO "FoodItem" ("id", "name", "calories", "protein", "carbs", "fat", "createdAt", "updatedAt") VALUES
  ('food_idli', 'idli', 58, 2.0, 12.0, 0.4, NOW(), NOW()),
  ('food_dosa', 'dosa', 133, 3.0, 18.0, 5.0, NOW(), NOW()),
  ('food_sambar', 'sambar', 80, 3.0, 10.0, 3.0, NOW(), NOW()),
  ('food_rice', 'rice', 130, 2.7, 28.0, 0.3, NOW(), NOW()),
  ('food_pongal', 'pongal', 190, 5.0, 28.0, 6.0, NOW(), NOW()),
  ('food_chapati', 'chapati', 120, 3.5, 20.0, 2.5, NOW(), NOW()),
  ('food_chicken', 'chicken', 239, 27.0, 0.0, 14.0, NOW(), NOW()),
  ('food_fish', 'fish', 206, 22.0, 0.0, 12.0, NOW(), NOW())
ON CONFLICT ("name") DO NOTHING;

-- 5) Verify seeded foods
SELECT "name", "calories", "protein", "carbs", "fat"
FROM "FoodItem"
ORDER BY "name";
