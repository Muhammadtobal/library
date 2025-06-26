import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @IsNotEmpty()
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
