import { AuthService } from './auth.service';

describe('AuthService', () => {
  const phone = '+919876543210';

  function createService(options?: { debugOtp?: boolean; storedOtp?: string }) {
    const config = {
      get: jest.fn((key: string, defaultValue?: unknown) => {
        const values: Record<string, unknown> = {
          JWT_ACCESS_TTL: '15m',
          OTP_DEBUG_RESPONSE: options?.debugOtp ?? false,
          OTP_TTL_SECONDS: 300,
        };

        return values[key] ?? defaultValue;
      }),
      getOrThrow: jest.fn((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') {
          return 'test-secret';
        }

        throw new Error(`Missing config: ${key}`);
      }),
    };

    const jwt = {
      sign: jest.fn(() => 'signed-token'),
    };

    const otpStore = {
      setOtp: jest.fn(),
      getOtp: jest.fn(() => Promise.resolve(options?.storedOtp ?? '123456')),
      deleteOtp: jest.fn(),
    };

    const prisma = {
      user: {
        upsert: jest.fn(() =>
          Promise.resolve({
            id: 'user_1',
            phone,
          }),
        ),
      },
    };

    const service = new AuthService(
      config as never,
      jwt as never,
      otpStore as never,
      prisma as never,
    );

    return { config, jwt, otpStore, prisma, service };
  }

  it('does not expose the OTP by default', async () => {
    const { otpStore, service } = createService();

    const result = await service.requestOtp(phone);

    expect(result).toEqual({
      message: 'OTP generated successfully',
      expiresIn: 300,
    });
    expect(otpStore.setOtp).toHaveBeenCalledWith(
      phone,
      expect.stringMatching(/^\d{6}$/),
      300,
    );
  });

  it('exposes the OTP only when debug responses are enabled', async () => {
    const { service } = createService({ debugOtp: true });

    const result = await service.requestOtp(phone);

    expect(result.devOtp).toEqual(expect.stringMatching(/^\d{6}$/));
  });

  it('persists the user and signs the JWT with the user id', async () => {
    const { jwt, otpStore, prisma, service } = createService({
      storedOtp: '123456',
    });

    const result = await service.verifyOtp(phone, '123456');

    expect(otpStore.deleteOtp).toHaveBeenCalledWith(phone);
    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { phone },
      update: {},
      create: { phone },
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: 'user_1', phone },
      {
        secret: 'test-secret',
        expiresIn: '15m',
      },
    );
    expect(result).toMatchObject({
      accessToken: 'signed-token',
      tokenType: 'Bearer',
      user: {
        id: 'user_1',
        phone,
      },
    });
  });
});
