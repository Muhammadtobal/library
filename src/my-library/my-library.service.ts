import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMyLibraryDto } from './dto/create-my-library.dto';
import { UpdateMyLibraryDto } from './dto/update-my-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MyLibrary } from './entities/my-library.entity';
import { ReadPosition } from 'fs';
import { Repository } from 'typeorm';

@Injectable()
export class MyLibraryService {
  constructor(
    @InjectRepository(MyLibrary)
    private readonly myLibraryRepository: Repository<MyLibrary>,
  ) {}
  async create(userId: number): Promise<MyLibrary> {
    const result = await this.myLibraryRepository.create({
      user: { id: userId },
    });
    return await this.myLibraryRepository.save(result);
  }

  findAll() {
    return `This action returns all myLibrary`;
  }

  async findOne(id: number) {
    const getOne = await this.myLibraryRepository.findOne({
      where: { user: { id: id } },
      relations: ['user'],
    });
    if (!getOne) {
      throw new NotFoundException('the MyLibrary not found');
    }
    return getOne;
  }

  update(id: number, updateMyLibraryDto: UpdateMyLibraryDto) {
    return `This action updates a #${id} myLibrary`;
  }

  remove(id: number) {
    return `This action removes a #${id} myLibrary`;
  }
}
