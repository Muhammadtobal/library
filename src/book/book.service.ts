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
import { saveFileManually, saveImageManually } from 'src/utils/multer.options';
import { unlinkSync } from 'fs';

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
    files: {
      image?: Express.Multer.File[];
      file?: Express.Multer.File[];
    },
  ): Promise<Book> {
    const category = await this.categoryService.findOne(
      createBookDto.categoryId,
    );
    const author = await this.authorService.findOne(createBookDto.authorId);

    if (!files?.image?.[0]) {
      throw new BadRequestException('Image is required');
    }

    if (!files?.file?.[0]) {
      throw new BadRequestException('File (PDF) is required');
    }

    const imageFile = files.image[0];
    const pdfFile = files.file[0];

    const savedImage = saveImageManually('books/images', 'book', imageFile);
    const savedPdf = saveFileManually('books/files', 'book', pdfFile);

    const { books, ...authorWithoutBooks } = author;

    const newBook = this.bookRepository.create({
      title: createBookDto.title,
      subTitle: createBookDto.subTitle,
      translator: createBookDto.translator,
      publicationDate: createBookDto.publicationDate,
      publishingHouse: createBookDto.publishingHouse,
      Number_pages: createBookDto.Number_pages,
      language: createBookDto.language,
      bio: createBookDto.bio,
      displayType: createBookDto.displayType,
      author: authorWithoutBooks,
      category,
      image: savedImage,
      file: savedPdf,
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
    const isSortByRating = sortBy === 'averageRating';
    const sortField = !isSortByRating ? sortBy || 'id' : 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };

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
    const booksWithRating = await this.countBook(data);
    let sortedBooks = booksWithRating.AllBooks;

    if (isSortByRating) {
      sortedBooks = sortedBooks.sort((a, b) =>
        order === 'asc'
          ? a.averageRating - b.averageRating
          : b.averageRating - a.averageRating,
      );
    }
    const updateData = sortedBooks.map((i) => ({
      ...i.book,
      image: i.book.image
        ? `${host}:${port}/uploads/books/images/${i.book.image}`
        : undefined,

      file: i.book.file
        ? `${host}:${port}/uploads/books/files/${i.book.file}`
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
      image: getOne.image
        ? `${host}:${port}/uploads/books/images/${getOne.image}`
        : undefined,
      file: getOne.file
        ? `${host}:${port}/uploads/books/files/${getOne.file}`
        : undefined,
    };

    return object;
  }

  async update(
    id: number,
    updateBookDto: UpdateBookDto,
    files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
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

    // تفكيك الملفات داخل الخدمة
    const imageFile = files.image ? files.image[0] : null;
    const pdfFile = files.file ? files.file[0] : null;

    if (imageFile) {
      if (getOne.image) {
        const oldImageFilename = basename(getOne.image);
        const oldImagePath = join(
          __dirname,
          '..',
          '..',
          'uploads',
          'books/images',

          oldImageFilename,
        );
        try {
          unlinkSync(oldImagePath);
        } catch (err) {
          console.warn(`Failed to delete old image: ${oldImagePath}`, err);
        }
      }
      const newImageName = saveImageManually('books/images', 'book', imageFile);
      updateBookDto.image = newImageName;
    } else {
      updateBookDto.image = basename(getOne.image as string);
    }

    if (pdfFile) {
      if (getOne.file) {
        const oldPdfFilename = basename(getOne.file);
        const oldPdfPath = join(
          __dirname,
          '..',
          '..',
          'uploads',
          'books/files',
          oldPdfFilename,
        );
        try {
          unlinkSync(oldPdfPath);
        } catch (err) {
          console.warn(`Failed to delete old pdf file: ${oldPdfPath}`, err);
        }
      }
      const newPdfName = saveFileManually('books/files', 'book', pdfFile);
      updateBookDto.file = newPdfName;
    } else {
      updateBookDto.file = getOne.file;
    }

    const { categoryId, authorId, ...newUpdate } = updateBookDto;
    const newSave = Object.assign(getOne, newUpdate);
    return await this.bookRepository.save(newSave);
  }

  async remove(id: number): Promise<void> {
    const getOne = await this.findOne(id);
    if (getOne.image) {
      const oldImageFilename = basename(getOne.image);

      const oldImagePath = join(
        __dirname,
        '..',
        '..',
        'uploads',
        'books/images',
        oldImageFilename,
      );

      try {
        unlinkSync(oldImagePath);
      } catch (err) {
        console.warn(`Failed to delete old image: ${oldImagePath}`, err);
      }
    }
    if (getOne.file) {
      const oldPdfFilename = basename(getOne.file);
      const oldPdfPath = join(
        __dirname,
        '..',
        '..',
        'uploads',
        'books/files',
        oldPdfFilename,
      );
      try {
        unlinkSync(oldPdfPath);
      } catch (err) {
        console.warn(`Failed to delete old pdf file: ${oldPdfPath}`, err);
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
