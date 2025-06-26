import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MyLibraryService } from './my-library.service';
import { CreateMyLibraryDto } from './dto/create-my-library.dto';
import { UpdateMyLibraryDto } from './dto/update-my-library.dto';

@Controller('my-library')
export class MyLibraryController {
  constructor(private readonly myLibraryService: MyLibraryService) {}

  @Post()
  // async create(@Body() createMyLibraryDto: CreateMyLibraryDto) {
  //   return await this.myLibraryService.create(createMyLibraryDto);
  // }
  @Get()
  findAll() {
    return this.myLibraryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.myLibraryService.findOne(id);
    return {
      message: 'MyLibrary fetched successfully',
      success: true,
      data: data,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMyLibraryDto: UpdateMyLibraryDto,
  ) {
    return this.myLibraryService.update(+id, updateMyLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.myLibraryService.remove(+id);
  }
}
