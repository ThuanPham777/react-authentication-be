import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../users/dtos/register.dto';
import { LoginDto } from '../users/dtos/login.dto';
import { MongoExceptionFilter } from '../common/filters/mongo-exception.filter';
import { GoogleAuthService } from './google-auth.service';
import { JwtPayload } from './strategies/jwt.strategy';
import { RefreshTokenDto, LogoutDto, GoogleLoginDto } from './dtos/request';
import {
  RegisterResponseDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  GoogleLoginResponseDto,
} from './dtos/response';
import { ApiResponseDto } from '../common/dtos/api-response.dto';

@Controller('api/auth')
@UseFilters(MongoExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
  ): Promise<ApiResponseDto<RegisterResponseDto>> {
    const created = await this.usersService.createLocalUser(
      dto.email,
      dto.password,
    );
    const response = RegisterResponseDto.create(created);
    return ApiResponseDto.success(response, 'User registered successfully');
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
  ): Promise<ApiResponseDto<LoginResponseDto>> {
    const user = await this.usersService.verifyCredentials(
      dto.email,
      dto.password,
    );
    const { accessToken, refreshToken } = this.authService.issueTokens({
      sub: (user as any)._id,
      email: user.email,
    });
    await this.usersService.setRefreshToken(
      (user as any)._id.toString(),
      refreshToken,
    );
    const response = LoginResponseDto.create(accessToken, refreshToken, user);
    return ApiResponseDto.success(response, 'Login successful');
  }

  @Post('refresh')
  async refresh(
    @Body() dto: RefreshTokenDto,
  ): Promise<ApiResponseDto<RefreshTokenResponseDto>> {
    if (!dto.refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    let payload: JwtPayload;
    try {
      payload = await this.authService.verifyRefreshToken<JwtPayload>(
        dto.refreshToken,
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.validateRefreshToken(
      payload.sub,
      dto.refreshToken,
    );

    const { accessToken, refreshToken: newRefreshToken } =
      this.authService.issueTokens({
        sub: (user as any)._id,
        email: user.email,
      });

    await this.usersService.setRefreshToken(
      (user as any)._id.toString(),
      newRefreshToken,
    );

    const response = RefreshTokenResponseDto.create(
      accessToken,
      newRefreshToken,
    );
    return ApiResponseDto.success(response, 'Token refreshed');
  }

  @Post('logout')
  async logout(@Body() dto: LogoutDto): Promise<ApiResponseDto<null>> {
    if (!dto.userId) {
      throw new BadRequestException('Missing user id');
    }

    await this.usersService.clearRefreshToken(dto.userId);

    return ApiResponseDto.success(null, 'Logged out');
  }

  @Post('google/full-login')
  async googleFullLogin(
    @Body() dto: GoogleLoginDto,
  ): Promise<ApiResponseDto<GoogleLoginResponseDto>> {
    const { identity, tokens } =
      await this.googleAuthService.exchangeCodeForTokens(dto.code);

    const user = await this.usersService.findOrCreateGoogleUser({
      email: identity.email!,
      googleId: identity.sub,
      name: identity.name,
      avatarUrl: identity.picture,
    });

    if (!tokens.refresh_token) {
      throw new BadRequestException(
        'Missing refresh token. Check access_type=offline & prompt=consent',
      );
    }

    await this.usersService.updateGmailTokens((user as any)._id.toString(), {
      refreshToken: tokens.refresh_token!,
      scope: tokens.scope,
    });

    const { accessToken, refreshToken } = this.authService.issueTokens({
      sub: (user as any)._id,
      email: user.email,
    });
    await this.usersService.setRefreshToken(
      (user as any)._id.toString(),
      refreshToken,
    );

    const response = GoogleLoginResponseDto.create(
      accessToken,
      refreshToken,
      user,
    );
    return ApiResponseDto.success(response, 'Login successful');
  }
}
