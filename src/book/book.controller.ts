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
  UseGuards,
  UsePipes,
  ValidationPipe,
  UploadedFiles,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { read } from 'fs';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { uploadImageMemory } from 'src/utils/multer.options';
import { UserRole } from 'src/utils/types';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      uploadImageMemory(),
    ),
  )
  async create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      file?: Express.Multer.File[];
    },
  ) {
    const result = await this.bookService.create(createBookDto, files);

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
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      uploadImageMemory(),
    ),
  )
  async update(
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      file?: Express.Multer.File[];
    },
  ) {
    const result = await this.bookService.update(id, updateBookDto, files);
    return {
      message: 'book updated successfully',
      success: true,
      data: result,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
