import { IsOptional, IsString, MaxLength } from 'class-validator';

export class FoodQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
