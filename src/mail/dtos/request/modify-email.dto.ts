import { IsOptional, IsBoolean } from 'class-validator';

export class ModifyEmailDto {
  @IsOptional()
  @IsBoolean()
  markRead?: boolean;

  @IsOptional()
  @IsBoolean()
  markUnread?: boolean;

  @IsOptional()
  @IsBoolean()
  star?: boolean;

  @IsOptional()
  @IsBoolean()
  unstar?: boolean;

  @IsOptional()
  @IsBoolean()
  delete?: boolean;
}
