import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateReviewDto {
  @IsInt()
  @IsOptional()
  myLibraryId: number;

  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  @Max(5)
  star: number;
}
