import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { AuthorService } from 'src/author/author.service';
import { Category } from 'src/category/entities/category.entity';
import { Author } from 'src/author/entities/author.entity';
@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private readonly categoryService: CategoryService,
    private readonly authorService: AuthorService,
  ) {}
  async create(createBookDto: CreateBookDto): Promise<Book | null> {
    const category = await this.categoryService.findOne(
      createBookDto.categoryId,
    );

    const author = await this.authorService.findOne(createBookDto.authorId);

    const newBook = await this.bookRepository.create({
      Number_pages: createBookDto.Number_pages,
      size: createBookDto.size,
      bio: createBookDto.bio,
      language: createBookDto.language,
      title: createBookDto.title,
      author: author,
      category: category,
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
    const { data, pagination } = await paginate<Book>(
      this.bookRepository,
      ['category', 'author'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    return { data, pagination };
  }

  async findOne(id: number): Promise<Book> {
    const getOne = await this.bookRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!getOne) {
      throw new NotFoundException('the book not found');
    }
    return getOne;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const getOne = await this.findOne(id);
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
    const { categoryId, authorId, ...newUpdate } = updateBookDto;
    const newSave = Object.assign(getOne, newUpdate);
    return await this.bookRepository.save(newSave);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.bookRepository.delete(id);
  }
}
