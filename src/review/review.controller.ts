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
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/utils/types';
import { PaginationQueryDto } from 'src/utils/paginateDto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    const userId = req.user.userId;
    const data = await this.reviewService.create(createReviewDto, userId);
    return {
      message: 'Review Created Successfully',
      success: true,
      data: data,
    };
  }

  @Get()
  async findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Query() queryParam: any,
  ) {
    const { order, sortBy, page, limit, ...filters } = queryParam;
    const { data, pagination } = await this.reviewService.findAll(
      paginationQueryDto,
      filters,
    );
    return {
      message: 'reviews fetched successfully',
      success: true,
      data: data,
      pagination: pagination,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.reviewService.findOne(id);
    return {
      message: 'review fetched successfully',
      success: true,
      data: data,
    };
  }

  @Put(':id')
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
  async remove(@Param('id') id: number) {
    await this.reviewService.remove(id);
    return {
      message: 'review deleted successfully',
      success: true,
    };
  }
}
