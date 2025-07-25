import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/utils/types';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.User)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    const data = await this.reviewService.create(createReviewDto, req);
    return {
      message: 'Review Created Successfully',
      success: true,
      data: data,
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Query() queryParam: any,
    @Request() req,
  ) {
    const { order, sortBy, page, limit, ...filters } = queryParam;
    const { data, pagination } = await this.reviewService.findAll(
      paginationQueryDto,
      filters,
      req,
    );
    return {
      message: 'reviews fetched successfully',
      success: true,
      data: data,
      pagination: pagination,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findOne(@Param('id') id: number) {
    const data = await this.reviewService.findOne(id);
    return {
      message: 'review fetched successfully',
      success: true,
      data: data,
    };
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async update(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const data = await this.reviewService.update(id, updateReviewDto);
    return {
      message: 'review updated successfully',
      success: true,
      data: data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async remove(@Param('id') id: number) {
    await this.reviewService.remove(id);
    return {
      message: 'review deleted successfully',
      success: true,
    };
  }
}
