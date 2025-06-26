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
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { read } from 'fs';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    const result = await this.bookService.create(createBookDto);

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
  async update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    const result = await this.bookService.update(id, updateBookDto);
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
}
