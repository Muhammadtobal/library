import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { AuthorService } from 'src/author/author.service';
import { Review } from 'src/review/entities/review.entity';
import { basename, join } from 'path';
import { unlink } from 'fs/promises';
import * as path from 'path';
import { promises } from 'dns';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    private readonly authorService: AuthorService,
  ) {}
  async create(
    createBookDto: CreateBookDto,
    imageFile: string,
  ): Promise<Book | null> {
    const category = await this.categoryService.findOne(
      createBookDto.categoryId,
    );

    const author = await this.authorService.findOne(createBookDto.authorId);
    const { books, ...authorWithOutBook } = author;
    const newBook = this.bookRepository.create({
      Number_pages: createBookDto.Number_pages,
      size: createBookDto.size,
      bio: createBookDto.bio,
      language: createBookDto.language,
      title: createBookDto.title,
      author: authorWithOutBook,
      category: category,
      image: imageFile,
    });
    return await this.bookRepository.save(newBook);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
  ): Promise<{ data: Book[]; pagination: any }> {
    let { order, sortBy, page, limit, allData } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };
    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.author', 'author');
    if (filters?.search) {
      const search = `%${filters.search.toLowerCase()}%`;
      queryBuilder.andWhere(
        `(LOWER(book.title) LIKE :search OR LOWER(author.name) LIKE :search OR LOWER(category.name) LIKE :search)`,
        { search },
      );
    }

    // 🔍 تطبيق الفلاتر
    // if (filters?.title) {
    //   queryBuilder.andWhere('LOWER(book.title) LIKE :title', {
    //     title: `%${filters.title.toLowerCase()}%`,
    //   });
    // }

    // if (filters?.category) {
    //   queryBuilder.andWhere('LOWER(category.name) LIKE :category', {
    //     category: `%${filters.category.toLowerCase()}%`,
    //   });
    // }

    // if (filters?.author) {
    //   queryBuilder.andWhere('LOWER(author.name) LIKE :author', {
    //     author: `%${filters.author.toLowerCase()}%`,
    //   });
    // }
    const { data, pagination } = await paginate<Book>(
      this.bookRepository,
      ['category', 'author'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    const host = process.env.APP_URL || 'http://localhost';
    const port = process.env.PORT || 3000;
    const books = await this.countBook(data);
    const updateData = books.AllBooks.map((i) => ({
      ...i.book,
      image: i.book.image
        ? `${host}:${port}/uploads/books/${i.book.image}`
        : undefined,
      averageRating: i.averageRating,
    }));

    return { data: updateData, pagination };
  }

  async findOne(id: number): Promise<Book> {
    const getOne = await this.bookRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!getOne) {
      throw new NotFoundException('the book not found');
    }
    const host = process.env.APP_URL || 'http://localhost';
    const port = process.env.PORT || 3000;
    const object = {
      ...getOne,
      image: getOne
        ? `${host}:${port}/uploads/books/${getOne.image}`
        : undefined,
    };
    return object;
  }

  async update(
    id: number,
    updateBookDto: UpdateBookDto,
    imagFile: string,
  ): Promise<Book> {
    const getOne = await this.findOne(id);
    if (!updateBookDto) {
      return getOne;
    }

    if (updateBookDto.categoryId) {
      const category = await this.categoryService.findOne(
        updateBookDto.categoryId,
      );
      getOne.category = category;
    }
    if (updateBookDto.authorId) {
      const author = await this.authorService.findOne(updateBookDto.authorId);
      getOne.author = author;
    }
    if (imagFile && imagFile !== undefined) {
      const oldImage = getOne.image;
      if (oldImage) {
        const fileName = path.basename(oldImage);
        const imagePath = join(
          __dirname,
          '..',
          '..',
          'uploads',
          'books',
          fileName,
        );

        try {
          await unlink(imagePath);
        } catch (err) {
          throw new BadRequestException(
            `Failed to delete old image: ${imagePath}`,
            err,
          );
        }
      }
      updateBookDto.image = imagFile;
    } else {
      updateBookDto.image = getOne.image;
    }
    const { categoryId, authorId, ...newUpdate } = updateBookDto;
    const newSave = Object.assign(getOne, newUpdate);
    return await this.bookRepository.save(newSave);
  }

  async remove(id: number): Promise<void> {
    const getOne = await this.findOne(id);
    const oldImage = getOne.image;
    if (oldImage) {
      const imageFile = basename(oldImage);
      const imagePath = join(
        __dirname,
        '..',
        '..',
        'uploads',
        'books',
        imageFile,
      );

      try {
        await unlink(imagePath);
      } catch (err) {
        console.warn(`Failed to delete old image: ${imagePath}`, err);
      }
    }
    await this.bookRepository.delete(id);
  }
  async countBook(getBooks: any) {
    // const getBooks = await this.bookRepository.find({
    //   where: { author: { id: id } },
    //   order: sortBy === 'latest' ? { created_at: 'DESC' } : undefined,
    // });

    const Books = await Promise.all(
      getBooks.map(async (i) => {
        const reviews = await this.reviewRepo.find({
          where: { book: { id: i.id } },
        });
        if (reviews.length === 0) {
          return { book: i, averageRating: 0 };
        }
        const average = reviews.reduce((acc, i) => {
          return acc + i.star;
        }, 0);
        const averageRating = average / reviews.length;
        return { book: i, averageRating };
      }),
    );
    // const sortedBooks =
    //   sortBy === 'rating'
    //     ? allReview.sort((a, b) => b.averageRating - a.averageRating)
    //     : allReview;
    const object = { AllBooks: Books };
    return object;
  }
}
