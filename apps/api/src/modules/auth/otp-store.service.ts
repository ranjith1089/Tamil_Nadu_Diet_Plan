import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

interface InMemoryOtpEntry {
  otp: string;
  expiresAt: number;
}

@Injectable()
export class OtpStoreService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OtpStoreService.name);
  private readonly fallbackStore = new Map<string, InMemoryOtpEntry>();
  private client?: ReturnType<typeof createClient>;
  private redisReady = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.getOrThrow<string>('REDIS_URL');

    this.client = createClient({ url: redisUrl });
    this.client.on('error', (error) => {
      this.redisReady = false;
      this.logger.error(`Redis OTP store error: ${error.message}`);
    });

    try {
      await this.client.connect();
      this.redisReady = true;
    } catch (error) {
      this.redisReady = false;

      if (this.configService.get<string>('NODE_ENV') === 'production') {
        throw error;
      }

      this.logger.warn(
        'Redis is unavailable; using in-memory OTP storage for local development.',
      );
    }
  }

  async onModuleDestroy() {
    if (this.client?.isOpen) {
      await this.client.quit();
    }
  }

  async setOtp(phone: string, otp: string, ttlSeconds: number) {
    if (this.redisReady && this.client) {
      await this.client.set(this.key(phone), otp, { EX: ttlSeconds });
      return;
    }

    this.fallbackStore.set(phone, {
      otp,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async getOtp(phone: string) {
    if (this.redisReady && this.client) {
      return this.client.get(this.key(phone));
    }

    const entry = this.fallbackStore.get(phone);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.fallbackStore.delete(phone);
      return null;
    }

    return entry.otp;
  }

  async deleteOtp(phone: string) {
    if (this.redisReady && this.client) {
      await this.client.del(this.key(phone));
      return;
    }

    this.fallbackStore.delete(phone);
  }

  private key(phone: string) {
    return `auth:otp:${phone}`;
  }
}
