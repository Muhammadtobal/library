import { PartialType } from '@nestjs/swagger';
import { CreateMyLibraryDto } from './create-my-library.dto';

export class UpdateMyLibraryDto extends PartialType(CreateMyLibraryDto) {}
