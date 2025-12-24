import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
