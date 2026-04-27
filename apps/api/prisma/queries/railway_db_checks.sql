-- Railway Postgres verification queries for Tamil_Nadu_Diet_Plan
-- Run these in Railway "Database -> Data" SQL editor after migration deploy.

-- 1) List public tables created by Prisma migration
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2) Check row counts of core tables
SELECT 'User' AS table_name, COUNT(*)::int AS row_count FROM "User"
UNION ALL
SELECT 'UserGoal', COUNT(*)::int FROM "UserGoal"
UNION ALL
SELECT 'FoodItem', COUNT(*)::int FROM "FoodItem"
UNION ALL
SELECT 'DietPlan', COUNT(*)::int FROM "DietPlan"
UNION ALL
SELECT 'DietPlanItem', COUNT(*)::int FROM "DietPlanItem"
UNION ALL
SELECT 'FoodLog', COUNT(*)::int FROM "FoodLog"
UNION ALL
SELECT 'DailyLog', COUNT(*)::int FROM "DailyLog"
UNION ALL
SELECT 'WeightLog', COUNT(*)::int FROM "WeightLog"
UNION ALL
SELECT 'DeviceData', COUNT(*)::int FROM "DeviceData";

-- 3) Optional: seed initial Tamil Nadu food catalog
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

-- 4) Verify seeded foods
SELECT "name", "calories", "protein", "carbs", "fat"
FROM "FoodItem"
ORDER BY "name";
