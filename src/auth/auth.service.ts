import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) { }

  issueAccessToken(payload: Record<string, any>) {
    const accessTtl = this.config.get<string>('JWT_ACCESS_EXPIRES') ?? '15m';
    const accessSecret = this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
    return this.jwt.sign(payload, {
      expiresIn: accessTtl as `${number}${'m' | 'h' | 'd'}` | number,
      secret: accessSecret,
    });
  }

  issueRefreshToken(payload: Record<string, any>) {
    const refreshTtl = this.config.get<string>('JWT_REFRESH_EXPIRES') ?? '7d';
    const refreshSecret =
      this.config.get<string>('JWT_REFRESH_SECRET') ||
      this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
    return this.jwt.sign(payload, {
      expiresIn: refreshTtl as `${number}${'m' | 'h' | 'd'}` | number,
      secret: refreshSecret,
    });
  }

  issueTokens(payload: Record<string, any>) {
    const accessToken = this.issueAccessToken(payload);
    const refreshToken = this.issueRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  verifyRefreshToken<T extends Record<string, any>>(token: string): Promise<T> {
    const secret =
      this.config.get<string>('JWT_REFRESH_SECRET') ||
      this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
    return this.jwt.verifyAsync<T>(token, { secret });
  }
}
