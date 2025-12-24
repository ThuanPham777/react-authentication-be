import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateLabelDto {
  @IsString()
  @IsNotEmpty()
  labelName: string;
}
