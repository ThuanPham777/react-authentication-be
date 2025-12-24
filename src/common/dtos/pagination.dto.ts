import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  pageToken?: string;
}

export class PaginationResponseDto<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
  pageToken?: string;
  nextPageToken?: string;
  hasMore?: boolean;

  constructor(
    data: T[],
    total: number,
    options?: {
      page?: number;
      limit?: number;
      pageToken?: string;
      nextPageToken?: string;
      hasMore?: boolean;
    },
  ) {
    this.data = data;
    this.total = total;
    if (options) {
      this.page = options.page;
      this.limit = options.limit;
      this.pageToken = options.pageToken;
      this.nextPageToken = options.nextPageToken;
      this.hasMore = options.hasMore;
    }
  }
}
