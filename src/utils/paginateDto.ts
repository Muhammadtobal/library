import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number (default: 1)', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Get all data without pagination',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  allData?: boolean = false;

  @ApiPropertyOptional({ description: 'Sort by field', example: 'name' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sorting order (asc or desc)',
    example: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
