import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { MongoExceptionFilter } from 'src/common/filters/mongo-exception.filter';
import { AuthService } from 'src/auth/auth.service';
import { GoogleLoginDto } from './dtos/google-login.dto';
import { GoogleAuthService } from 'src/auth/google-auth.service';
import { JwtPayload } from 'src/auth/strategies/jwt.strategy';

@Controller('user')
@UseFilters(MongoExceptionFilter)
export class UsersController {
  constructor(
    private readonly users: UsersService,
    private readonly auth: AuthService,
    private readonly googleAuth: GoogleAuthService,
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const created = await this.users.createLocalUser(dto.email, dto.password);
    return {
      status: 'success',
      message: 'User registered successfully',
      user: created, // password automatically omitted by toJSON()
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.users.verifyCredentials(dto.email, dto.password);
    const { accessToken, refreshToken } = this.auth.issueTokens({
      sub: (user as any)._id,
      email: user.email,
    });
    await this.users.setRefreshToken((user as any)._id.toString(), refreshToken);
    return {
      status: 'success',
      message: 'Login successful',
      accessToken,
      refreshToken,
      user,
    };
  }

  @Post('google')
  async googleLogin(@Body() dto: GoogleLoginDto) {
    const tokenInfo = await this.googleAuth.verifyCredential(dto.credential);
    const user = await this.users.findOrCreateGoogleUser({
      email: tokenInfo.email!,
      googleId: tokenInfo.sub,
      name: tokenInfo.name,
      avatarUrl: tokenInfo.picture,
    });
    const { accessToken, refreshToken } = this.auth.issueTokens({
      sub: (user as any)._id,
      email: user.email,
    });
    await this.users.setRefreshToken((user as any)._id.toString(), refreshToken);

    return {
      status: 'success',
      message: 'Login successful',
      accessToken,
      refreshToken,
      user,
      provider: 'google',
    };
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');
    let payload: JwtPayload;
    try {
      payload = await this.auth.verifyRefreshToken<JwtPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.users.validateRefreshToken(payload.sub, refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = this.auth.issueTokens({
      sub: (user as any)._id,
      email: user.email,
    });
    await this.users.setRefreshToken((user as any)._id.toString(), newRefreshToken);
    return {
      status: 'success',
      message: 'Token refreshed',
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  @Post('logout')
  async logout(@Body('userId') userId: string) {
    if (!userId) throw new UnauthorizedException('Missing user id');
    await this.users.clearRefreshToken(userId);
    return { status: 'success', message: 'Logged out' };
  }
}
