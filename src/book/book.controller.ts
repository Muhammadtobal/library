import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { read } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadImage } from 'src/utils/multer.options';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', uploadImage('books', 'book')))
  async create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.bookService.create(createBookDto, file?.filename);

    return {
      message: 'book created successfully',
      success: true,
      data: result,
    };
  }

  @Get()
  async findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Query() queryParam: any,
  ) {
    const { order, sortBy, limit, page, ...filters } = queryParam;
    const { data, pagination } = await this.bookService.findAll(
      paginationQueryDto,
      filters,
    );
    return {
      message: 'book fetched successfully',
      success: true,
      data: data,
      pagination: pagination,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.bookService.findOne(id);
    return {
      message: 'book fetched successfully',
      success: true,
      data: result,
    };
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', uploadImage('books', 'book')))
  async update(
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.bookService.update(
      id,
      updateBookDto,
      file?.filename,
    );
    return {
      message: 'book updated successfully',
      success: true,
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.bookService.remove(id);
    return {
      message: 'book deleted successfully',
      success: true,
    };
  }
  // @Get('countBook/:id')
  // async allBookByAuthor(
  //   @Param('id') id: number,
  //   @Query('sortBy') sortBy: 'rating' | 'latest',
  // ) {
  //   const result = await this.bookService.countBook(id);
  //   return {
  //     message: 'book fetched successfully',
  //     success: true,
  //     data: result.AllBooks,
  //   };
  // }
}
