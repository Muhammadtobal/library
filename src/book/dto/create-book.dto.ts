import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  categoryId!: number;
  @IsOptional()
  @IsString()
  image?: string;
  @IsNumber()
  authorId!: number;
  @IsOptional()
  @IsString()
  bio?: string;
  @IsOptional()
  @IsString()
  language?: string;
  @IsOptional()
  @IsString()
  size?: string;

  @IsNumber()
  @IsNotEmpty()
  Number_pages!: number;
}
