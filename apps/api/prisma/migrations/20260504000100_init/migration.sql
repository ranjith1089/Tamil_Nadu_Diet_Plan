-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('WEIGHT_LOSS', 'BELLY_FAT');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE');
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');
CREATE TYPE "DeviceType" AS ENUM ('GOOGLE_FIT', 'APPLE_HEALTH', 'SMARTWATCH', 'WEIGHT_SCALE');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "age" INTEGER,
  "gender" "Gender",
  "heightCm" DOUBLE PRECISION,
  "weightKg" DOUBLE PRECISION,
  "activityLevel" "ActivityLevel",
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserGoal" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "goalType" "GoalType" NOT NULL,
  "targetKg" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserGoal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FoodItem" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "calories" DOUBLE PRECISION NOT NULL,
  "protein" DOUBLE PRECISION NOT NULL,
  "carbs" DOUBLE PRECISION NOT NULL,
  "fat" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DietPlan" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "goalType" "GoalType" NOT NULL,
  "isPredefined" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DietPlan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DietPlanItem" (
  "id" TEXT NOT NULL,
  "dietPlanId" TEXT NOT NULL,
  "foodItemId" TEXT,
  "mealType" "MealType" NOT NULL,
  "quantity" DOUBLE PRECISION,
  "customMeal" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DietPlanItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FoodLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "foodItemId" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "calories" DOUBLE PRECISION NOT NULL,
  "protein" DOUBLE PRECISION NOT NULL,
  "carbs" DOUBLE PRECISION NOT NULL,
  "fat" DOUBLE PRECISION NOT NULL,
  "consumedAt" TIMESTAMP(3) NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FoodLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DailyLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "caloriesConsumed" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "caloriesTarget" DOUBLE PRECISION,
  "steps" INTEGER NOT NULL DEFAULT 0,
  "waterMl" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WeightLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "weightKg" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WeightLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DeviceData" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "deviceType" "DeviceType" NOT NULL,
  "source" TEXT,
  "date" TIMESTAMP(3) NOT NULL,
  "steps" INTEGER,
  "caloriesBurned" DOUBLE PRECISION,
  "weightKg" DOUBLE PRECISION,
  "rawPayload" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DeviceData_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "UserGoal_userId_key" ON "UserGoal"("userId");
CREATE UNIQUE INDEX "FoodItem_name_key" ON "FoodItem"("name");
CREATE INDEX "DietPlan_userId_idx" ON "DietPlan"("userId");
CREATE INDEX "DietPlanItem_dietPlanId_idx" ON "DietPlanItem"("dietPlanId");
CREATE INDEX "FoodLog_userId_date_idx" ON "FoodLog"("userId", "date");
CREATE UNIQUE INDEX "DailyLog_userId_date_key" ON "DailyLog"("userId", "date");
CREATE INDEX "DailyLog_userId_date_idx" ON "DailyLog"("userId", "date");
CREATE INDEX "WeightLog_userId_date_idx" ON "WeightLog"("userId", "date");
CREATE INDEX "DeviceData_userId_date_idx" ON "DeviceData"("userId", "date");

ALTER TABLE "UserGoal" ADD CONSTRAINT "UserGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DietPlan" ADD CONSTRAINT "DietPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DietPlanItem" ADD CONSTRAINT "DietPlanItem_dietPlanId_fkey" FOREIGN KEY ("dietPlanId") REFERENCES "DietPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DietPlanItem" ADD CONSTRAINT "DietPlanItem_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FoodLog" ADD CONSTRAINT "FoodLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FoodLog" ADD CONSTRAINT "FoodLog_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WeightLog" ADD CONSTRAINT "WeightLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeviceData" ADD CONSTRAINT "DeviceData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
