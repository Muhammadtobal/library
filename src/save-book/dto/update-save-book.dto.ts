import { PartialType } from '@nestjs/swagger';
import { CreateSaveBookDto } from './create-save-book.dto';

export class UpdateSaveBookDto extends PartialType(CreateSaveBookDto) {}
