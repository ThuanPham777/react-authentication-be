import { IsString, IsNotEmpty } from 'class-validator';

export class SnoozeDto {
  @IsString()
  @IsNotEmpty()
  until: string;
}
