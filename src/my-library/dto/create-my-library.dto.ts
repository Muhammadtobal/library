import { IsNumber } from 'class-validator';

export class CreateMyLibraryDto {
  @IsNumber()
  userId!: number;
}
