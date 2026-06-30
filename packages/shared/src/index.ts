export type GoalType = 'WEIGHT_LOSS' | 'BELLY_FAT';

export type ActivityLevel =
  | 'SEDENTARY'
  | 'LIGHT'
  | 'MODERATE'
  | 'ACTIVE'
  | 'VERY_ACTIVE';

export interface UserProfileBase {
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  heightCm: number;
  weightKg: number;
  goal: GoalType;
  activityLevel: ActivityLevel;
}
