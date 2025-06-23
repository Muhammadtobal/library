import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { promises } from 'dns';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category | null> {
    const result = await this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(result);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
  ): Promise<{ data: Category[]; pagination: any }> {
    let { page, limit, allData, sortBy, order } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };
    const { data, pagination } = await paginate<Category>(
      this.categoryRepository,
      [],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    return { data, pagination };
  }

  async findOne(id: number): Promise<Category> {
    const getOne = await this.categoryRepository.findOne({ where: { id } });
    if (!getOne) {
      throw new NotFoundException(`the category not found`);
    }
    return getOne;
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
}
