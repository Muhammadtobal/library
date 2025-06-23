import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
