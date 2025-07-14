import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DisplayType } from 'src/utils/types';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Type(() => Number)
  @IsNumber()
  categoryId!: number;

  @IsString()
  @IsOptional()
  image?: string;

  @Type(() => Number)
  @IsNumber()
  authorId!: number;

  @IsString()
  bio?: string;

  @IsString()
  language?: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  Number_pages!: number;

  @IsOptional()
  @IsString()
  subTitle?: string;

  @IsOptional()
  @IsString()
  translator?: string;

  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @IsOptional()
  @IsString()
  publishingHouse?: string;

  @IsString()
  @IsOptional()
  file?: string;
  @IsEnum(DisplayType)
  displayType?: DisplayType;
}
