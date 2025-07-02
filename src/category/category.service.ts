import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { promises } from 'dns';
import { BookService } from 'src/book/book.service';
interface CategoryWithCount extends Category {
  getBooks: number;
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly bookService: BookService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category | null> {
    const result = await this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(result);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
  ): Promise<{ data: CategoryWithCount[]; pagination: any }> {
    let { page, limit, allData, sortBy, order } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };
    const { data, pagination } = await paginate<Category>(
      this.categoryRepository,
      ['books'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    const updateData = await Promise.all(
      data.map(async (i) => {
        return {
          ...i,
          getBooks: i.books.length,
        };
      }),
    );

    return { data: updateData, pagination };
  }

  async findOne(
    id: any,
    sortBy: 'rating' | 'latest' = 'rating',
  ): Promise<Category> {
    const getOne = await this.categoryRepository.findOne({
      where: { id },
      relations: ['books'],
      order: sortBy === 'latest' ? { created_at: 'DESC' } : undefined,
    });
    if (!getOne) {
      throw new NotFoundException(`the category not found`);
    }
    const ratedBooks = await this.bookService.countBook(getOne.books);

    // دمج التقييمات مع الكتب
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

      books: booksWithRating,
      created_at: getOne.created_at,
      updated_at: getOne.updated_at,
      totalBook: booksWithRating.length,
    };
    return object;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const getOne = await this.categoryRepository.findOne({ where: { id } });
    if (!getOne) {
      throw new NotFoundException(`the category not found`);
    }
    const newInfo = Object.assign(getOne, updateCategoryDto);
    return await this.categoryRepository.save(newInfo);
  }

  async remove(id: number): Promise<void> {
    const getOne = await this.categoryRepository.findOne({ where: { id } });
    if (!getOne) {
      throw new NotFoundException(`the category not found`);
    }
    await this.categoryRepository.remove(getOne);
  }
  async findCategory(category: any): Promise<Category | null> {
    const getOne = await this.categoryRepository.findOne({
      where: {
        id: category.id,
      },
    });
    if (!getOne) {
      throw new NotFoundException(`the category not found`);
    }
    return getOne;
  }
}
