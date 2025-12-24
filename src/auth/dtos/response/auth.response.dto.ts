import { UserResponseDto } from './user.response.dto';

export class RegisterResponseDto {
  user: UserResponseDto;

  static create(user: any): RegisterResponseDto {
    return {
      user: UserResponseDto.fromEntity(user),
    };
  }
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;

  static create(
    accessToken: string,
    refreshToken: string,
    user: any,
  ): LoginResponseDto {
    return {
      accessToken,
      refreshToken,
      user: UserResponseDto.fromEntity(user),
    };
  }
}

export class RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;

  static create(
    accessToken: string,
    refreshToken: string,
  ): RefreshTokenResponseDto {
    return {
      accessToken,
      refreshToken,
    };
  }
}

export class GoogleLoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
  provider: string;

  static create(
    accessToken: string,
    refreshToken: string,
    user: any,
  ): GoogleLoginResponseDto {
    return {
      accessToken,
      refreshToken,
      user: UserResponseDto.fromEntity(user, true),
      provider: 'google',
    };
  }
}
