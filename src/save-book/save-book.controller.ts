import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Put,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { SaveBookService } from './save-book.service';
import { CreateSaveBookDto } from './dto/create-save-book.dto';
import { UpdateSaveBookDto } from './dto/update-save-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/utils/types';

@Controller('save-books')
export class SaveBookController {
  constructor(private readonly saveBookService: SaveBookService) {}

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
  async create(
    @Body() createSaveBookDto: CreateSaveBookDto,
    @Request() req: any,
  ) {
    const data = await this.saveBookService.create(createSaveBookDto, req);
    return {
      message: 'save book successfully',
      success: true,
      data: data,
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Param() queryParam: any,
    @Request() req: any,
  ) {
    const { limit, page, sortBy, order, ...filters } = queryParam;
    const { data, pagination } = await this.saveBookService.findAll(
      paginationQueryDto,
      filters,
      req,
    );
    return {
      message: 'fetched  all your book successfully',
      success: true,
      data: data,
      paginate: pagination,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findOne(@Param('id') id: number) {
    const data = await this.saveBookService.findOne(id);
    return {
      message: 'fetched  all your book successfully',
      success: true,
      data: data,
    };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async update(
    @Param('id') id: number,
    @Body() updateSaveBookDto: UpdateSaveBookDto,
  ) {
    const data = await this.saveBookService.update(id, updateSaveBookDto);
    return {
      message: 'update   your bookSave successfully',
      success: true,
      data: data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async remove(@Param('id') id: number, @Request() req: any) {
    await this.saveBookService.remove(id, req);
    return {
      message: 'deleted book successfully',
      success: true,
    };
  }
}
