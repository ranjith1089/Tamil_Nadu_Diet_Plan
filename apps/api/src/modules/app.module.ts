import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IsBoolean, IsInt, IsOptional, IsString, Min, validateSync } from 'class-validator';
import { AuthModule } from './auth/auth.module';
import { FoodsModule } from './foods/foods.module';

class EnvironmentVariables {
  @IsOptional()
  @IsString()
  NODE_ENV?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  API_PORT?: number;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  REDIS_URL!: string;

  @IsString()
  JWT_ACCESS_SECRET!: string;

  @IsOptional()
  @IsString()
  JWT_ACCESS_TTL?: string;

  @IsOptional()
  @IsInt()
  @Min(60)
  OTP_TTL_SECONDS?: number;

  @IsOptional()
  @IsBoolean()
  OTP_DEBUG_RESPONSE?: boolean;
}

function parseBoolean(value: unknown, defaultValue = false) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const validated = new EnvironmentVariables();
        validated.NODE_ENV = config.NODE_ENV;
        validated.API_PORT = config.API_PORT ? Number(config.API_PORT) : 4000;
        validated.DATABASE_URL = config.DATABASE_URL;
        validated.REDIS_URL = config.REDIS_URL;
        validated.JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET;
        validated.JWT_ACCESS_TTL = config.JWT_ACCESS_TTL || '15m';
        validated.OTP_TTL_SECONDS = config.OTP_TTL_SECONDS
          ? Number(config.OTP_TTL_SECONDS)
          : 300;
        validated.OTP_DEBUG_RESPONSE = parseBoolean(config.OTP_DEBUG_RESPONSE);

        const errors = validateSync(validated, {
          skipMissingProperties: false,
        });

        if (errors.length > 0) {
          throw new Error(errors.toString());
        }

        return validated;
      },
    }),
    AuthModule,
    FoodsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
