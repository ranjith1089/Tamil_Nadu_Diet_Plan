import { randomInt } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { OtpStoreService } from './otp-store.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly otpStore: OtpStoreService,
    private readonly prisma: PrismaService,
  ) {}

  async requestOtp(phone: string) {
    const ttlSeconds = this.configService.get<number>('OTP_TTL_SECONDS', 300);
    const otp = randomInt(100000, 1000000).toString();
    await this.otpStore.setOtp(phone, otp, ttlSeconds);

    const response: {
      message: string;
      expiresIn: number;
      devOtp?: string;
    } = {
      message: 'OTP generated successfully',
      expiresIn: ttlSeconds,
    };

    if (this.configService.get<boolean>('OTP_DEBUG_RESPONSE', false)) {
      response.devOtp = otp;
    }

    return response;
  }

  async verifyOtp(phone: string, otp: string) {
    const storedOtp = await this.otpStore.getOtp(phone);

    if (!storedOtp) {
      throw new UnauthorizedException('OTP not requested for this phone');
    }

    if (storedOtp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    await this.otpStore.deleteOtp(phone);

    const user = await this.prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone },
    });

    const accessToken = this.jwtService.sign(
      { sub: user.id, phone },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TTL', '15m'),
      },
    );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.configService.get<string>('JWT_ACCESS_TTL', '15m'),
      user: {
        id: user.id,
        phone: user.phone,
      },
    };
  }
}
