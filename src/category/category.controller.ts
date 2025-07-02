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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { filter } from 'rxjs/operators';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const result = await this.categoryService.create(createCategoryDto);
    return {
      message: 'category created successfully',
      success: true,
      data: result,
    };
  }

  @Get()
  async findAll(
    @Query() queryParams: any,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<any> {
    const { allData, sortBy, page, limit, order, ...filters } = queryParams;
    const { data, pagination } = await this.categoryService.findAll(
      paginationQueryDto,
      filters,
    );
    return {
      message: 'All Category fetched successfully',
      success: true,
      data: data,
      pagination: pagination,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Query('sortBy') sortBy: 'rating' | 'latest',
  ) {
    const result = await this.categoryService.findOne(id, sortBy);

    return {
      message: 'category fetched successfully',
      success: true,
      data: result,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const result = await this.categoryService.update(id, updateCategoryDto);
    return {
      message: 'category update successfully',
      success: true,
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.categoryService.remove(id);
    return {
      message: 'category delete successfully',
      success: true,
    };
  }
}
