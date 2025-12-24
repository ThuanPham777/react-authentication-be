import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsString()
  gmailLabel?: string;
}

export class SnoozeDto {
  @IsString()
  @IsNotEmpty()
  until: string;
}

export class ValidateLabelDto {
  @IsString()
  @IsNotEmpty()
  labelName: string;
}

export class SemanticSearchDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsOptional()
  limit?: number;
}
