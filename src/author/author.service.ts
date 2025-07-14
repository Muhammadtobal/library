import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { basename, join } from 'path';
import { unlink } from 'fs/promises';
import { BookService } from 'src/book/book.service';
import { saveImageManually } from 'src/utils/multer.options';
import { unlinkSync } from 'fs';
type AuthorWithImage = Author & { image: string | null | undefined } & {
  total: any;
};
@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @Inject(forwardRef(() => BookService))
    private readonly bookService: BookService,
  ) {}
  async create(
    createAuthorDto: CreateAuthorDto,
    imageFile: Express.Multer.File,
  ): Promise<Author> {
    if (imageFile === null || imageFile === undefined) {
      throw new BadRequestException('the image null');
    }
    const fileName = saveImageManually('authors', 'author', imageFile);
    const result = await this.authorRepository.create({
      ...createAuthorDto,
      image: fileName,
    });
    return await this.authorRepository.save(result);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
  ): Promise<{ data: Author[]; pagination: any }> {
    let { page, order, limit, sortBy, allData } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };

    const { data, pagination } = await paginate<Author>(
      this.authorRepository,
      ['books'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    const host = process.env.APP_URL || 'http://localhost';
    const port = process.env.PORT || 3000;

    const updateData = await Promise.all(
      data.map(async (i) => {
        return {
          ...i,
          image: i.image
            ? `${host}:${port}/uploads/authors/${i.image}`
            : undefined,
          total: i.books.length,
        };
      }),
    );

    return { data: updateData, pagination };
  }

  async findOne(
    id: number,
    sortBy: 'rating' | 'latest' = 'rating',
  ): Promise<Author> {
    const getOne = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
      order: sortBy === 'latest' ? { created_at: 'DESC' } : undefined,
    });
    if (!getOne) {
      throw new NotFoundException('the Author Not Found');
    }
    const host = process.env.APP_URL || 'http://localhost';
    const port = process.env.PORT || 3000;
    const updateData = {
      ...getOne,
      image: getOne.image
        ? `${host}:${port}/uploads/authors/${getOne.image}`
        : undefined,
    };
    const ratedBooks = await this.bookService.countBook(getOne.books);

    let booksWithRating = ratedBooks.AllBooks.map((item) => ({
      ...item.book,
      averageRating: item.averageRating,
    }));

    if (sortBy === 'latest') {
      booksWithRating = booksWithRating.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else if (sortBy === 'rating') {
      booksWithRating = booksWithRating.sort(
        (a, b) => b.averageRating - a.averageRating,
      );
    } else {
      booksWithRating = booksWithRating;
    }
    const object = {
      id: getOne.id,
      name: getOne.name,
      bio: getOne.bio,
      image: updateData.image,
      books: booksWithRating,
      created_at: getOne.created_at,
      updated_at: getOne.updated_at,
      totalBook: booksWithRating.length,
    };
    return object;
  }

  async update(
    id: number,
    updateAuthorDto: UpdateAuthorDto,
    imagFile: Express.Multer.File,
  ): Promise<Author> {
    console.log(updateAuthorDto);
    const getOne = await this.findOne(id);
    if (!updateAuthorDto) {
      return getOne;
    }
    if (!getOne) {
      throw new NotFoundException('the Author Not Found');
    }
    if (imagFile) {
      if (getOne.image) {
        // استخراج اسم الملف من الرابط باستخدام basename
        const oldImageFilename = basename(getOne.image);

        const oldImagePath = join(
          __dirname,
          '..',
          '..',
          'uploads',
          'authors',
          oldImageFilename,
        );

        try {
          unlinkSync(oldImagePath);
        } catch (err) {
          console.warn(`Failed to delete old image: ${oldImagePath}`, err);
        }
      }

      const newFilename = saveImageManually('authors', 'author', imagFile);
      const newName = basename(newFilename);
      updateAuthorDto.image = newName;
    } else {
      updateAuthorDto.image = basename(getOne.image as string);
    }
    const newUpdate = Object.assign(getOne, updateAuthorDto);
    return await this.authorRepository.save(newUpdate);
  }
  async remove(id: number): Promise<void> {
    const getOne = await this.authorRepository.findOne({ where: { id } });
    if (!getOne) {
      throw new NotFoundException('the Author Not Found');
    }
    if (getOne.image) {
      const oldImageFilename = basename(getOne.image);

      const oldImagePath = join(
        __dirname,
        '..',
        '..',
        'uploads',
        'authors',
        oldImageFilename,
      );

      try {
        unlinkSync(oldImagePath);
      } catch (err) {
        console.warn(`Failed to delete old image: ${oldImagePath}`, err);
      }
    }

    await this.authorRepository.remove(getOne);
  }
}
