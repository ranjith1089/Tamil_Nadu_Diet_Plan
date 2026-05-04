import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface OtpEntry {
  otp: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private readonly otpStore = new Map<string, OtpEntry>();

  constructor(private readonly jwtService: JwtService) {}

  requestOtp(phone: string) {
    const ttlSeconds = Number(process.env.OTP_TTL_SECONDS || 300);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + ttlSeconds * 1000;

    this.otpStore.set(phone, { otp, expiresAt });

    return {
      message: 'OTP generated successfully',
      otp,
      expiresAt,
    };
  }

  verifyOtp(phone: string, otp: string) {
    const entry = this.otpStore.get(phone);

    if (!entry) {
      throw new UnauthorizedException('OTP not requested for this phone');
    }

    if (Date.now() > entry.expiresAt) {
      this.otpStore.delete(phone);
      throw new UnauthorizedException('OTP has expired');
    }

    if (entry.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    this.otpStore.delete(phone);

    const accessToken = this.jwtService.sign(
      { sub: phone, phone },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_TTL || '15m',
      },
    );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_ACCESS_TTL || '15m',
    };
  }
}
