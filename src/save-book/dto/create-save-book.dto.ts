import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSaveBookDto {
  @IsInt()
  @IsNotEmpty()
  bookId!: number;
}
