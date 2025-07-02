import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { MyLibraryService } from 'src/my-library/my-library.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookService } from 'src/book/book.service';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly myLibraryService: MyLibraryService,
    private readonly bookService: BookService,
  ) {}
  async create(
    createReviewDto: CreateReviewDto,
    userId: number,
  ): Promise<Review> {
    const getMyLibrary = await this.myLibraryService.findOne(userId);
    const getBook = await this.bookService.findOne(createReviewDto.bookId);

    const result = this.reviewRepository.create({
      myLibrary: getMyLibrary,
      book: getBook,
      description: createReviewDto.description,
      star: createReviewDto.star,
    });
    return await this.reviewRepository.save(result);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
  ): Promise<{ data: Review[]; pagination: any }> {
    let { page, order, limit, sortBy, allData } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };

    const { data, pagination } = await paginate<Review>(
      this.reviewRepository,
      ['myLibrary', 'book'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    return { data, pagination };
  }

  async findOne(id: number): Promise<Review> {
    const getOne = await this.reviewRepository.findOne({ where: { id } });
    if (!getOne) {
      throw new NotFoundException('the Review Not Found ');
    }
    return getOne;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const getOne = await this.findOne(id);
    const updateData = Object.assign(getOne, updateReviewDto);
    return await this.reviewRepository.save(updateData);
  }

  async remove(id: number): Promise<void> {
    const getOne = await this.findOne(id);
    await this.reviewRepository.remove(getOne);
  }
}
