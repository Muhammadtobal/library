import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMyLibraryDto } from './dto/create-my-library.dto';
import { UpdateMyLibraryDto } from './dto/update-my-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MyLibrary } from './entities/my-library.entity';
import { ReadPosition } from 'fs';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MyLibraryService {
  constructor(
    @InjectRepository(MyLibrary)
    private readonly myLibraryRepository: Repository<MyLibrary>,
    private readonly userService: UserService,
  ) {}
  async create(userId: number): Promise<MyLibrary> {
    const result = await this.myLibraryRepository.create({
      user: { id: userId },
    });
    return await this.myLibraryRepository.save(result);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
  ): Promise<{ data: MyLibrary[]; pagination: any }> {
    let { page, limit, allData, sortBy, order } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };
    const { data, pagination } = await paginate<MyLibrary>(
      this.myLibraryRepository,
      ['user'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    return { data, pagination };
  }

  async findOne(id: number): Promise<MyLibrary> {
    // const getOne = await this.myLibraryRepository.findOne({
    //   where: { user: { id: userId } },
    //   relations: ['user', 'reviews'],
    // });
    const getOne = await this.myLibraryRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!getOne) {
      throw new NotFoundException('the MyLibrary not found');
    }
    return getOne;
  }

  async update(
    id: number,
    updateMyLibraryDto: UpdateMyLibraryDto,
  ): Promise<MyLibrary> {
    const getOne = await this.findOne(id);
    if (updateMyLibraryDto.userId) {
      const getUser = await this.userService.findOne(updateMyLibraryDto.userId);
      getOne.user = getUser;
    }
    const updateData = Object.assign(getOne, updateMyLibraryDto);
    const { userId, ...rest } = updateData;
    return await this.myLibraryRepository.save(rest);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.myLibraryRepository.delete(id);
  }

  async getLibraryByUser(id: number): Promise<MyLibrary> {
    const getOne = await this.myLibraryRepository.findOne({
      where: { user: { id: id } },
      relations: ['user'],
    });
    if (!getOne) {
      throw new NotFoundException('the library by this userId not found');
    }
    return getOne;
  }
}
