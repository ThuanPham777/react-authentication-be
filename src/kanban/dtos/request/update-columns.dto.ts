import {
  IsArray,
  ValidateNested,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class KanbanColumnDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  order: number;

  @IsOptional()
  @IsString()
  gmailLabel?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateColumnsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KanbanColumnDto)
  columns: KanbanColumnDto[];
}
