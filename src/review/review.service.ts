import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { MyLibraryService } from 'src/my-library/my-library.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookService } from 'src/book/book.service';
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

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
