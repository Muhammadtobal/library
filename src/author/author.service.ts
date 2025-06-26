import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { join } from 'path';
import { unlink } from 'fs/promises';
type AuthorWithImage = Author & { image: string | null | undefined };
@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  async create(
    createAuthorDto: CreateAuthorDto,
    imageFile: string,
  ): Promise<Author> {
    const result = await this.authorRepository.create({
      ...createAuthorDto,
      image: imageFile,
    });
    return await this.authorRepository.save(result);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
  ): Promise<{ data: AuthorWithImage[]; pagination: any }> {
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
    const updateData = data.map((i) => ({
      ...i,
      image: i.image ? `${host}:${port}/uploads/authors/${i.image}` : undefined,
    }));
    return { data: updateData, pagination };
  }

  async findOne(id: number): Promise<Author> {
    const getOne = await this.authorRepository.findOne({ where: { id } });
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
    return updateData;
  }

  async update(
    id: number,
    updateAuthorDto: UpdateAuthorDto,
    imagFile: string,
  ): Promise<Author> {
    const getOne = await this.authorRepository.findOne({ where: { id } });
    if (!getOne) {
      throw new NotFoundException('the Author Not Found');
    }
    if (imagFile && imagFile !== undefined) {
      const oldImage = getOne.image;
      if (oldImage) {
        const imagePath = join(
          __dirname,
          '..',
          '..',
          'uploads',
          'authors',
          oldImage,
        );

        try {
          await unlink(imagePath);
        } catch (err) {
          console.warn(`Failed to delete old image: ${imagePath}`, err);
        }
      }
      updateAuthorDto.image = imagFile;
    } else {
      updateAuthorDto.image = getOne.image;
    }
    const newUpdate = Object.assign(getOne, updateAuthorDto);
    return await this.authorRepository.save(newUpdate);
  }
  async remove(id: number): Promise<void> {
    const getOne = await this.authorRepository.findOne({ where: { id } });
    if (!getOne) {
      throw new NotFoundException('the Author Not Found');
    }
    const oldImage = getOne.image;
    if (oldImage) {
      const imagePath = join(
        __dirname,
        '..',
        '..',
        'uploads',
        'authors',
        oldImage,
      );

      try {
        await unlink(imagePath);
      } catch (err) {
        console.warn(`Failed to delete old image: ${imagePath}`, err);
      }
    }
    await this.authorRepository.remove(getOne);
  }
}
