import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaveBookDto } from './dto/create-save-book.dto';
import { UpdateSaveBookDto } from './dto/update-save-book.dto';
import { SaveBook } from './entities/save-book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyLibraryService } from 'src/my-library/my-library.service';
import { BookService } from 'src/book/book.service';
import { PaginationQueryDto } from 'src/utils/paginateDto';
import { paginate } from 'src/utils/paginate';

@Injectable()
export class SaveBookService {
  constructor(
    @InjectRepository(SaveBook)
    private readonly saveRepository: Repository<SaveBook>,
    private readonly muLibraryService: MyLibraryService,
    private readonly bookService: BookService,
  ) {}
  async create(
    createSaveBookDto: CreateSaveBookDto,
    req: any,
  ): Promise<SaveBook> {
    const userId = req.user.userId;
    const role = req.user.role;
    const getMyLibrary =
      role === 'user'
        ? await this.muLibraryService.getLibraryByUser(userId)
        : null;
    const getBook = await this.bookService.findOne(createSaveBookDto.bookId);
    const { bookId, ...createSaveBookDtoWithOutBook } = createSaveBookDto;
    const createSave = this.saveRepository.create({
      ...createSaveBookDtoWithOutBook,
      book: getBook,
      myLibrary: getMyLibrary,
    });
    return await this.saveRepository.save(createSave);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
    filters: any,
    req: any,
  ) {
    let { page, order, limit, sortBy, allData } = paginationQueryDto;
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const sortField = sortBy || 'id';

    const sort: Record<string, 'ASC' | 'DESC'> = {
      [sortField]: order === 'asc' ? 'ASC' : 'DESC',
    };
    const role = req.user.role;

    const userId = req.user.userId;

    if (role !== 'admin') {
      const getMyLibrary = await this.muLibraryService.getLibraryByUser(userId);
      filters.myLibrary = { id: getMyLibrary.id };
    }
    const { data, pagination } = await paginate<SaveBook>(
      this.saveRepository,
      ['myLibrary', 'book'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
    return { data, pagination };
  }

  async findOne(id: number) {
    const getOne = await this.saveRepository.findOne({
      where: { id },
      relations: ['book', 'myLibrary'],
    });
    if (!getOne) {
      throw new NotFoundException('the saveLibrary not found');
    }
    return getOne;
  }

  async update(id: number, updateSaveBookDto: UpdateSaveBookDto) {
    const getOne = await this.findOne(id);
    if (updateSaveBookDto === undefined || updateSaveBookDto === null) {
      return getOne;
    }
    if (updateSaveBookDto.bookId) {
      const getBook = await this.bookService.findOne(updateSaveBookDto.bookId);
      getOne.book = getBook;
    }
    const { bookId, ...rest } = updateSaveBookDto;
    const updateData = Object.assign(getOne, rest);
    return await this.saveRepository.save(updateData);
  }

  async remove(id: number, req: any): Promise<void> {
    const userId = req.user.userId;
    const getMyLibrary = await this.muLibraryService.getLibraryByUser(userId);
    const getBook = await this.bookService.findOne(id);
    const getSave = await this.saveRepository.findOne({
      where: { myLibrary: { id: getMyLibrary.id }, book: { id: getBook.id } },
      relations: ['book', 'myLibrary'],
    });
    if (!getSave) {
      throw new NotFoundException('book in your library not found');
    }
    await this.saveRepository.remove(getSave);
  }
}
