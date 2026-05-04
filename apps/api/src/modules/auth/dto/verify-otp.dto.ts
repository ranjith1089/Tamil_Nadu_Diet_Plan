import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: 'phone must be a valid international format number',
  })
  phone!: string;

  @IsString()
  @Length(6, 6)
  otp!: string;
}
