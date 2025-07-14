import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { Express } from 'express';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { urlToHttpOptions } from 'url';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { uploadImageMemory } from 'src/utils/multer.options';
import { UserRole } from 'src/utils/types';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @UseInterceptors(FileInterceptor('image', uploadImageMemory()))
  async create(
    @Body() createAuthorDto: CreateAuthorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.authorService.create(createAuthorDto, file);
    return {
      message: 'author created successfully',
      success: true,
      data: data,
    };
  }

  @Get()
  async findAll(
    @Query()
    paginationQueryDto: PaginationQueryDto,
    @Query() queryParams: any,
  ) {
    const { order, sortBy, page, limit, ...filters } = queryParams;
    const { data, pagination } = await this.authorService.findAll(
      paginationQueryDto,
      filters,
    );
    return {
      success: true,
      message: 'Authors fetched successfully',
      data,

      pagination,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Query('sortBy') sortBy: 'rating' | 'latest',
  ) {
    const result = await this.authorService.findOne(id, sortBy);
    return {
      success: true,
      message: 'Authors fetched successfully',
      data: result,
    };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FileInterceptor('image', uploadImageMemory()))
  async update(
    @Param('id') id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.authorService.update(id, updateAuthorDto, file);
    return {
      success: true,
      message: 'Authors update successfully',
      data: result,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async remove(@Param('id') id: number) {
    await this.authorService.remove(id);
    return {
      success: true,
      message: 'Authors deleted successfully',
    };
  }
}
