import { Test, TestingModule } from '@nestjs/testing';
import { SaveBookService } from './save-book.service';

describe('SaveBookService', () => {
  let service: SaveBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaveBookService],
    }).compile();

    service = module.get<SaveBookService>(SaveBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
