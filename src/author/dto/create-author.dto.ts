import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  name!: string;

  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
